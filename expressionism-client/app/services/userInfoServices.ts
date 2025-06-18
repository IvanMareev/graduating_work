import axios from "axios";
import { useEffect, useState } from "react";
import { UserInfo } from "../types/Auth";
import { log } from "node:console";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function userInfoServices(): Promise<UserInfo | false> {
    try {
        const token = localStorage.getItem("access");
        if (!token) {
            throw new Error("Токен не найден. Авторизуйтесь снова.");
        }

        const response = await axios.get<UserInfo>(`${API_BASE_URL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(response.data);

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
