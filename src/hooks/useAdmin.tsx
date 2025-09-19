import { useState, useEffect, createContext, useContext, ReactNode } from "react"

interface Admin {
  id: string
  username: string
  role: 'super_admin' | 'admin'
  email: string
  createdAt: string
}

interface AdminContextType {
  isAdmin: boolean
  currentAdmin: Admin | null
  allAdmins: Admin[]
  login: (username: string, password: string) => boolean
  logout: () => void
  checkAdmin: () => void
  addAdmin: (admin: Omit<Admin, 'id' | 'createdAt'>) => boolean
  updateAdmin: (id: string, updates: Partial<Admin>) => void
  deleteAdmin: (id: string) => void
  isSuperAdmin: () => boolean
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
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null)
  const [allAdmins, setAllAdmins] = useState<Admin[]>([])

  useEffect(() => {
    // Load admins from localStorage
    const storedAdmins = localStorage.getItem("admins")
    if (storedAdmins) {
      const parsed = JSON.parse(storedAdmins)
      setAllAdmins(parsed)
    } else {
      // Create default super admin if none exists
      const defaultSuperAdmin: Admin = {
        id: "super_admin_1",
        username: "superadmin",
        role: "super_admin",
        email: "superadmin@unijos.edu.ng",
        createdAt: new Date().toISOString()
      }
      setAllAdmins([defaultSuperAdmin])
      localStorage.setItem("admins", JSON.stringify([defaultSuperAdmin]))
    }

    // Check if admin session exists
    const adminSession = sessionStorage.getItem("admin_session")
    if (adminSession) {
      const admin = JSON.parse(adminSession)
      setCurrentAdmin(admin)
      setIsAdmin(true)
    }
  }, [])

  useEffect(() => {
    // Save admins to localStorage whenever allAdmins changes
    localStorage.setItem("admins", JSON.stringify(allAdmins))
  }, [allAdmins])

  const login = (username: string, password: string): boolean => {
    // Default passwords: super admin = "1234", normal admin = "123456"
    const admin = allAdmins.find(a => a.username === username)
    if (admin) {
      const expectedPassword = admin.role === "super_admin" ? "1234" : "123456"
      if (password === expectedPassword) {
        setCurrentAdmin(admin)
        setIsAdmin(true)
        sessionStorage.setItem("admin_session", JSON.stringify(admin))
        return true
      }
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    setCurrentAdmin(null)
    sessionStorage.removeItem("admin_session")
  }

  const checkAdmin = () => {
    const adminSession = sessionStorage.getItem("admin_session")
    if (adminSession) {
      const admin = JSON.parse(adminSession)
      setCurrentAdmin(admin)
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
      setCurrentAdmin(null)
    }
  }

  const addAdmin = (adminData: Omit<Admin, 'id' | 'createdAt'>): boolean => {
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
      return false // Only super admin can add new admins
    }
    
    const newAdmin: Admin = {
      ...adminData,
      id: `admin_${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    
    setAllAdmins(prev => [...prev, newAdmin])
    return true
  }

  const updateAdmin = (id: string, updates: Partial<Admin>) => {
    if (!currentAdmin || currentAdmin.role !== 'super_admin') return
    
    setAllAdmins(prev => 
      prev.map(admin => admin.id === id ? { ...admin, ...updates } : admin)
    )
  }

  const deleteAdmin = (id: string) => {
    if (!currentAdmin || currentAdmin.role !== 'super_admin') return
    if (id === currentAdmin.id) return // Can't delete self
    
    setAllAdmins(prev => prev.filter(admin => admin.id !== id))
  }

  const isSuperAdmin = (): boolean => {
    return currentAdmin?.role === 'super_admin' || false
  }

  return (
    <AdminContext.Provider value={{ 
      isAdmin, 
      currentAdmin, 
      allAdmins, 
      login, 
      logout, 
      checkAdmin, 
      addAdmin, 
      updateAdmin, 
      deleteAdmin, 
      isSuperAdmin 
    }}>
      {children}
    </AdminContext.Provider>
  )
}