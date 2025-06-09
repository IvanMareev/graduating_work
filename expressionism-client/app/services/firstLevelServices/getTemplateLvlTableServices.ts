import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const levelToEndpoint: Record<number, string> = {
    1: "/layout_first/template_lvl1",
    2: "/layout_second/template_lvl2",
    3: "/layout_third/template_lvl3",
};

export default async function getTemplateLvlTableServices( level: number) {
    try {
        const endpoint = levelToEndpoint[level];
        if (!endpoint) throw new Error("Invalid level");

        const response = await axios.get(`${API_BASE_URL}${endpoint}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data?.detail || "Unknown error";
    }
}
