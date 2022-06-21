import React, { 
  useState, 
  useCallback, 
  useEffect } from 'react';

import useWebSocket, { 
  ReadyState } from 'react-use-websocket';

export default function WebTerminal() {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState('ws://127.0.0.1:8080');
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
      <span>The WebSocket is currently {connectionStatus}({readyState})</span>
      <br />
      {lastMessage ? <p>Last message received: <br />{lastMessage.data}</p> : null}
      {messageHistory
        .map((message, idx) => <p key={idx}>{message ? message.data : null}</p>)}
    </div>
  );
};