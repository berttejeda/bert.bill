import * as React from 'react'

import './Input.scss'

export default function Input({ }) {

  const [value, setValue] = React.useState('')

  const onChange = (event) => {
    setValue(event.target.value);
  };
  
  return (
    <div className='input-container'>
      <input 
      className='textinput'
      placeholder='URL'
      value={value}
      onChange={onChange}
      />
      <br/>
      <br/>
      <button className='button' onClick={() => {
        window.pywebview.api.load_lesson(value)
      }}>Load</button>
    </div>
  )
}
