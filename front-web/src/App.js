import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './Pages/Dashboard'
import { Notifications } from './Pages/Notifications'
import { Settings } from './Pages/Settings'
import { Workflows } from './Pages/Workflows'
import { Login } from './Pages/Login'
import { Register } from './Pages/Register'
import { PrivateRoutes } from './Components/LoginPage/PrivateRoutes'
import { StoreProvider } from 'easy-peasy';
import { UserAuth } from './Stores/UserAuth'
import { ServerConnection } from './Stores/ServerConnection'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/workflows" element={<Workflows />}/>
            <Route path="/notifications" element={<Notifications />}/>
            <Route path="/settings" element={<Settings />}/>
            <Route path="*" element={<Navigate to="/dashboard" />}/>
            <Route path="/" element={<Navigate to="/dashboard" />}/>
            <Route path="/home" element={<Navigate to="/dashboard" />}/>
            <Route path="/login" element={<Navigate to="/dashboard" />}/>
            <Route path="/register" element={<Navigate to="/dashboard" />}/>
          </Route>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
