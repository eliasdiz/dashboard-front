import axios from "axios";

export const authenticateAccount = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`, {});
        return response.data;
    } catch (error) {
        console.error("Error al autenticar la cuenta:", error);
        throw error;
    }
}