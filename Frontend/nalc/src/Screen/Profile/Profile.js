import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import nalcLogo from '../../nalcLogo.png';
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCheck, faXmark, faPenToSquare, faRightToBracket} from '@fortawesome/free-solid-svg-icons'

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState({
    name: '',
    email: '',
    password: '',
  })
  const navigate = useNavigate();

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

  useEffect(() => {
    // Fetch user profile information
    fetchUserProfile();
  }, []); // Run once on component mount

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('https://nalc-backend-ebe218d27802.herokuapp.com/api/users/details/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setUserProfile(response.data); // Assuming response.data contains user information
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Handle error or redirect to login page
    }
  };

  const toggleEditMode = () => {
    setTempProfile(userProfile);
    setEditMode(!editMode);
  };

  const handleSaveChanges = async () => {
    try {
      // Perform API call to update user information
      const response = await axios.patch(
        'https://nalc-backend-ebe218d27802.herokuapp.com/api/users/update/',
        tempProfile, // Send updated user profile data
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      setUserProfile(response.data); // Assuming response.data contains updated user information
      setTempProfile({}); // Clear temporary profile after successful update
      toggleEditMode(); // Exit edit mode after successful update
    } catch (error) {
      console.error('Error updating user profile:', error);
      // Handle error
    }
  };

  const handleNameChange = (e) => {
    setTempProfile((prevTempProfile) => ({
      ...prevTempProfile,
      name: e.target.value,
    }));
  };
  
  const handleEmailChange = (e) => {
    setTempProfile((prevTempProfile) => ({
      ...prevTempProfile,
      email: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setTempProfile((prevTempProfile) => ({
      ...prevTempProfile,
      password: e.target.value,
    }));
  };

  const goBack = () => {
    navigate('/home');
  }

  return (
    <div>
      <div className='big-space'></div>
      <div className='row logo-r'>
        <img src={nalcLogo} alt="NALC Logo" />
      </div>
      <div className='title-r'>
        <div className='row'>
          <h1 className='text-maroon'><strong>User Profile</strong></h1>
        </div>
        <div>
          {editMode ? (
            <div>
              <p className='text-maroon'><h3><strong>Username: </strong></h3></p>
              <div className='inputField' style={{width: 370, height: 48, position: 'relative'}}>
                <input
                  type='text' name='name' class="form-control" id="floatingInput"
                  value={tempProfile.name || ''} onChange={handleNameChange}
                />
                <div style={{width: 6, height: 35, left: 0, top: 0, position: 'absolute'}} />
              </div>
              <p className='text-maroon'><h3><strong>Email: </strong></h3></p>
              <div className='inputField' style={{width: 370, height: 48, position: 'relative'}}>
                <input type='email' name='email' class="form-control" id="floatingInput"
                  value={tempProfile.email || ''} onChange={handleEmailChange}
                />
                <div style={{width: 6, height: 35, left: 0, top: 0, position: 'absolute'}} />
              </div>
              <p className='text-maroon'><h3><strong>Password: </strong></h3></p>
              <div className='inputField' style={{width: 370, height: 48, position: 'relative'}}>
              <input type='password' name='password' class="form-control" id="floatingInput"
                value={tempProfile.password || ''} onChange={handlePasswordChange}
              />
                <div style={{width: 6, height: 35, left: 0, top: 0, position: 'absolute'}} />
              </div>
              <button className='btn-registered' onClick={handleSaveChanges}>
                <FontAwesomeIcon icon={faCheck} style={{color: "#541212",}}/>
                &nbsp; Save Changes
              </button>
              <button className='btn-registered' onClick={toggleEditMode}>
                <FontAwesomeIcon icon={faXmark} style={{color: "#541212",}}/>
                &nbsp; Cancel
              </button>
            </div>
          ) : (
            <div>
              <p className='text-maroon'><h3><strong>Username: </strong></h3></p>
              <div className='inputField' style={{width: 370, height: 48, position: 'relative'}}>
                <p class="form-control">{userProfile.name}</p>
                <div style={{width: 6, height: 35, left: 0, top: 0, position: 'absolute', background: '#841818'}} />
              </div>
              <p className='text-maroon'><h3><strong>Email: </strong></h3></p>
              <div className='inputField' style={{width: 370, height: 48, position: 'relative'}}>
                <p class="form-control">{userProfile.email}</p>
                <div style={{width: 6, height: 35, left: 0, top: 0, position: 'absolute', background: '#841818'}} />
              </div>
              <button className='btn-registered' onClick={toggleEditMode}>
                <FontAwesomeIcon icon={faPenToSquare} style={{color: "#541212",}}/>
                &nbsp; Edit
              </button>
              <button className='btn-registered' onClick={goBack}>
                <FontAwesomeIcon icon={faRightToBracket} style={{color: "#541212",}}/>
                &nbsp; Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;