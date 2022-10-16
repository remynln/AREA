import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'

export const PrivateRoutes = () => {
  let auth = false
  if (Cookies.get('jwt') !== undefined)
      auth = true
  return (
    auth ? <Outlet/> : <Navigate to="/login"/>
  )
}