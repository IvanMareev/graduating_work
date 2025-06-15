import axios from "axios";
import { LayoutVariantType } from "@/app/types/LayoutVariantType";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function setActiveStatusForAllLauoutVariantServices(
  data: object,
  level: number
): Promise<LayoutVariantType | string> {

  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined");
  }

  const endpoints: Record<number, string> = {
    1: `/layout_first/layout_variant_1/set_active_bulk`,
    2: `/layout_second/set_active_bulk`,
    3: `/layout_third/set_active_bulk`,
  };

  const endpoint = endpoints[level];

  if (!endpoint) {
    throw new Error("Unsupported level");
  }

  try {
    const response = await axios.post<LayoutVariantType>(
      `${API_BASE_URL}${endpoint}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return error.response?.data?.detail || 'Ошибка при обновлении варианта макета';
  }
}
