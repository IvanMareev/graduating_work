import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function getLayoutVariantServices(templateId: string | undefined) {
    try {
        const response = await axios.get(`${API_BASE_URL}/layout_first/layout_variant_1/${templateId}`);
        console.log(response);
        return response.data
    } catch (error: any) {
        return (error.response?.data?.detail);
    }
}