import React from "react";
import { Button } from "./ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useDeleteTask, useUpdateTask } from "@/api/tasks";
import DeleteButton from "./DeleteButton";


type Todo = {
    status:string,
    title:string,
    description:string,
    id:number,
    user_id:number
}

interface Props {
    todo:Todo
}

const TodoListItem:React.FC<Props> = ({todo}) => {
    console.log(todo)

    const updateMutation = useUpdateTask()
    const handleSelectChange = async (e:string) => {
        try {
           const response = await updateMutation.mutateAsync({id:todo.id,status:e})
           if (response){
            console.log(response)
           }
        } catch (error) {
            console.error(error)
        }
    }
   

  return (
  <div className="flex flex-row">
    <div className="flex flex-col gap-4">
        <p>{todo.title}</p>
        <p>{todo.description}</p>
    </div>
    <DeleteButton id={todo.id}/>
    <Select onValueChange={handleSelectChange}>
    <SelectTrigger className="w-[180px]">
        <SelectValue defaultValue={todo.status} placeholder={todo.status} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Task Status</SelectLabel>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="complete">Complete</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
)
};

export default TodoListItem;
