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
export const fetchContents = async () =>{
    try{
        const response = await axios.get(`${API_URL}/contents`);
        return response.data;
    }catch(error){
        console.error('Error fetching all contents:', error);
        throw error;
    }
};
