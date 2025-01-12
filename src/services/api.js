import axios from 'axios';

const API_URL ="http://localhost:5000";

export const saveContent = async (data) =>{
    try{
        const response = await axios.post(`${API_URL}/save-content`, {data});
        return response.data;
    }catch(error){
        console.error('Error saving this content: ', error);
        throw error;
    }
}
