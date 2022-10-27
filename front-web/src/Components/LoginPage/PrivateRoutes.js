import { Navigate, Outlet } from 'react-router-dom'

export const PrivateRoutes = (props) => {
  let auth = props.user
  return (
    auth ? <Outlet/> : <Navigate to="/login"/>
  )
}