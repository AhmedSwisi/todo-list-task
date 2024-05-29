import React from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useUpdateTask } from "@/api/tasks";
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
  <div className="flex flex-row gap-10 justify-start items-center w-full">
    <div className="flex flex-col justify-start items-start gap-2 w-80 break-words">
        <p className="font-semibold text-wrap flex  w-80">{todo.title}</p>
        <p className="font-semibold text-wrap flex  w-80">{todo.description}</p>
    </div>
    <div className="flex flex-row">
    <DeleteButton id={todo.id}/>
    <Select onValueChange={handleSelectChange}>
    <SelectTrigger className="w-[180px] border border-l-0 rounded-l-none">
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
  </div>
)
};

export default TodoListItem;
