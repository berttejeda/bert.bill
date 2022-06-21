import React, { useRef, useState } from 'react'
import IframeResizer from 'iframe-resizer-react'

export default function Iframe(props) {
  
  const iframeRef = useRef(null)

  return (
    <>
      <IframeResizer
        forwardRef={iframeRef}
        heightCalculationMethod="lowestElement"
        inPageLinks
        log
        src={props.url}
        style={{ width: '1px', minWidth: '100%', height: '200px'}}
      />
    </>
  )
}