import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function groupedContainerServices(templateId: number) {
    try {
        const response = await axios.get(`${API_BASE_URL}/get_first_level1_grouped/${templateId}`);
        console.log(response);
        return response.data
    } catch (error: any) {
        return (error.response?.data?.detail);
    }
}