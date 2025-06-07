import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function groupedContainerWireframeServices(templateId: number, level: number) {
    try {
        let response = ''
        if (level == 1) {
            response = await axios.get(`${API_BASE_URL}/get_first_level1_grouped/${templateId}`);
        } else if (level == 2) {
            response = await axios.get(`${API_BASE_URL}/get_wireframe_combinations_with_suggested_insertion_options/${templateId}`);
        } else if (level == 3) {
            response = await axios.get(`${API_BASE_URL}/get_wireframe_combinations_with_suggested_insertion_atoms_options/${templateId}`);
        }

        console.log(response);
        return response.data
    } catch (error: any) {
        return (error.response?.data?.detail);
    }
}