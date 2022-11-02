import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './Pages/Dashboard'
import { Notifications } from './Pages/Notifications'
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

  axios.defaults.baseURL = process.env.REACT_APP_SERVER_IP;

  useEffect(() => {
    if (user.username === null) {
      loadUser()
      loadServices()
    }
  }, [localStorage.getItem("jwt")]);

  function serviceExists(serviceName) {
    return services.some(function(el) {
      return el[serviceName] === "connected" || el[serviceName] === "disconnected";
    });
  }

  const loadServices = async () => {
    try {
      const res = await axios.get("/services/", { headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")) } })

      await res.data.connected.map(service => {
        if (serviceExists(service) === false)
          services.push({[service]: "connected"})
        else
          setServices({[service]: "connected"})
      })
      await res.data.not_connected.map(service => {
        if (serviceExists(service) === false)
          services.push({[service]: "disconnected"})
        else
          setServices({[service]: "disconnected"})
      })
    } catch (error) {
      console.log(error)
    }
  }

  const loadUser = async () => {
    try {
      const user = await jwt(JSON.parse(localStorage.getItem("jwt")))

      setUser({username: user.username})
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<PrivateRoutes user={user} />}>
            <Route path="/dashboard" element={<Dashboard user={user} services={services}/>} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/home" element={<Navigate to="/dashboard" />} />
          </Route>
          <Route path="/login" element={<Login user={user} setUser={setUser} setServices={setServices}/>} />
          <Route path="/register" element={<Register user={user} setUser={setUser}/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
