import TodoListItem from "./TodoListItem";

type Todos = {
    status:string,
    title:string,
    description:string,
    id:number,
    user_id:number
}

interface Props {
    todos:Todos[]
}

export const TodoList:React.FC<Props> = ({todos}) => {
    console.log(todos)
  return (
    <div className="flex flex-col gap-8">
        {todos && todos.length > 0 &&
        (<>
            {todos.map((todo, index) => {
                return(
                <div>
                <TodoListItem key={index} todo={todo} />
                </div>
                )
            })}
        </>) }
        {todos && todos.length === 0 && (
            <p>you have no tasks</p>
        )}
    </div>
    )
};
