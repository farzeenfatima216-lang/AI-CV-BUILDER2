import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import Dashboard from '../pages/Dashboard'
import Builder from '../pages/builder'
import Templates from '../pages/Templates'
import CoverLetter from '../pages/CoverLetter'
import LinkedIn from '../pages/LinkedIn'
import Interview from '../pages/Interview'
import Admin from '../pages/Admin'
import MyResumes from '../pages/MyResumes'
import Settings from '../pages/Settings'

function RequireAuth({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/resumes"
        element={
          <RequireAuth>
            <MyResumes />
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <Settings />
          </RequireAuth>
        }
      />
      <Route
        path="/builder"
        element={
          <RequireAuth>
            <Builder />
          </RequireAuth>
        }
      />
      <Route
        path="/templates"
        element={
          <RequireAuth>
            <Templates />
          </RequireAuth>
        }
      />
      <Route
        path="/cover-letter"
        element={
          <RequireAuth>
            <CoverLetter />
          </RequireAuth>
        }
      />
      <Route
        path="/linkedin"
        element={
          <RequireAuth>
            <LinkedIn />
          </RequireAuth>
        }
      />
      <Route
        path="/interview"
        element={
          <RequireAuth>
            <Interview />
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <Admin />
          </RequireAuth>
        }
      />
    </Routes>
  )
}
