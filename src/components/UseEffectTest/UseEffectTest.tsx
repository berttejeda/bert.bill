import React, { 
  useCallback, 
  useRef, 
  useState, 
  useEffect } from 'react';

import useWebSocket from "react-use-websocket";

export default function useEffectTest() {
  
  const reference = useRef('old');

  const someHandler = (newValue) => {
    // Access reference value:
    const value = reference.current;
    console.log('Old value: ', value)
    // Update reference value:
    console.log('Setting new value: ', newValue)
    reference.current = newValue;
  };
  
  useCallback(() => {
  someHandler('new')
  
  },[reference.current])  
  
  return(
    <React.Fragment>
      <div>useEffect Test</div>
      <button >Current reference is: {reference.current}</button>
    </React.Fragment>
  );
}