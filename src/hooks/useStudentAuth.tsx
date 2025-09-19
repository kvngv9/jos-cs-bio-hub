import { useState, useEffect, createContext, useContext, ReactNode } from "react"

interface Student {
  id: string
  name: string
  email: string
  studentId: string
  level: string
  approved: boolean
  completionStatus: "completed" | "incomplete" | "former"
  submittedAt?: string
  
  // Personal Information
  firstName?: string
  lastName?: string
  middleName?: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  nationality?: string
  stateOfOrigin?: string
  lga?: string
  address?: string
  profilePicture?: string
  profileImage?: string
  
  // Academic Information
  entryYear?: string
  expectedGraduation?: string
  
  // Additional Information
  hobbies?: string
  goals?: string
  personalityType?: string
  bio?: string
  skills?: string[]
  projects?: Array<{
    title: string
    description: string
    technologies: string
    year: string
  }>
  experiences?: Array<{
    company: string
    role: string
    duration: string
    description: string
  }>
  
  // Emergency Contact
  emergencyName?: string
  emergencyPhone?: string
  emergencyRelationship?: string
  
  // Legacy fields for compatibility
  guardianName?: string
  guardianPhone?: string
  nextOfKin?: string
  nextOfKinPhone?: string
  department?: string
  faculty?: string
  bloodGroup?: string
  genotype?: string
  religion?: string
  maritalStatus?: string
  emergencyContact?: string
  emergencyContactPhone?: string
  previousInstitution?: string
  qualification?: string
  yearOfAdmission?: string
}

interface StudentAuthContextType {
  currentStudent: Student | null
  allStudents: Student[]
  login: (email: string, password: string) => boolean
  logout: () => void
  updateProfile: (updates: Partial<Student>) => void
  addStudent: (student: Student) => void
  updateStudent: (id: string, updates: Partial<Student>) => void
  deleteStudent: (id: string) => void
  approveStudent: (id: string) => void
  exportStudentData: () => void
  bulkImportStudents: (students: Student[]) => void
  getStudentsByStatus: (status: "completed" | "incomplete" | "former") => Student[]
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

  const login = (email: string, password: string): boolean => {
    // Default password is "0000" for all students
    if (password !== "0000") return false
    
    const student = allStudents.find(s => s.email === email)
    if (student) {
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

  const exportStudentData = () => {
    const csvData = allStudents.map(student => 
      `"${student.name}","${student.studentId}","${student.level}","${student.email}","${student.phone || ''}","${student.lga || ''}","${student.completionStatus}","${student.submittedAt || ''}"`
    ).join('\n')
    
    const header = '"Name","Student ID","Level","Email","Phone","LGA","Status","Submitted At"\n'
    const blob = new Blob([header + csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `students_data_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const bulkImportStudents = (students: Student[]) => {
    setAllStudents(prev => [...prev, ...students])
  }

  const getStudentsByStatus = (status: "completed" | "incomplete" | "former") => {
    return allStudents.filter(student => student.completionStatus === status)
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
      approveStudent,
      exportStudentData,
      bulkImportStudents,
      getStudentsByStatus
    }}>
      {children}
    </StudentAuthContext.Provider>
  )
}