import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function getAllTitlesSavedGenerationResult() {
    try {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL is not defined");
        }

        const response = await axios.get(`${API_BASE_URL}/generated_layouts/all_titles`);

        console.log("Fetched titles:", response.data);
        return response.data || [];
    } catch (error: any) {
        console.error("API error:", error);
        return error.response?.data?.detail || "Ошибка при запросе к API";
    }
}
