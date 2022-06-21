// React core
import React, { FunctionComponent, useState } from "react";
import ReactDOM from 'react-dom'

// Hot-reloader logic
import { hot, AppContainer } from 'react-hot-loader';

// Lesson App
import App from './components/App/App'

ReactDOM.render(
    <App />,
  document.getElementById('app')
);

if(module.hot){
    module.hot.accept()
}