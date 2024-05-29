import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useDeleteTask } from "@/api/tasks";
import { DialogClose } from "@radix-ui/react-dialog";

interface Props {
    id:number
}

const DeleteButton:React.FC<Props> = ({id}) => {
    const deleteMutation = useDeleteTask()
    const [open,setOpen] = useState(false)
    const onDeleteButtonClick = async () => {
        try {
            const response = await deleteMutation.mutateAsync(id)
            console.log(response)
        } catch (error) {
            console.error(error)
        }
        
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-r-none" variant="default">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
           Are you sure you want to delete this task?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
        <form className="flex flex-row w-full" onSubmit={async (e) => {
            e.preventDefault()
            onDeleteButtonClick()
            setOpen(false)
        }} >
            <div className="flex flex-row justify-between w-full">
            <DialogClose className="rounded-xl border-black border px-4 py-2 h-10 items-center justify-center flex">Cancel</DialogClose>
                <Button type="submit">Delete</Button>
            </div>
        </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteButton;
