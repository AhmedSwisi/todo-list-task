import { useQueryClient } from '@tanstack/react-query'
import './App.css'
import { Task, useGetTasks } from './api/tasks'


function App() {
  const tasks = useGetTasks()
  const queryClient = useQueryClient()
  return (
  
      <div>
        <ul>{tasks.data?.map((task:Task) => <li key={task.id}>{task.title}</li>)}</ul>
      </div>
    
  )
}

export default App
