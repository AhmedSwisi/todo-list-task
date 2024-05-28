import { useQuery } from "@tanstack/react-query";
import { axiosRouter } from "./config";

export interface Task {
    id:number,
    title:string,
    description:string,
    status:string,
    user_id:number
}

export const getTasks = async () => {
    const response = await axiosRouter.get("/tasks")
    const data = response.data
    console.log(data)
    return data
}

export const useGetTasks = () => {
    const tasks = useQuery({queryKey:['tasks'], queryFn:getTasks})
    return tasks
}