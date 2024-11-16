import axios from "axios";

const API_URL = "http://127.0.0.1:5000"; // Backend API URL

// Fetch conventional vehicles data
export const getConventionalVehicles = async () => {
    try {
        const response = await axios.get(`${API_URL}/vehicles`); // Make sure this endpoint exists in your Flask app
        return response.data;
    } catch (error) {
        console.error("Error fetching conventional vehicles data:", error);
        return [];
    }
};
