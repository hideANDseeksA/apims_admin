import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './routes/App';
import './index.css';
import axios from "axios";

// Set default Authorization header for all Axios requests
const token = localStorage.getItem("access_token");
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
