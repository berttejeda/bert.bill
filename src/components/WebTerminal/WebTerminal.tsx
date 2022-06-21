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

export default function WebTerminal(props) {

  const ws = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState('');
  const [readyState, setReadyState] = useState('linking ');
  const [oncloseReason, setOncloseReason] = useState('');
  const [terminal, setTerminal] = useState(null)

  const stateArr = [
    'Websocket is linking',
    'Websocket is linked and can communicate',
    'Websocket connection is closing',
    'Websocket connection closed or link failed',
  ];

  // Sends the innerText of the target element
  // to the current socket
  const handleCodeClick=(e) => {
    ws.current.send(e.target.innerText + '\n')
  }

  // Event listener for the handleCodeClick function
  const addClickEvents=() => {
    const elements = document.querySelectorAll('.clickable-code')
    
    elements.forEach(element => {
        element.addEventListener('click', handleCodeClick);
    });
  }

  const webSocketInit = useCallback(() => {

    if (!ws.current || ws.current.readyState === 3) {
      ws.current = new WebSocket(props.socketUrl);
      ws.current.onopen = function (event) {
        terminal.writeln('\x1b[1;1;32mTerminal Ready!\x1b[0m');
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      }
      ws.current.onclose = function (event) {
        var reason;
        // See http://tools.ietf.org/html/rfc6455#section-7.4.1
        if (event.code == 1000)
            reason = "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
        else if(event.code == 1001)
            reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
        else if(event.code == 1002)
            reason = "An endpoint is terminating the connection due to a protocol error";
        else if(event.code == 1003)
            reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
        else if(event.code == 1004)
            reason = "Reserved. The specific meaning might be defined in the future.";
        else if(event.code == 1005)
            reason = "No status code was actually present.";
        else if(event.code == 1006)
           reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
        else if(event.code == 1007)
            reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
        else if(event.code == 1008)
            reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
        else if(event.code == 1009)
           reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
        else if(event.code == 1010) // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
            reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
        else if(event.code == 1011)
            reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
        else if(event.code == 1015)
            reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
        else
            reason = "Unknown reason";
        console.log("Websocket Closure Reason: " + reason);
        setOncloseReason(reason);
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      };        
      ws.current.onerror = e =>
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      ws.current.onmessage = e => {
        setMessage(e.data);
      };
    }    

    // Initialize the terminal object
    const terminal = new Terminal({
      rendererType: 'canvas',
      convertEol: true,
      cursorBlink: true,
      cursorStyle: 'block',
      macOptionIsMeta: true,
      scrollback: true,
    });      
    // Initialize Terminal Addons
    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon();
    // For attaching to the socket
    const attachAddon = new AttachAddon(ws.current);
    // Load terminal add-ons
    terminal.loadAddon(webLinksAddon);
    terminal.loadAddon(fitAddon);
    // Attach the terminal to the socket
    terminal.loadAddon(attachAddon);
    var terminalContainer = document.getElementById(props.terminalID)
    // terminalContainer.innerHTML = ''    
    terminal.open(terminalContainer)
    // Ensure the size of the WebTerminal
    // matches the parent element 
    terminal.loadAddon(fitAddon)
    fitAddon.fit()
    // Load the terminal component
    setTerminal(terminal)

  }, [ws]);

  useLayoutEffect(() => {

    /**
     *Initialize websocket
     *The websocket acoustic method is used to obtain information
     *  */
    webSocketInit();
    return () => {
      ws.current?.close();
    };
  }, [ws, webSocketInit]);

  return (

      <div id={props.terminalID}>
      Connection Status: {readyState}<br />
      <pre>
      { (oncloseReason) ?
        'Websocket Closure Reason:\n' + oncloseReason:null
      }
      </pre>  
      </div>      
  );
};

// Default Properties
WebTerminal.defaultProps = {
    terminalID: "webterminal",
    socketUrl: "ws://127.0.0.1:10000/ws",
}