import React, { useRef, useState } from 'react';

export default function Clippy() {

  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);

  function getSelectionText(){
    var selectedText = ""
    if (window.getSelection){ // all modern browsers and IE9+
      selectedText = window.getSelection().toString()
    }
    return selectedText
  }

  window.addEventListener('mouseup', function(){
      var thetext = getSelectionText()
      if (thetext.length > 0) { // check there's some text selected
          copyToClipboard(thetext);
      }
  }, false)

  function copyToClipboard(e) {
    document.execCommand('copy'); // short for document.execCommand('copy',e);
    setCopySuccess('Copied!');
  };

  return (
    <div>
    </div>
  );
}