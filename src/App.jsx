import { useState } from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import "./App.css"

import { useAuth } from "./context/AuthContext"

import Navbar from "./components/Navbar"
import LandingPage from "./pages/LandingPage"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import Dashboard from "./pages/Dashboard"
import Documents from "./pages/Documents"
import Profile from "./pages/Profile"
import Analysis from "./pages/Analysis"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import NotFound from "./pages/NotFound"

// Routes where the Navbar should not appear
const NAVBAR_HIDDEN_ROUTES = new Set(["/analysis"])

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/signin" replace />
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark"
  })

  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()

  const handleDarkModeChange = (value) => {
    localStorage.setItem("theme", value ? "dark" : "light")
    setDarkMode(value)
  }

  const showNavbar = !NAVBAR_HIDDEN_ROUTES.has(location.pathname)

  return (
    <div className={darkMode ? "app dark-mode" : "app"}>

      {showNavbar && (
        <Navbar
          darkMode={darkMode}
          setDarkMode={handleDarkModeChange}
          isAuthenticated={isAuthenticated}
          onLogout={logout}
        />
      )}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis/:id"
          element={
            <ProtectedRoute>
              <Analysis />
            </ProtectedRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </div>
  )
}

export default App
