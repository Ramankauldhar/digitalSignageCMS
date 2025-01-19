import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkScreen, registerScreen} from '../services/api';  
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
  const [ws, setWs] = useState(null);  // State to Store WebSocket connection
  const [status, setStatus] = useState('');

  // Initialize WebSocket connection
  useEffect(() => {
      //only create websocket when screenId is set
      if(!screenId) return;

      //created websocket connection to the server
      const socket = new WebSocket('ws://localhost:5000');

      //when websocket connection opens, send a message to the server
      socket.onopen = () => {
        console.log('WebSocket Connected');
        setStatus('Server Connected');
        // Send the screenId when the connection is established
        socket.send(JSON.stringify({ type: 'subscribe', screenId }));  // Send the screenId to the server  
      };
  
      //when websocket receives a message
      socket.onmessage = (event) => {
        console.log('Message from server:', event.data);
      };
  
      socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
        setStatus('Error! Unable to connect with server');
        // Retry connection after a delay
        setTimeout(() => {
         console.log('Retrying WebSocket connection...');
         setStatus('Reconnecting...');
         const newSocket = new WebSocket('ws://localhost:5000');
         setWs(newSocket);
        }, 5000);  // Retry after 5 seconds
      };
  
      socket.onclose = () => {
        console.log('WebSocket Disconnected');
        setStatus('Disconnected');
      };

      setWs(socket);

      // Cleanup on component unmount
      return () => {
         socket.close();
      };
  }, [screenId]);  

  //check if a screenId already exists in localStorage. If it does, auto-sync the user
  useEffect(() => {
    const storedScreenId = localStorage.getItem('screenId');
    if (storedScreenId) {
      setScreenId(storedScreenId);
      setIsScreenIdValid(true);
      updateScreenId(storedScreenId);
    }
  }, []);  

  // Handle input changes for screenId
  const handleInputChange = (e) => {
    setScreenId(e.target.value);
  };

  // Handle Sync button click
  const handleSync = () => {
    if (isScreenIdValid && screenId) {
      navigate('/main', { state: { content, screenId } });
    } else {
      setMessage('Please enter a valid screen ID before syncing.');
    }
  };

  // Handle form submission (screen registration)
  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (!screenId) {
      alert("Please enter a valid screen ID");
      return;
    }
  
    setIsLoading(true);
    setMessage('');
  
    try {
      // Step 1: Check if the screenId is already registered
      const response = await checkScreen(screenId);
      
      if (response.registered) {
        // Screen ID is already valid and registered
        setIsScreenIdValid(true);
        setContent(response.content);
        setMessage('Screen ID is valid!');
        updateScreenId(screenId);
        localStorage.setItem('screenId', screenId);
  
        // Send subscribe message via WebSocket if connected
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'subscribe', screenId }));
        } else {
          console.log("Web Socket is not open yet");
        }
      } else {
        // Step 2: Register the screen if it's not already registered
        try {
          const registerResponse = await registerScreen(screenId);
          console.log('registerScreen response:', registerResponse); // Log the response
          localStorage.setItem('screenId', screenId);
          
          setIsScreenIdValid(true);
          localStorage.removeItem('canvasState');
          updateScreenId(screenId);
          setMessage('Screen registered successfully.');
  
          // subscribe message after registration
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'subscribe', screenId }));
          }
  
        } catch (error) {
          // Handle any error during screen registration
          setIsScreenIdValid(false);
          setMessage('Error registering screen. Please try again.');
          console.error('Error during registration:', error);
        }
      }
    } catch (error) {
      // Catch any error that might happen while checking the screen
      setIsScreenIdValid(false);
      setMessage('Error verifying screen ID. Please try again.');
      console.error('Error checking screen:', error);
    } finally {
      setIsLoading(false);
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
          <button onClick={handleSync} className="sync-button" disabled={isLoading || !isScreenIdValid}
          >
             {isLoading ? 'Syncing...' : 'Sync Device'}
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
             {status && <p>Status: {status}</p>}
        </form>
      </div>
    )}
  </div>  
  );
};

export default RegisterScreen;