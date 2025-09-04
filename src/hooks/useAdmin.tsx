import { useState, useEffect, createContext, useContext, ReactNode } from "react"

interface AdminContextType {
  isAdmin: boolean
  login: (password: string) => boolean
  logout: () => void
  checkAdmin: () => void
}

const AdminContext = createContext<AdminContextType | null>(null)

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider")
  }
  return context
}

interface AdminProviderProps {
  children: ReactNode
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if admin session exists in sessionStorage
    const adminSession = sessionStorage.getItem("admin_session")
    if (adminSession === "authenticated") {
      setIsAdmin(true)
    }
  }, [])

  const login = (password: string): boolean => {
    if (password === "otunola") {
      setIsAdmin(true)
      sessionStorage.setItem("admin_session", "authenticated")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    sessionStorage.removeItem("admin_session")
  }

  const checkAdmin = () => {
    const adminSession = sessionStorage.getItem("admin_session")
    setIsAdmin(adminSession === "authenticated")
  }

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, checkAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}