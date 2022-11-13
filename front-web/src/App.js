import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './Pages/Dashboard'
import { Settings } from './Pages/Settings'
import { Workflows } from './Pages/Workflows'
import { Login } from './Pages/Login'
import { Register } from './Pages/Register'
import { PrivateRoutes } from './Components/LoginPage/PrivateRoutes'
import { useEffect, useState } from 'react';
import jwt from 'jwt-decode'
import axios from "axios";

function App() {
  const [user, setUser] = useState(localStorage.getItem("jwt")===null?false:{username: null})
  const [services, setServices] = useState([])
  const [areas, setAreas] = useState([])
  const [users, setUsers] = useState([])

  axios.defaults.baseURL = process.env.REACT_APP_SERVER_IP;

  useEffect(() => {
    if (user.username === null) {
      loadUser()
    }
  }, [localStorage.getItem("jwt"), user]);

  function serviceExists(serviceName) {
    return services.some(function(element) {
      return element.name === serviceName
    });
  }

  const loadServices = async () => {
    try {
      const res = await axios.get("/services/", { headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")) } })

      await res.data.connected.map(service => {
        if (serviceExists(service) === false)
          setServices(current => [...current, {name: service, state: "connected"}])
        else {
          setServices(services.map(element => {
            if (element.name === service)
              return ({name: service, state: "connected"})
          }))
        }
      })
      await res.data.not_connected.map(service => {
        if (serviceExists(service) === false)
          setServices(current => [...current, {name: service, state: "disconnected"}])
        else {
          setServices(services.map(element => {
            if (element.name === service)
              return ({name: service, state: "disconnected"})
          }))
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const loadUser = async () => {
    try {
      const user = await jwt(JSON.parse(localStorage.getItem("jwt")))

      if (user.username === "root")
        await setUser({username: user.username, email: user.email, admin: user.admin, superuser: true})
      else {
        await setUser({username: user.username, email: user.email, admin: user.admin, superuser: false})
        await loadServices()
        await loadAreas()
      }
      if (user.admin === true)
        loadUsers()
    } catch (error) {
      console.log(error)
    }
  }

  const loadUsers = async () => {
    try {
      const res = await axios.get("/users",
        { headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")) } })
      
      setUsers(res.data)
    } catch (error) {
        console.log(error)
    }
  }

  const loadAreas = async () => {
    try {
      const res = await axios.get("/user/me/areas",
        { headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")) } })

        await setAreas(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App">
        <Router>
          <Routes>
            <Route element={<PrivateRoutes user={user} />}>
              <Route path="/dashboard" element={<Dashboard user={user} services={services} areas={areas} setAreas={setAreas}/>} />
              <Route path="/workflows" element={<Workflows services={services} areas={areas} setAreas={setAreas}/>} />
              <Route path="/settings" element={<Settings user={user} users={users} setUsers={setUsers}/>} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/home" element={<Navigate to="/dashboard" />} />
            </Route>
            <Route path="/login" element={<Login user={user} setUser={setUser} setServices={setServices} setAreas={setAreas}/>} />
            <Route path="/register" element={<Register user={user} setUsers={setUsers}/>} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
