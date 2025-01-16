import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchContentByScreen } from '../services/api';  
import { useScreenId } from '../context/ScreenIdContext';
import '../styles/registerScreenstyles.css';

const RegisterScreen = () => {
  const [screenId, setScreenId] = useState('');  // State to hold the screenId input
  const [isLoading, setIsLoading] = useState(false);  // Loading state
  const [isScreenIdValid, setIsScreenIdValid] = useState(false);  // State to track if screenId is valid
  const [message, setMessage] = useState('');  // State to hold success or error message
  const [content, setContent] = useState(null);  // State to hold content for canvas
  const navigate = useNavigate();  // For navigation
  const { updateScreenId } = useScreenId();  // Get the update function from context

  // Function to check if the screenId exists in the database
  const validateScreenId = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      // Check if the screenId exists in the database
      const response = await fetchContentByScreen(screenId);
      
      // If the response has content, it means the screenId is valid
      if (response && response.length > 0) {
        setIsScreenIdValid(true);
        setContent(response);  // Store content if available
        setMessage('Screen ID is valid!');  // Show success message
      } else {
        setIsScreenIdValid(false);
        setMessage('Invalid Screen ID. Please try again.');
      }
    } catch (error) {
      setIsScreenIdValid(false);
      setMessage('Error validating Screen ID. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes for screenId
  const handleInputChange = (e) => {
    setScreenId(e.target.value);
  };

  // Handle Sync button click
  const handleSync = () => {
    if (isScreenIdValid) {
      // Navigate to the MainPage and pass the content
      navigate('/main', { state: { content, screenId } });
    }
  };

  // Handle form submission (screen registration)
  const handleRegister = async (e) => {
    e.preventDefault();
    if(!screenId){
      alert("Please enter a valid screen ID");
      return;
    }
     // Update the screenId in the context
    updateScreenId(screenId);

    // Call validateScreenId function to validate the entered screenId
    validateScreenId();
  };

  return (
    <div className='regMainContainer'>
    {isScreenIdValid ? (
      // Show synContainer if the screenId is valid
      <div className="synContainer">
        <h2>Signcast Local</h2>
        <div className='text'>
            <p>Signcast Local is a commercial software. You need a license in order to</p>
            <p>use the software</p>
        </div>
  
        {isScreenIdValid && (
          <button onClick={handleSync} className="sync-button">
              Sync Device
          </button>
        )}
  
        <p>To initialize the device click Reset Data</p>
        <p className='resetText'>Reset Data</p>
      </div>
    ) : (
      // Show register-container if the screenId is not valid
      <div className="register-container">
        <h2>Enter Screen ID</h2>
        <p>Enter Screen ID to receive your content on this device.</p>
        <form onSubmit={handleRegister} className="register-form">
             <label htmlFor="screenId">Screen ID:</label><br/>
             <input
                 type="text"
                 id="screenId"
                 value={screenId}
                 onChange={handleInputChange}
                 placeholder="Enter or paste your ID"
                 required
             />

             {message && (
                 <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                   {message}
                 </div>
             )}
             <button type="submit" disabled={isLoading}>
                 {isLoading ? 'Validating...' : 'Activate'}
             </button>
        </form>
      </div>
    )}
  </div>  
  );
};

export default RegisterScreen;