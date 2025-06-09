import { LayoutVariantType } from "@/app/types/LayoutVariantType";
import axios from "axios";
import { CreateContainerParams } from "@/app/types/lvl1";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;



export default async function createNewContainer({
    containerName,
    level,
    physicalLevel,
}: CreateContainerParams): Promise<LayoutVariantType | string> {
    if (!API_BASE_URL) {
        throw new Error("API_BASE_URL is not defined");
    }

    const endpoints: Record<number, string> = {
        1: `/layout_first/lvl1`,
        2: `/layout_second/lvl2`,
        3: `/layout_third/lvl3`,
    };

    const endpoint = endpoints[level];

    if (!endpoint) {
        throw new Error("Unsupported level");
    }

    const data = {
        name: containerName,
        ...(level === 1 && { level: physicalLevel }),
    };

    try {
        const response = await axios.post<LayoutVariantType>(`${API_BASE_URL}${endpoint}`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data?.detail || "Ошибка при обновлении варианта макета";
    }
}
