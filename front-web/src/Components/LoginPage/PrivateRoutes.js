import { Navigate, Outlet } from 'react-router-dom'

export const PrivateRoutes = (props) => {
  let auth = props.user
  if (localStorage.getItem("jwt") !== null)
    auth = true
  return (
    auth ? <Outlet/> : <Navigate to="/login"/>
  )
}