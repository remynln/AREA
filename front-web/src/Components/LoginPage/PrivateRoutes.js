import { Navigate, Outlet } from 'react-router-dom'

export const PrivateRoutes = () => {
  let auth = {'token':false}
  return (
    auth.token ? <Outlet/> : <Navigate to="/login"/>
  )
}