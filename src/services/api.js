import axios from 'axios';

const API_URL ="http://localhost:5000";

// Save content for a specific screen
export const saveContent = async (screenId, data) =>{
    try {
        const response = await axios.post(`${API_URL}/save-content`, { screenId, data },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
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
        return response.data; // Return response from the server
    } catch (error) {
        console.error('Error registering screen:', error.response?.data || error.message);
        throw error; // Re-throw the error
    }
};
