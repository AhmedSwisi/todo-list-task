import { useQueryClient } from '@tanstack/react-query'
import './App.css'
import { Task, useAddTask, useDeleteTask, useGetTasks, useUpdateTask } from './api/tasks'
import { Button } from './components/ui/button'
import { login, register } from './api/auth'


function App() {
  const tasks = useGetTasks()
  const addMutation = useAddTask()
  const updateMutation = useUpdateTask()
  const deleteMutation = useDeleteTask()


  return (
    <div>
      <div>
        <ul>{tasks.data?.map((task:Task) => <li key={task.id}>{task.title}</li>)}</ul>
      </div>
      <div>
        <Button onClick={() => addMutation.mutate({
          title:'React Task 2',
          description:"React Description",
          status:"Pending",
          user_id:2
        })}>Add Task</Button>
        <Button onClick={() => updateMutation.mutate({id:24,status:"Complete"})}>Update Task</Button>
        <Button onClick={() => deleteMutation.mutate(24)}>Delete</Button>
        <Button onClick={async () => register("React","react@test.com","pass@1234")}>Register</Button>
        <Button onClick={async () => login("test@example.com","pass@1234")}>Login</Button>
      </div>
    </div>
  )
}

export default App
