import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function saveGenerationResult(templateId: number, title: string) {
    try {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL is not defined");
        }

        let endpoint = `/fixing_generation_results/${templateId}`;

        const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
            title: title,
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response?.message || 0;

    } catch (error: any) {
        console.error("API error:", error);
        return error.response?.data?.detail || "Ошибка при запросе к API";
    }
}