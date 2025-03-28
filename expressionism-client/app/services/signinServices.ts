import axios from "axios";
import { LoginFormData } from "../types/Auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function signinServices(data:LoginFormData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, data); // Подставьте ваш API-эндпоинт
        console.log(response);
        localStorage.setItem("access", response.data.access_token);
        return 200
    } catch (error: any) {
        return (error.response?.data?.detail || "Login failed");
    }
}