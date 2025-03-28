import axios from "axios";
import { useEffect, useState } from "react";
import { UserInfo } from "../types/Auth";
import { log } from "node:console";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function userInfoServices(): Promise<UserInfo | false> {
    try {
        // Получение токена из localStorage
        const token = localStorage.getItem("access");
        if (!token) {
            throw new Error("Токен не найден. Авторизуйтесь снова.");
        }

        const response = await axios.get<UserInfo>(`${API_BASE_URL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`, // Указание токена в заголовках
            },
        });

        console.log(response.data);

        if (response.status === 200) {
            return response.data; // Типизировано как UserInfo
        } else {
            return false; // Типизировано как false
        }
    } catch (error: any) {
        if (error.status == 401){
            return false;
            
        }
        console.error("Ошибка:", error.response?.data || error.message);
        return false; // Обработка ошибки
    }
}
