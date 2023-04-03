import React,{useEffect, useState} from 'react';

import './Footer.scss'

// WebTerminal Component
import XTerm from "../XTerm/XTerm";
import {FormControl, InputGroup} from "react-bootstrap";

export default function Footer(lesson, {children}) {

  const [wsUrl, setWSUrl] = useState("");
  const [input, setInput] = useState("");

  // Initialize the footer with this class
  let footerClasses=['footer-container'];
  
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

  return (

  <div className={footerClasses}>
      <div>
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