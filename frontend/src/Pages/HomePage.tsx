import { useUser } from "@/api/auth";
import { useAddTask, useGetTasks } from "@/api/tasks";
import { TodoList } from "@/components/TodoList";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the schema using Zod
const schema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
});

// Infer the form fields type from the schema
type FormFields = z.infer<typeof schema>;

const HomePage = () => {
    // Fetch tasks using the custom hook
    const { data: tasks, isLoading, error } = useGetTasks();
    const addMutation = useAddTask();
    const navigate = useNavigate();

    // Initialize the form with react-hook-form and Zod resolver
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
    });

    // Fetch the current user
    const { data: user } = useUser();
    if (!user) {
        navigate('/login');
        return null; // Return null to prevent rendering until redirect happens
    }

    // Handle form submission
    const handleAddTaskFormSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await addMutation.mutateAsync({
                ...data,
                status: "Pending",
                user_id: user.id, // Ensure user.id is correct
            });
            console.log(response);
        } catch (error) {
            console.log(error);
            // Handle the error by setting form errors or showing a notification
        }
    };

    return (
        <div className="grid grid-cols-2 gap-x-4  justify-center mt-12">
            <div className="flex flex-col gap-6 ml-20">
                <h1 className="font-bold text-5xl">Todo List</h1>
                {isLoading && <p>Loading tasks...</p>}
                {error && <p>Failed to load tasks</p>}
                {tasks && <TodoList todos={tasks} />}
            </div>
            <div className="flex flex-col pr-40">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleAddTaskFormSubmit)}>
                    <h1 className="text-4xl font-semibold">Add Task</h1>
                    <div className="flex flex-col gap-y-6 w-full">
                        <div className="flex flex-col justify-start items-start w-full gap-2">
                            <label className="text-black">Title</label>
                            <Input {...register("title")} />
                            {errors.title && (
                                <div className="text-red-500">{errors.title.message}</div>
                            )}
                        </div>
                        <div className="flex flex-col justify-start items-start w-full gap-2">
                            <label className="text-black">Description</label>
                            <Input {...register("description")} />
                            {errors.description && (
                                <div className="text-red-500">{errors.description.message}</div>
                            )}
                        </div>
                        <div className="flex flex-col justify-center gap-4">
                            <Button type="submit" className="text-white bg-black">
                                {isSubmitting ? "Loading" : "Add Task"}
                            </Button>
                            {errors.root && (
                                <div className="text-red-500">{errors.root.message}</div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HomePage;

