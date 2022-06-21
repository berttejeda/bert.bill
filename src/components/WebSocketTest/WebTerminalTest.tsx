import React, { 
  useCallback
  useLayoutEffect
  useRef
  useState
  useEffect } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit'; 
import { AttachAddon } from 'xterm-addon-attach';
import { WebLinksAddon } from 'xterm-addon-web-links';
import useWebSocket, { 
  ReadyState } from 'react-use-websocket';


let term;
let searchAddon;
let fitAddon;
let protocol;
let socketURL;
let socket;
let pid;
let curFont;
let curTheme;
let alive;
let fontSize;

let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

export default function WebTerminalTest() {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState('ws://127.0.0.1:5000');
  const [messageHistory, setMessageHistory] = useState([]);

  const {
    sendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory(prev => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickChangeSocketUrl = useCallback(() =>
    setSocketUrl('ws://127.0.0.1:5000'), []);

  const handleClickSendMessage = useCallback(() =>
    sendMessage(JSON.stringify({"message":"ping"})), []);

  // Sends the innerText of the target element
  // to the current socket
  const handleCodeClick=(e) => {
    window.pywebview.api.log('info', `Sending data to socket: ${e.target.innerText}`)
    socket.current.send(e.target.innerText + '\n')
    socket.tty.send(e.target.innerText + '\n')
  }

  // Event listener for the handleCodeClick function
  const addClickEvents=() => {
    alert('Adding click events!')
    const elements = document.querySelectorAll('.clickable-code')
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

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>
      <button
        onClick={handleClickChangeSocketUrl}
      >
        Click Me to change Socket Url
      </button>
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send 'Hello'
      </button><br />
      <span>The WebSocket is currently {connectionStatus}</span>
      <br />
      {lastMessage ? <p>Last message received: <br />{lastMessage.data}</p> : null}
      {messageHistory
        .map((message, idx) => <p key={idx}>{message ? message.data : null}</p>)}
    </div>
  );
};