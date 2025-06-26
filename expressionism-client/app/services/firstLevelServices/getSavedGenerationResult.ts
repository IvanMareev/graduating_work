import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function getSavedGenerationResult(title: string) {
    try {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL is not defined");
        }

        let endpoint = `/generated_layouts/by_title/${title}`;

        const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data || 0;

    } catch (error: any) {
        console.error("API error:", error);
        return error.response?.data?.detail || "Ошибка при запросе к API";
    }
}