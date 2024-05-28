import { useQueryClient } from '@tanstack/react-query'
import './App.css'
import { Task, useAddTask, useGetTasks } from './api/tasks'
import { Button } from './components/ui/button'


function App() {
  const tasks = useGetTasks()
  const mutation = useAddTask()
  const queryClient = useQueryClient()
  return (
    <div>
      <div>
        <ul>{tasks.data?.map((task:Task) => <li key={task.id}>{task.title}</li>)}</ul>
      </div>
      <div>
        <Button onClick={() => mutation.mutate({
          title:'React Task 2',
          description:"React Description",
          status:"Pending",
          user_id:2
        })}>Add Task</Button>
      </div>
    </div>
  )
}

export default App
