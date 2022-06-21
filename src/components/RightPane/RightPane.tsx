import React, { Component, useEffect, useState } from "react";
import { render } from "react-dom";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

// WebTerminal Component
import WebTerminal from '../WebTerminal/WebTerminal'

import {FormControl, InputGroup} from "react-bootstrap";

export default function RightPane(props) {

  const [wsUrl, setWSUrl] = useState("");
  const [input, setInput] = useState("");  

  const [state, setState] = useState({
    isPaneOpen: false,
  });

  const handleSocketChange=(socketURL) => {    
    let websocketURL = socketURL.target.value
    setWSUrl(websocketURL)
    console.log('Changed websocket URL to ', websocketURL)
  }

   useEffect(() => {

      try {
        fetch(process.env.REACT_APP_API_URI_GET_RIGHTPANE).then(res => res.json()).then(data => {
          setWSUrl(data.address);
          console.log("Successfully updated RightPane Websocket Address: ", wsUrl);
        });
      } catch (e) {
        console.log(e)
      }

  }, []);   

  return (
    <div>
      <span href="#" onClick={() => setState({ isPaneOpen: true })}>
        Show Slide-In Terminal
      </span>
      <SlidingPane
        className="sliding-pane"
        // overlayClassName can be any 
        // arbitrary class name,
        // used for extra classes
        overlayClassName="sliding-pane-overlay"
        isOpen={state.isPaneOpen}
        title="Slide-In Terminal"
        // This can be a separate WebTerminal 
        // connection if so configured ...
        subtitle=""
        onRequestClose={() => {
          // triggered on "<" on left top click or on outside click
          setState({ isPaneOpen: false });
        }}
      >
        <header>
        <input type="text"
        placeholder="Enter a new Websocket Address"
        value={wsUrl}
        onKeyPress={event => event.key === "Enter" && 
        handleSocketChange(event)} 
        />
        </header>
        { (wsUrl) ?
          <main>{wsUrl && <WebTerminal key={wsUrl} wsUrl={wsUrl} />}</main>
          :
          <main/>
        }        
      </SlidingPane>
    </div>
  );

};