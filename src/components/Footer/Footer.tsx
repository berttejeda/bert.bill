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

  const heightAdjustment = {
    display: "block",
    padding: "20px",
    height: "20rem",
    width: "100%"
  }; 

  const xtermAdjustment = {
    width: "100%"
  };   


  const widthAdjustment = {
    width: "100px"
  }; 

  /*
    Accessor properties
    scolled and setScrolled are getter 
    and setter methods, respectively
  */
  const [scrolled,setScrolled]=useState(false);
  
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

  }, []);   

  // Initialize the navbar with this class
  let footerClasses=['footer-container'];

  return (

  <div className='footer-container'>
      <div className={footerClasses.join(" ")}>
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
            <code>docker run -it --rm --network=host --name webterminal berttejeda/bill-webterminal</code><br />
            Make sure to refresh this page once your agent is running.
            Read more at <a href="https://github.com/berttejeda/bert.bill.webterminal">https://github.com/berttejeda/bert.bill.webterminal</a></div>
          }
        </header>
        { (wsUrl && lesson) ?
          <XTerm key={wsUrl} wsUrl={wsUrl} lesson={lesson} />
          :
          <div/>
        }
        
      </div>


  </div>

  );

};