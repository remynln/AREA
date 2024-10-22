import { Navigate, Outlet } from 'react-router-dom'

export const PrivateRoutes = (props) => {
  let auth = false
  if (props.user !== false && localStorage.getItem("jwt") !== null)
    auth = true
  return (
    auth ? <Outlet/> : <Navigate to="/login"/>
  )
}