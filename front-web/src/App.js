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
import axios from "axios";

function App() {
  const [user, setUser] = useState(false)

  useEffect(() => {
      if (localStorage.getItem("jwt") !== null && user === false)
        setUser(true)
        loadUser()
      if (localStorage.getItem("jwt") === null && user === true)
        setUser(false)
  });

  const loadUser = () => {
    axios.get("http://localhost:8080/services/")
    .then(res => {
        if (res.status === 200)
          console.log(res.message)
    })
    .catch(error => {
        console.log(error)
    })
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<PrivateRoutes user={user}/>}>
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/workflows" element={<Workflows />}/>
            <Route path="/notifications" element={<Notifications />}/>
            <Route path="/settings" element={<Settings />}/>
            <Route path="*" element={<Navigate to="/dashboard" />}/>
            <Route path="/" element={<Navigate to="/dashboard" />}/>
            <Route path="/home" element={<Navigate to="/dashboard" />}/>
          </Route>
          <Route path="/login" element={<Login user={user}/>} />
          <Route path="/register" element={<Register user={user}/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
