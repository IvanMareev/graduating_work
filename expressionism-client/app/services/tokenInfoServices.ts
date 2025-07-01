import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function tokenInfoServices() {
    try {
        const token = localStorage.getItem("access")
        if (!token) {
            throw new Error("Токен не найден. Авторизуйтесь снова.");
        }

        const response = await axios.get(`${API_BASE_URL}/token-info`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        if (response.status === 200) {
            return response.data;
        } else {
            return false;
        }
    } catch (error: any) {
        if (error.status == 401){
            return false;
            
        }
        console.error("Ошибка:", error.response?.data || error.message);
        return false; 
    }
}