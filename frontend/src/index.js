import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper />
    <ToastContainer
      position="top-right"
      autoClose={1500} 
      hideProgressBar={false}
      newestOnTop={true}  //Ensures new toasts appear at the top instantly
      closeOnClick
      pauseOnHover={false}  //Prevents pausing when hovered
      draggable={false}  //Avoids unnecessary dragging
      theme="light"
      limit={5}  //Allows multiple toasts to appear together
      style={{ zIndex: 9999 }}
    />
  </React.StrictMode>
);
