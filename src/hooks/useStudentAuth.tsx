import { useState, useEffect, createContext, useContext, ReactNode } from "react"

interface Student {
  id: string
  name: string
  email: string
  studentId: string
  level: string
  approved: boolean
  profilePicture?: string
  cgpa?: number
  skills?: string[]
  hobbies?: string[]
  goals?: string
  address?: string
  phone?: string
  personalityType?: string
  bio?: string
  lga?: string
}

interface StudentAuthContextType {
  currentStudent: Student | null
  allStudents: Student[]
  login: (email: string, studentId: string) => boolean
  logout: () => void
  updateProfile: (updates: Partial<Student>) => void
  addStudent: (student: Student) => void
  updateStudent: (id: string, updates: Partial<Student>) => void
  deleteStudent: (id: string) => void
  approveStudent: (id: string) => void
}

const StudentAuthContext = createContext<StudentAuthContextType | null>(null)

export const useStudentAuth = () => {
  const context = useContext(StudentAuthContext)
  if (!context) {
    throw new Error("useStudentAuth must be used within StudentAuthProvider")
  }
  return context
}

interface StudentAuthProviderProps {
  children: ReactNode
}

export const StudentAuthProvider = ({ children }: StudentAuthProviderProps) => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null)
  const [allStudents, setAllStudents] = useState<Student[]>([])

  useEffect(() => {
    // Load students from localStorage
    const storedStudents = localStorage.getItem("students")
    if (storedStudents) {
      setAllStudents(JSON.parse(storedStudents))
    }

    // Check if student is logged in
    const studentSession = sessionStorage.getItem("student_session")
    if (studentSession) {
      const student = JSON.parse(studentSession)
      setCurrentStudent(student)
    }
  }, [])

  useEffect(() => {
    // Save students to localStorage whenever allStudents changes
    localStorage.setItem("students", JSON.stringify(allStudents))
  }, [allStudents])

  const login = (email: string, studentId: string): boolean => {
    const student = allStudents.find(s => s.email === email && s.studentId === studentId)
    if (student && student.approved) {
      setCurrentStudent(student)
      sessionStorage.setItem("student_session", JSON.stringify(student))
      return true
    }
    return false
  }

  const logout = () => {
    setCurrentStudent(null)
    sessionStorage.removeItem("student_session")
  }

  const updateProfile = (updates: Partial<Student>) => {
    if (!currentStudent) return

    const updatedStudent = { ...currentStudent, ...updates }
    setCurrentStudent(updatedStudent)
    sessionStorage.setItem("student_session", JSON.stringify(updatedStudent))

    // Update in allStudents array
    setAllStudents(prev => 
      prev.map(s => s.id === currentStudent.id ? updatedStudent : s)
    )
  }

  const addStudent = (student: Student) => {
    setAllStudents(prev => [...prev, student])
  }

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setAllStudents(prev => 
      prev.map(s => s.id === id ? { ...s, ...updates } : s)
    )
    
    // Update current student if it's the same one
    if (currentStudent?.id === id) {
      const updatedStudent = { ...currentStudent, ...updates }
      setCurrentStudent(updatedStudent)
      sessionStorage.setItem("student_session", JSON.stringify(updatedStudent))
    }
  }

  const deleteStudent = (id: string) => {
    setAllStudents(prev => prev.filter(s => s.id !== id))
    
    // Logout if current student is deleted
    if (currentStudent?.id === id) {
      logout()
    }
  }

  const approveStudent = (id: string) => {
    updateStudent(id, { approved: true })
  }

  return (
    <StudentAuthContext.Provider value={{
      currentStudent,
      allStudents,
      login,
      logout,
      updateProfile,
      addStudent,
      updateStudent,
      deleteStudent,
      approveStudent
    }}>
      {children}
    </StudentAuthContext.Provider>
  )
}