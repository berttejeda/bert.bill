import React,{useEffect, useState} from 'react';

import './Footer.scss'

// WebTerminal Component
import XTerm from "../XTerm/XTerm";
import {FormControl, InputGroup} from "react-bootstrap";

export default function Footer(lesson, {children}) {

  const [wsUrl, setWSUrl] = useState("");
  const [input, setInput] = useState("");

  /* Below adjustments are for the footer area
  not to spill over the lesson content
  TODO, figure out why I can't get these to work
  as css classes
  */

  const footerAdjustment = {
    padding: "20px",
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "20rem",
    width: "100%",
  };

  const heightAdjustment = {
    display: "block",
    padding: "20px",
    height: "20rem",
    width: "100%"
  }; 


  const xtermAdjustment = {
    width: "100%"
  };   

  /*
    Accessor properties
    scolled and setScrolled are getter 
    and setter methods, respectively
  */
  const [scrolled,setScrolled]=useState(false);
  
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

  const handleSocketChange=(socketURL) => {    
    setWSUrl(socketURL)
  }

   useEffect(() => {

      try {
        fetch(process.env.REACT_APP_API_URI_GET_FOOTER).then(res => res.json()).then(data => {
          setWSUrl(data.address);
          console.log("Successfully updated Footer Websocket Address: ", wsUrl);
        });
      } catch (e) {
        console.log(e)
      }

  }, [lesson]);   

  useEffect(() => {
    
    // Call the handleScroll function when we are vertically scrolling
    window.addEventListener('scroll',handleScroll)

  },[])

  // Initialize the navbar with this class
  let footerClasses=['footer-container'];
    /* 
      Add the 'scrolled' class to the navbar as 
      per the 'scroll' event listener above
    */
    if(scrolled){
      footerClasses.push('scrolled');
  }

  return (

  <div className='footer-container'>
      <div style={heightAdjustment} />
      <div className={footerClasses.join(" ")} style={footerAdjustment}>
        <header>
          <InputGroup className="mb-3">
            <FormControl
              placeholder={'You can enter a different webterminal socket URL'}
              aria-label="Websocket URL"
              aria-describedby="wsUrl"
              value={input.value}
              onChange={(value) => setInput(value.target.value)}
              defaultValue={wsUrl}
            />
            <InputGroup.Text id="wsUrl"></InputGroup.Text>
            <button onClick={() => handleSocketChange(input)}>Connect</button>
          </InputGroup>
          { (wsUrl) ? <div></div> : <div>Couldn't connect to Webterminal agent<br />
            You can start one locally via docker with:<br />
            <code>docker run -it --name webterminal --rm -p 10001:10001 berttejeda/bill-webterminal</code><br />
            Make sure to refresh this page once your agent is running.
            Read more at <a href="https://github.com/berttejeda/bert.bill.webterminal">https://github.com/berttejeda/bert.bill.webterminal</a></div>
          }
        </header>
        { (wsUrl && lesson) ?
          <div style={xtermAdjustment}>
          <XTerm key={wsUrl} wsUrl={wsUrl} lesson={lesson} />
          </div>
          :
          <div/>
        }
        
      </div>


  </div>

  );

};