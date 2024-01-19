import React, { useState } from 'react';
import axios from 'axios';
import './AdminScreen.css'
import nalcLogo from '../../nalcLogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUpload, faRightFromBracket} from '@fortawesome/free-solid-svg-icons'

const AdminScreen = () => {
  const [file, setFile] = useState(null);

  // Set the initial token and headers
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;

  // Set the session timeout duration (30 minutes in milliseconds)
  const sessionTimeoutDuration = 30 * 60 * 1000; // 30 minutes in milliseconds

  // Function to redirect the user to the login page
  const redirectToLogin = () => {
    window.location.href = '/';
  };

  // Function to reset the session timeout
  const resetSessionTimeout = () => {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(redirectToLogin, sessionTimeoutDuration);
  };

  // Set the initial session timeout
  let sessionTimeout = setTimeout(redirectToLogin, sessionTimeoutDuration);

  // Attach an event listener to reset the session timeout on user activity
  document.addEventListener('mousemove', resetSessionTimeout);
  document.addEventListener('keydown', resetSessionTimeout);

  axios.interceptors.response.use(
    (response) => {
      resetSessionTimeout();
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      }
      return Promise.reject(error);
    }
  );

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://nalc-backend-ebe218d27802.herokuapp.com/upload-and-replace-data/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("Added Data");
      } else {
        alert("Failed to add Data");
      }
    }
    catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
  
    redirectToLogin();
  };

  return (
    <div>
      <div className="top-left">
        <button className='replaceDataBtn' onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} style={{color: "#541212",}} />
          &nbsp; Logout
        </button>
      </div>
      <div className='container-fluidity'>
      <div className="row logo">
        <img src={nalcLogo} alt="NALC Logo" />
      </div>
      <div className='titleArea'>
        <h1 className='text-maroon'><strong>Admin Dashboard</strong></h1>
      </div>
      <form className='inputJson' onSubmit={handleSubmit}>
      <label htmlFor="fileInput" className="fileInputLabel">
        JSON File:
      </label>
      <input type="file"onChange={handleFileChange}/>
        <br />
        <button className='replaceDataBtn' type="submit">
          <FontAwesomeIcon icon={faUpload} />
          &nbsp; Submit
        </button>
      </form>
    </div>
    </div>
  );
};

export default AdminScreen;