import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function readyMadeCombinationsServices(templateId: number, level: number) {
    try {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL is not defined");
        }

        let endpoint = "";

        if (level === 1) {
            endpoint = `/getting_all_wireframe_components/${templateId}`;
        } else if (level === 2) {
            endpoint = `/getting_intersection_first_level/${templateId}`;
        } else if (level === 3) {
            endpoint = `/getting_intersection_second_level/${templateId}`;
        } else {
            throw new Error("Unsupported level");
        }

        const response = await axios.get(`${API_BASE_URL}${endpoint}`);
        return response.data;

    } catch (error: any) {
        console.error("API error:", error);
        return error.response?.data?.detail || "Ошибка при запросе к API";
    }
}