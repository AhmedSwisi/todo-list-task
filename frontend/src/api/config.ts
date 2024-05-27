import axios from "axios";

export const axiosRouter = axios.create({
    baseURL:import.meta.env.VITE_PUBLIC_URL,
    timeout:1000,
    headers:{
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
    }
})