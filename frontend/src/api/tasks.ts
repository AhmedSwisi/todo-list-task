import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosRouter } from "./config";


export interface Task {
    id:number,
    title:string,
    description:string,
    status:string,
    user_id:number
}
export interface PostTask {
    title:string,
    description:string,
    status:string,
    user_id:number
}

export interface UpdateTask {
    id:number,
    status:string
}

export const getTasks = async () => {
    const response = await axiosRouter.get("/tasks")
    console.log(response)
    const data = response.data
    console.log(data)
    return data
}

export const useGetTasks = () => {
    const tasks = useQuery({queryKey:['tasks'], queryFn:getTasks,staleTime:0})
    return tasks
}

const addTask = async (task:PostTask) => {
    const response = await axiosRouter.post("/tasks",task)
    const data = response.data
    console.log(data)
    return data
}

export const useAddTask = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn:(task:PostTask) => addTask(task),
        mutationKey:['tasks'],
        onSuccess:() => {
            queryClient.fetchQuery({queryKey:['tasks'],queryFn:getTasks})
        }
    })
    return mutation
}
const updateTask = async (id:number,status:string) => {
    const response = await axiosRouter.put(`/tasks/${id}`,{status})
    const data = response.data
    console.log(data)
    return data
}

export const useUpdateTask = () => {
    const mutation = useMutation({
        mutationFn:(data:UpdateTask) => updateTask(data.id,data.status),
        mutationKey:['tasks']
    })
    return mutation
}

const deleteTask = async (id:number) => {
    const response = await axiosRouter.delete(`/tasks/${id}`)
    const data = response.data
    console.log(data)
    return data
}

export const useDeleteTask = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn:(id:number) => deleteTask(id),
        mutationKey:['tasks'],
        onSuccess:() => {
            queryClient.fetchQuery({queryKey:['tasks'],queryFn:getTasks})
        }
    })
    return mutation
}