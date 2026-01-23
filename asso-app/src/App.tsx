import Login from "@pages/Login/Login"
import { useIsAuthenticated } from "@azure/msal-react"
import { RouterProvider } from 'react-router-dom';
import { router } from './Router'

export default function App() {
  const isAuthenticated = useIsAuthenticated()

  return (
    <div>
      {isAuthenticated ? <RouterProvider router={router} /> : <Login />}
    </div>
  )
}
