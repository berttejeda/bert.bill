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


  const [EnteredWsUrl, setEnteredWsUrl] = useState('')
  const [EnteredWsUrlIsValid, setEnteredWsUrlIsValid] = useState(false)
  const [EnteredWsUrlTouched, setEnteredWsUrlTouched] = useState(false)

  const nameInputChangeHandler = (event) => {
    setEnteredWsUrl(event.target.value)
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault()

    setEnteredWsUrlTouched(true)

    if (EnteredWsUrl.trim() === '' || !EnteredWsUrl.startsWith("ws")) {
      setEnteredWsUrlIsValid(false)
      return
    }

    setEnteredWsUrlIsValid(true)

    handleSocketChange(EnteredWsUrl)

    setEnteredWsUrl('')

  }

  const nameInputIsInvalid = !EnteredWsUrlIsValid && EnteredWsUrlTouched

  const nameInputClasses = nameInputIsInvalid
    ? 'form-control invalid mb-3'
    : 'form-control mb-3'  

  return (

  <div className={footerClasses}>
      <div>
    <form onSubmit={formSubmissionHandler}>
      <div className={nameInputClasses}>
        <label className='block text-sm gp rt' htmlFor='name'>Specify alternate Websocket Address</label>
        <input
          className='w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          type="text"
          id="wsUrl"
          placeholder="e.g. ws://127.0.0.1:10001/terminals/<terminalID>"
          aria-label="Websocket URL"
          aria-describedby="wsUrl"
          onChange={nameInputChangeHandler}
          value={EnteredWsUrl}
        />

        <button className='btn ho xi ye ml-3'>Connect</button>
        {nameInputIsInvalid && (
          <p className='block error-text text-sm gp rt'>
          Websocket URL is empty or invalid!
          </p>
        )}
      </div>
    </form>

          { (wsUrl) ? <div></div> : <div>Couldn't connect to Webterminal agent<br />
            You can start one locally via docker with:<br />
            <code>docker run -it --rm --network=host --name webterminal berttejeda/bill-webterminal</code><br />
            Make sure to refresh this page once your agent is running.
            Read more at <a href="https://github.com/berttejeda/bert.bill.webterminal">https://github.com/berttejeda/bert.bill.webterminal</a></div>
          }
        { (wsUrl && lesson) ?
          <XTerm key={wsUrl} wsUrl={wsUrl} lesson={lesson} />
          :
          <div/>
        }
        
      </div>


  </div>

  );

};