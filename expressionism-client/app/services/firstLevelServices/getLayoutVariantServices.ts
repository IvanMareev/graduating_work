import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function getLayoutVariantServices(templateId: string | undefined, level: number) {
    try {
        if (!API_BASE_URL) {
            throw new Error("API_BASE_URL is not defined");
        }

        if (!templateId) {
            throw new Error("templateId is required");
        }

        const endpoints: Record<number, string> = {
            1: `/layout_first/layout_variant_1/${templateId}`,
            2: `/layout_second/layout_variant_2/${templateId}`,
            3: `/layout_third/layout_variant_3/${templateId}`,
        };

        const endpoint = endpoints[level];

        if (!endpoint) {
            throw new Error("Unsupported level");
        }

        const response = await axios.get(`${API_BASE_URL}${endpoint}`);
        return response.data;

    } catch (error: any) {
        console.error("Ошибка при запросе:", error);
        return error.response?.data?.detail || "Не удалось загрузить данные";
    }
}
