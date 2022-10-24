import { Navigate, Outlet } from 'react-router-dom'

export const PrivateRoutes = () => {
  let auth = false
  if (localStorage.getItem("jwt") !== null)
      auth = true
  return (
    auth ? <Outlet/> : <Navigate to="/login"/>
  )
}