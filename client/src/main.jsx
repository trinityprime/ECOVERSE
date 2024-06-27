import React from 'react'//This imports the main React library, which is necessary for writing React components and using JSX (JavaScript XML).
import ReactDOM from 'react-dom/client'// creating a root and rendering components in React 18.
import App from './App.jsx'//is typically the root component of the application that contains other components.
import './index.css'//CSS file for global styles that apply to the entire application.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
