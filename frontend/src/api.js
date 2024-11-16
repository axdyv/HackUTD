import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

export const getConventionalVehicles = async (filters = {}) => {
    const { manufacturer = "", year = "" } = filters;
    try {
        const response = await axios.get(`${API_URL}/vehicles`, {
            params: { manufacturer, year },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching filtered vehicles:", error);
        return [];
    }
};
