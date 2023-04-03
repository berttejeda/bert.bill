// React core
import { BrowserRouter as Router } from 'react-router-dom';
import React, { FunctionComponent, useState } from "react";
import ReactDOM from 'react-dom'

// Hot-reloader logic
import { hot, AppContainer } from 'react-hot-loader';

// Lesson App
import App from './App'

ReactDOM.render(
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  ,
  document.getElementById('app')
);

if(module.hot){
    module.hot.accept()
}