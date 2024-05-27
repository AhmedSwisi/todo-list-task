import { axiosRouter } from "./config";

export const hello = async () => {
    const response = await axiosRouter.get("/")
    const data = response.data
    console.log(data)
    return data
}

export const useHello = () => {
    
}