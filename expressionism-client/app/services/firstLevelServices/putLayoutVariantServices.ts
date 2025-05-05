import axios from "axios";
import { LayoutVariantType } from "@/app/types/LayoutVariantType";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function putLayoutVariantServices(
  data: LayoutVariantType
): Promise<LayoutVariantType | string> {
  try {
    const response = await axios.put<LayoutVariantType>(
      `${API_BASE_URL}/layout_first/layout_variant_1/${data.id}`,
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
