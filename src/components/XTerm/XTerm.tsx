import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from 'xterm-addon-web-links';
import { AttachAddon } from 'xterm-addon-attach';
import useWebSocket from "react-use-websocket";
import 'xterm/css/xterm.css';

export interface XTermProps {
  ws?: WebSocket;
  wsUrl?: string;
  wsRef?: React.MutableRefObject<WebSocket>;
}

let alive;
let curFont;
let fontSize;
let reason;

let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

export default function XTerm({
  ws,
  wsUrl,
  lesson,
  wsRef,
  ...props
}: XTermProps & JSX.IntrinsicElements["div"]) {
  const divRef = useRef<HTMLDivElement>();
  const xtermRef = useRef<Terminal>();
  const [oncloseReason, setOncloseReason] = useState('');
  
  const [socketUrl, setSocketUrl] = useState(wsUrl);
  const { sendMessage, readyState, getWebSocket } = useWebSocket(socketUrl);


  // const { readyState, getWebSocket } = useWebSocket(wsUrl);
  const [connectionStatus, setConnectionStatus] = useState('');
  
  const isWindows = ['Windows', 'Win16', 'Win32', 'WinCE'].indexOf(navigator.platform) >= 0;
  const closeEvent = new Event('terminalClose');
  const promptEvent = new Event('promptReady');

  const socket = getWebSocket();

  // Sends the innerText of the target element
  // to the current socket
  const handleCodeClick = (e) => {
      let wsData = e.target.innerText
      console.log("Sending data: ", wsData)
      // socket.current.send(e.target.innerText + '\n')
      sendMessage(wsData + '\n')
  }

  // Event listener for the handleCodeClick function
  const addClickEvents=() => {
    // Select elements whose class is 'clickable-code' or
    // those elements whose tag is 'code'
    const elements = document.querySelectorAll('.clickable-code,code')
    elements.forEach(element => {
        element.addEventListener('click', handleCodeClick);
    });
  }

  function setFont(terminalObj, font) {
      let fonts = "monospace";
      fonts = "'"+font+"', "+fonts;
      terminalObj.setOption('fontFamily', fonts);
  }  

  function fitFont(terminalObj, font) {
    curFont = font;
    setFont(terminalObj, font);
    setFont(terminalObj, 'Ubuntu Mono');
    setFont(terminalObj, font);
  }

  useEffect(() => {

    addClickEvents()
    setSocketUrl(wsUrl)

  }, [lesson])   

  const readyStateText = {
    [WebSocket.CONNECTING]: "Connecting",
    [WebSocket.OPEN]: "Open",
    [WebSocket.CLOSING]: "Closing",
    [WebSocket.CLOSED]: "Closed"
  }[readyState];  

  useEffect(() => {

    if (socket) {
      const xterm = (
        xtermRef.current = new Terminal({
          rendererType: 'canvas',
          convertEol: true,
          cursorBlink: true,
          cursorStyle: 'block',
          macOptionIsMeta: true,
          scrollback: 10000,
          tabStopWidth: 10,
          windowsMode: isWindows
        })
      );

    // Initialize Terminal Addons
      const fitAddon = new FitAddon()
      const webLinksAddon = new WebLinksAddon();
      // Load terminal add-ons
      xterm.loadAddon(webLinksAddon);
      xterm.loadAddon(fitAddon);

      xterm.open(divRef.current);

      fitAddon.fit();
      xterm.focus();
      window.term = xterm

      let cols = xterm.cols;
      let rows = xterm.rows;
      let terminalPID = wsUrl.split("/").at(-1)

      let data = {'rows': rows, 'cols': cols}
      let requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
      };
      fetch(`/api/terminals/${terminalPID}/size?cols=${cols}&rows=${rows}`, requestOptions)
      .then(response => console.log('Successfully resized terminal!'))
      
      fontSize = xterm.getOption('fontSize');

      if (readyStateText != "Open") {
        socket.onopen = function (event) {
        // Attach the terminal to the websocket
        xterm.loadAddon(new AttachAddon(socket));
        setConnectionStatus('Open')
        xterm._initialized = true;
        curFont = 'Ubuntu Mono';
        fitFont(xterm, curFont);
        let timer = setInterval( () => {
          if(term !== undefined) {
            fitFont(xterm, curFont);
            window.dispatchEvent(promptEvent);
            clearInterval(timer);
          }
        }, 200);
        }  

      }

    }
  }, [socket, lesson]);

  return (
    <div
      
      bordered="true"
      shaded="true"
      bodyfill="true"
    >
      <div ref={divRef} {...props} />
    </div>
  );
}
