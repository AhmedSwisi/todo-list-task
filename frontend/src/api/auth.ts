import { useQuery} from "@tanstack/react-query";
import { axiosRouter } from "./config";
import Cookies from "universal-cookie";
import { AxiosError } from "axios";

const cookies = new Cookies()

const getCurrentUser = async () => {
    const response = await axiosRouter.get("/auth/user")
    const data = response.data
    console.log(data)
    return data
}

export const useUser = () => {
    const user = useQuery({queryKey:['user'], queryFn:getCurrentUser})
    return user
}

export const login = async (email:string, password:string) => {
    try {
        const response = await axiosRouter.post('/auth/login',{email,password})
        const {access_token, refresh_token} = response.data
        console.log(access_token)
        console.log(refresh_token)
        cookies.set('access_token',access_token,{path:'/'})
        cookies.set('refresh_token',refresh_token,{path:'/'})
        return response.data
    } catch (error){
        console.log("login failed",error)
    }

}

export const register = async (username:string, email:string, password:string) => {
    try {
        const response = await axiosRouter.post("/auth/register", { username, email, password })
        const data = response.data
        console.log(data)
        return data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log("Axios error:", error.response);
        } else {
            console.log("Unknown error:", error);
        }
        throw error; // Re-throw the error so it can be caught by the caller
    }
}