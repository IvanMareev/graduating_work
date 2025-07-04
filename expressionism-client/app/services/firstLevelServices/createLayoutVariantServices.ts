import axios from "axios";
import { LayoutVariantType } from "@/app/types/LayoutVariantType";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Endpoint = {
  template_lvl: string;
  layout_variant: string;
};

const endpoints: Record<number, Endpoint> = {
  1: {
    template_lvl: `/layout_first/template_lvl1`,
    layout_variant: `/layout_first/layout_variant_1`,
  },
  2: {
    template_lvl: `/layout_second/template_lvl2`,
    layout_variant: `/layout_second/layout_variant_2`,
  },
  3: {
    template_lvl: `/layout_third/template_lvl3`,
    layout_variant: `/layout_third/layout_variant_3`,
  },
};

export default async function createLayoutVariantServices(
  data: LayoutVariantType,
  level: number
): Promise<LayoutVariantType | string> {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined");
  }

  const endpoint = endpoints[level];

  if (!endpoint) {
    throw new Error("Unsupported level");
  }

  console.log('template_lvl', {
    template_id: data.template_id,
    lvl_id: data.lvl_id,
    always_eat: 0
  });

  try {
    const templateResponse = await axios.post<{ id: number }>(
      `${API_BASE_URL}${endpoint.template_lvl}`,
      {
        template_id: data.template_id,
        lvl_id: data.lvl_id,
        always_eat: 0
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const template_lvl_id = templateResponse.data.id;
    console.log('template_lvl_id', template_lvl_id);


    const layoutResponse = await axios.post<LayoutVariantType>(
      `${API_BASE_URL}${endpoint.layout_variant}`,
      {
        ...data,                         
        template_lvl_id: template_lvl_id 
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return layoutResponse.data;
  } catch (error: any) {
    return error.response?.data?.detail || "Ошибка при создании варианта макета";
  }
}
