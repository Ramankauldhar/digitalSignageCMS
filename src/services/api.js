import axios from 'axios';

const API_URL ="https://digitalsignagebackendsystem.onrender.com";
const WS_URL = "wss://digitalsignagebackendsystem.onrender.com";

let socket = null;

// Initialize WebSocket Connection
export const initWebSocket = (screenId, onMessage) => {
    if (!socket) {
        socket = new WebSocket(WS_URL);
        
        socket.onopen = () => {
            console.log("WebSocket Connected");
            socket.send(JSON.stringify({ type: "subscribe", screenId }));
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'new-content' && data.screenId === screenId) {
                    onMessage(data.data);
                }
            } catch (err) {
                console.error("Error parsing WebSocket message:", err);
            }
        };

        socket.onclose = () => {
            console.log("WebSocket Disconnected");
            socket = null;
        };
    }
};

// Save content for a specific screen
export const saveContent = async (screenId, data) =>{
    try {
        const response = await axios.post(`${API_URL}/save-content`, { screenId, data },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }catch(error){
        console.error('Error saving this content: ', error);
        throw error;
    }
}

// Fetch all contents in db
export const fetchContents = async () =>{
    try{
        const response = await axios.get(`${API_URL}/contents`);
        return response.data;
    }catch(error){
        console.error('Error fetching all contents:', error);
        throw error;
    }
};

// Fetch content for a specific screen
export const fetchContentByScreen = async (screenId) => {
    try {
        const response = await axios.get(`${API_URL}/content/${screenId}`);
        return response.data; // Return content records for the given screenId
    } catch (error) {
        console.error('Error fetching content for screen:', error.response?.data || error.message);
        throw error; 
    }
};

// Register a new screen
export const registerScreen = async (screenId) => {
    try {
        const response = await axios.post(`${API_URL}/register-screen`, { screenId }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 409) {
            console.warn('Screen already registered:', error.response.data.message);
        }
        console.error('Error registering screen:', error.response ? error.response.data : error.message);
        throw error;
    }
};

//check if the screen exist in screens db
export const checkScreen = async (screenId) => {
    try{
        const response = await axios.get(`${API_URL}/check-screen/${screenId}`);
        return response.data;
    }catch (error) {
        // Check if it's a 404 error and return a custom error message
        if (error.response && error.response.status === 404) {
          return { registered: false }; // If screen doesn't exist, return false
        }
        // If any other error occurs, re-throw the error to be handled later
        throw error;
      }
};
