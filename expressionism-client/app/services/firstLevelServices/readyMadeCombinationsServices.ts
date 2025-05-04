import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function readyMadeCombinationsServices(templateId: number) {
    try {
        const response = await axios.get(`${API_BASE_URL}/getting_all_wireframe_components/${templateId}`);
        console.log(response);
        return response.data
    } catch (error: any) {
        return (error.response?.data?.detail);
    }
}