import axios from "axios";
import { LayoutVariantType } from "@/app/types/LayoutVariantType";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function setAlwaysPresentMarkerServices(
  data: LayoutVariantType,
  level: number
): Promise<LayoutVariantType | string> {

  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined");
  }

  const endpoints: Record<number, string> = {
    1: `/layout_first/layout_variant_1/${data.id}`,
    2: `/layout_second/layout_variant_2/${data.id}`,
    3: `/layout_third/layout_variant_3/${data.id}`,
  };

  const endpoint = endpoints[level];

  if (!endpoint) {
    throw new Error("Unsupported level");
  }

  try {
    const response = await axios.put<LayoutVariantType>(
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
