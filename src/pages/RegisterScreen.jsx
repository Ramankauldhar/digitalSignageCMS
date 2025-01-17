import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkScreen, registerScreen, fetchContentByScreen } from '../services/api';  
import { useScreenId } from '../context/ScreenIdContext';
import '../styles/registerScreenstyles.css';

const WS_URL = "ws://localhost:8080";  // WebSocket Server URL

const RegisterScreen = () => {
  const [screenId, setScreenId] = useState('');  // State to hold the screenId input
  const [isLoading, setIsLoading] = useState(false);  // Loading state
  const [isScreenIdValid, setIsScreenIdValid] = useState(false);  // State to track if screenId is valid
  const [message, setMessage] = useState('');  // State to hold success or error message
  const [content, setContent] = useState(null);  // State to hold content for canvas
  const navigate = useNavigate();  // For navigation
  const { updateScreenId } = useScreenId();  // Get the update function from context
  const [socket, setSocket] = useState(null);  // Store WebSocket connection

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    
    ws.onopen = () => console.log('WebSocket Connected');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new-content' && data.screenId === screenId) {
          setContent(data.data);  // Update content in real-time
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onclose = () => console.log('WebSocket Disconnected');
    setSocket(ws);

    return () => ws.close();  // Cleanup on unmount
  }, [screenId]);


  // Function to check if the screenId exists in the database
  const validateScreenId = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await checkScreen(screenId); // Use checkScreenId from api.js
      if (response && response.registered) {
        setIsScreenIdValid(true);
        setContent(response.content); 
        setMessage('Screen ID is valid!');
        if (socket) {
          socket.send(JSON.stringify({ type: 'subscribe', screenId }));
        }
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
    if(!screenId) {
      alert("Please enter a valid screen ID");
      return;
    }

    updateScreenId(screenId);
    validateScreenId();
    if(!isScreenIdValid){
      await registerScreen(screenId); // Register the screen through API call
      setIsScreenIdValid(true);
    }
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