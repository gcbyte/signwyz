import { createContext, useContext, useEffect, useState } from "react"
import { apiRequest } from "../api"

const AuthContext = createContext(null)

function getStoredToken() {
  return localStorage.getItem("token")
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken)
  const [user, setUser] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(Boolean(getStoredToken()))

  const isAuthenticated = Boolean(token)

  // Fetch the current user whenever the token changes
  useEffect(() => {
    if (!token) {
      setUser(null)
      setIsLoadingUser(false)
      return
    }

    setIsLoadingUser(true)
    apiRequest("/users/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoadingUser(false))
  }, [token])

  // Sync auth state across tabs
  useEffect(() => {
    const handleStorage = () => {
      const stored = getStoredToken()
      setToken(stored)
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const login = (accessToken) => {
    localStorage.setItem("token", accessToken)
    setToken(accessToken)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  // Called by Profile after a successful PATCH /users/me or avatar change
  // so other components that read `user` stay in sync without a refetch.
  const updateUser = (updatedUser) => {
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, isLoadingUser, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
