import React,{useEffect, useState} from 'react';

// For base64 decode/encode
import { Buffer } from 'buffer'

// Component Styling
import './TopNavBar.scss'

// Main Logo
import logo_api_inactive from '../../assets/logo_api_inactive.png'
import logo_api_active from '../../assets/logo_api_active.png'

// RightPane component
import RightPane from '../RightPane/RightPane'

import {
  Button,
  Form,
  FormControl,
  Modal,
  Navbar,
  Nav,
  NavDropdown
} from "react-bootstrap";

export default function TopNavBar({ apiPing, isCollapsed, setIsCollapsed, loadLesson }) {

  // For the 'About' modal
  const [showAbout, setShowAbout] = React.useState(false);
  const onCloseAbout = () => setShowAbout(false);
  const onClickAbout = () => setShowAbout(true);

  // TODO - Move this into its own component
  const AboutModal = 
  <Modal
    dialogClassName="modal-90w"
    show={showAbout}
    onHide={onCloseAbout}
    keyboard={false}
    >
    <Modal.Header>
    <Modal.Title>BILL - Bert's Interactive Lesson Loader</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    Think <a href="https://katacoda.com" target="_blank">Katacoda</a>, but instead of a website with learning examples, 
    you have a desktop app that creates hands-on lessons from 
    markdown-formatted, jina-templated documents, 
    complete with a web terminal for interactive practice.
    Read more here: <a href="https://github.com/berttejeda/bert.bill" target="_blank">https://github.com/berttejeda/bert.bill</a>
    </Modal.Body>
    <Modal.Footer>
    <Button variant="secondary" onClick={onCloseAbout}>
    Close
    </Button>
    </Modal.Footer>
  </Modal>

  // For tracking vertical scrolling
  const [scrolled,setScrolled]=useState(false);
  
  // For receiving the list of topics
  // from the python process
  const [topics, setTopics] = useState([])

  // For receiving the list of os commands
  // from the python process
  const [osCommands, setCommands] = useState('[]')

  const timeStyle = {
    position: "fixed",
    left: "0",
  };  

  /* 
    If the current value of window.scrollY 
    (vertical scroll length in pixels) exceeds 200
    change the boolean value of the 'scrolled' accessor
    to true, otherwise set to false
  */
  const handleScroll=() => {
    const offset=window.scrollY;
    if(offset > 200 ){
      setScrolled(true);
    }
    else{
      setScrolled(false);
    }
  }

  // For handling Modal/Pop-Up
  const [isModalOpen, setModalIsOpen] = useState(false);
  const toggleModal = () => {
    setModalIsOpen(!isModalOpen);
  };

  const handleSearchSubmit = (event) => {
     /* handle form submit here */
     const searchTerm = event.target.value;
     console.log("Search term: ", searchTerm)
  }

  handleLoadLesson = (lessonURI) => {

      fetch(process.env.REACT_APP_API_URI_LOAD_LESSON, {  
          method: 'POST',  
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },  
           body: JSON.stringify({
            uri: lessonURI
           })
      }).then(function (response) {  
        
        if(response.status!=200) {
          console.log("Failed to retrieve encoded lesson, HTTP error was: ", response.statusText);
        } else {
          response.json().then(function(data) {
            loadLesson(data.encodedLesson);
            console.log("Successfully retrieved encoded lesson");
          });
        }

      }).catch(function (error) {  
        console.log("Failed to retrieve encoded lesson, error was: ", error);
      });

  }

  useEffect(() => {

    fetch(process.env.REACT_APP_API_URI_GET_TOPICS).then(res => res.json()).then(data => {
      setTopics(data.topics);
    });

    // Call the handleScroll function when we are vertically scrolling
    window.addEventListener('scroll',handleScroll)
    
  }, []);

  // Initialize the navbar with this class
  let navbarClasses=['topnavbar'];
    /* 
      Add the 'scrolled' class to the navbar as 
      per the 'scroll' event listener above
    */
    if(scrolled){
      navbarClasses.push('scrolled');
  }

  return (

  <div className='topnavbar-container'>  
  <div className={navbarClasses.join(" ")} >
    <Navbar bg="light" expand="lg">
      { (apiPing) ?
      <Navbar.Brand href="#home"><img className='logo' src={logo_api_active} alt="bert.bill"/></Navbar.Brand>
      :
      <Navbar.Brand href="#home"><img className='logo' src={logo_api_inactive} alt="bert.bill"/></Navbar.Brand>
      }
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home"><span className='span-nav-link' onClick={onClickAbout}>About</span>{AboutModal}</Nav.Link>
          <NavDropdown title="Available Topics" id="basic-nav-dropdown">
            { (topics != []) ?
              Object.keys(topics).map(topicKey =>
                <NavDropdown title={topicKey} key={topicKey} id={"basic-nav-dropdown-" + topicKey}>
                {Object.entries(topics[topicKey].lessons).map(([lessonDataKey, lessonData]) =>
                      <NavDropdown.Item href='#' key={topicKey + "-" + lessonData.name} onClick={() => {handleLoadLesson(lessonData.url)}}>
                      {lessonData.name}
                      </NavDropdown.Item>
                )}
                </NavDropdown>
              )
              :<NavDropdown.Item>No Lesson Data Available</NavDropdown.Item>
            }
          </NavDropdown>
          <NavDropdown title="Utilities" id="basic-nav-dropdown">
            <NavDropdown title="Lesson Tools" id="basic-nav-dropdown">
              <NavDropdown.Item href="#" onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? 'Hide' : 'Show'} lesson loader
              </NavDropdown.Item>
            </NavDropdown>
          </NavDropdown>
        </Nav>
        {/*<input type="text" onKeyPress={event => event.key === "Enter" && handleSubmit(this.text)} />*/}
        {/*<input type="text" onKeyPress={edValueKeyPress()} onKeyUp={edValueKeyPress()} />*/}
        {/*<input type="text"
        placeholder="Enter search term"
        onKeyPress={event => event.key === "Enter" && 
        handleSearchSubmit(event)} 
        />*/}
        {/*<Form className="d-flex">
          <FormControl
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
          />
          <Button variant="outline-success">Search</Button>
        </Form>*/}
      </Navbar.Collapse>
    </Navbar>
  </div>

  </div>
  );
};
