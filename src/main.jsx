import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter basename="/video-sharing-platform-react">
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)
