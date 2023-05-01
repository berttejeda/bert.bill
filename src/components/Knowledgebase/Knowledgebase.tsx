import React,{ChangeEvent, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import IconButton from '@mui/material/IconButton';
import isEmpty from 'lodash';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { hashString, tailwindConfig, hexToRGB } from 'utils/Utils';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: tailwindConfig().theme.colors.indigo[200],
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };
  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };
  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };
  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };
  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const rows = [];

export default function Knowledgebase() {

  console.log('Rendering Knowledgebase') 

  const [apiPing, setApiPing] = useState(null);  
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const [flattendLessons, setFlattenedLessons] = useState([])
  const navigate = useNavigate();    
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [topics, setTopics] = useState([])

  useEffect(() => {

    fetch(process.env.REACT_APP_API_URI_GET_TOPICS).then(res => res.json()).then(data => {
      setTopics(data.topics);
    });

  }, []);

  useEffect(() => {

    try {
      fetch(process.env.REACT_APP_API_URI_PING).then(res => res.json()).then(data => {
        setApiPing(data.message);
      });
    } catch (e) {
      console.log(e)
    }  

  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  let topic_dict = {};

  useEffect(() => {
    if (Object.keys(topics).length > 0){

    let lessons = []
    for (var key in topics) {
      for i in topics[key].lessons{
        lessons = [...lessons, [key, topics[key].lessons[i]]]
      }
    }

    setFlattenedLessons(lessons)

    }
  },[topics])

  const [selectedRow, setSelectedRow] = useState({});
  
  const handleSelectRow = (rowData) => {
    console.log(rowData)
  }

  const handleRowOnClick = (rowName, rowData) => {
    const topicName = rowName
    const lessonName = rowData['name']
    const topic_slug = encodeURIComponent(topicName);
    const lesson_slug = encodeURIComponent(lessonName)
    const slug = `${topic_slug}/${lesson_slug}`;
    console.log(`Navigating to ${slug}`)
    navigate(slug);
  }  

  return (
    <div className='w-full'>
     
    { (apiPing) ?
        <div>One Moment Please</div>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
      <TableHead>
          <TableRow>
            <StyledTableCell>Lesson ID</StyledTableCell>
            <StyledTableCell align="left">Lesson Topic</StyledTableCell>
            <StyledTableCell align="left">Lesson Name</StyledTableCell>
            <StyledTableCell align="left">Lesson Source URL</StyledTableCell>
            <StyledTableCell align="left">Lesson Duration (minutes)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            (
              rowsPerPage > 0
              ? flattendLessons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : flattendLessons
            ).map((lessonData)=> {
              {
                {let lessonID = hashString(`${lessonData[0].substring(0,3).toUpperCase()}_${lessonData[0]}_${lessonData[1]['name']}`)}
                return <StyledTableRow 
                key={lessonID}
                hover=true
                onClick={() => {
                  handleRowOnClick(lessonData[0], lessonData[1]);
                }}
                >
                  <TableCell component="th" scope="row" style={{ width: 160 }}>
                    {lessonID}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    {lessonData[0]}
                  </TableCell>                   
                  <TableCell style={{ width: 160 }} align="left">
                    {lessonData[1]['name']}
                  </TableCell>                  
                  <TableCell style={{ width: 160 }} align="left">
                    {lessonData[1]['url']}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    {lessonData[1]['duration']}
                  </TableCell>
                </StyledTableRow>
              }
            }
            )
          }
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={flattendLessons.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>

      :
      
        <div>Couldn't ping API at {process.env.REACT_APP_API_URI_PING}<br />
        You can start your api locally via docker with:<br />
        <code>docker run -it --rm --name bill --network=host berttejeda/bill --api-only</code><br />
        Make sure to refresh this page once your API is running.
        Read more at <a href="https://github.com/berttejeda/bert.bill">https://github.com/berttejeda/bert.bill</a></div> 
        
      }

    </div>
  );
}
