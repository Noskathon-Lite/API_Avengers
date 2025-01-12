import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/"; // Replace with your backend URL

export const fetchData = async (endpoint: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const postData = async (endpoint: string, data: object) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data);
        return response.data;
    } catch (error) {
        console.error("Error posting data:", error);
        throw error;
    }
};

export const updateData = async (endpoint: string, data: object) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${endpoint}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating data:", error);
        throw error;
    }
};

export const deleteData = async (endpoint: string) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${endpoint}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting data:", error);
        throw error;
    }
};
