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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
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

function hashString(string) {
  var hash = 0,
    i, chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return String(Math.abs(hash)).substring(0,6);
}

function flatten(obj, suffix, ans) {

  for (var x in obj) {
      var key;
      if (suffix != '')
        key = suffix + '|' + x;
      else
        key = x;
    if (typeof obj[x] === 'object') {
      flatten(obj[x], key, ans);
    } else {
      ans[key] = obj[x];
    }
  }
}

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
  const [flattenedTopics, setFlattenedTopics] = useState({})
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

  // { 
  //   Object.keys(topics).forEach(topicName =>
  //     topics[topicName]['lessons'].forEach(lessonObj =>
  //       console.log(lessonObj)
  //     )
  //   ) 
  // }

  let topic_dict = {};

  // function newD(obj, ans) {

  //   for (var x in obj) {
  //     for i in topics[x].lessons{
  //       console.log(x)
  //       console.log(topics[x].lessons[i])
  //     }
  //   }
  // }  

  // useEffect(() => {
  //   {
  //     // console.log(Object.keys(topics).length)
  //     if (Object.keys(topics).length > 0){
  //       // console.log(Object.keys(topics))
  //       // console.log(Object.entries(topics))
  //       // console.log(Object.keys(topics).slice(2))
  //       //   console.log(key)
  //       // )
  //       // let f = {};
  //       // newD(topics, f)
  //       // flatten(topics, "", f)
  //       // setFlattenedTopics(f)

  //     (rowsPerPage > 0
  //       ? Object.keys(topics).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  //       : Object.keys(topics)
  //     ).map((topicName) => (
  //       console.log(topicName)
  //     )

  //     }
  //   }
  // },[topics])

  // useEffect(() => {
  //   console.log(flattenedTopics)
  //   // (rowsPerPage > 0
  //   //   ? Object.entries(flattenedTopics).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  //   //   : Object.entries(flattenedTopics)
  //   // ).map((topicObj) => (
  //   //   console.log(topicObj)
  //   // )

  // },[flattenedTopics])   

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
            <StyledTableCell align="left">Lesson Name</StyledTableCell>
            <StyledTableCell align="left">Lesson Source URL</StyledTableCell>
            <StyledTableCell align="left">Lesson Duration (minutes)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            (
              rowsPerPage > 0
              ? Object.keys(topics).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : Object.keys(topics)
            ).map((topicName)=> {
              {
                return Object.entries(topics[topicName].lessons).map(([lessonDataKey, lessonData]) =>
                <StyledTableRow 
                key={topicName + '_' + lessonData['name']}
                hover=true
                onClick={() => {
                  handleRowOnClick(topicName, lessonData);
                }}
                >
                  <TableCell component="th" scope="row" style={{ width: 160 }}>
                    {topicName.substring(0,3).toUpperCase() + hashString(topicName + '_' + lessonData['name'])}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    {lessonData['name']}
                  </TableCell>                  
                  <TableCell style={{ width: 160 }} align="left">
                    {lessonData['url']}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    {lessonData['duration']}
                  </TableCell>
                </StyledTableRow>
                )
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
              count={Object.keys(topics).length}
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
