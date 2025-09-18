import { useState, useEffect } from 'react'

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
  completionStatus: "completed" | "incomplete" | "former"
  submittedAt?: string
  entryYear?: string
}

// Sample data for testing
const sampleStudents: Student[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@student.unijos.edu.ng",
    studentId: "CS/2021/001",
    level: "300",
    approved: true,
    cgpa: 4.5,
    phone: "+234 803 123 4567",
    completionStatus: "completed",
    submittedAt: "2024-01-15T10:30:00Z",
    entryYear: "2021",
    lga: "Jos North",
    address: "University of Jos, Jos, Plateau State",
    skills: ["JavaScript", "React", "Node.js"],
    bio: "Passionate about web development and software engineering."
  },
  {
    id: "2", 
    name: "Jane Smith",
    email: "jane.smith@student.unijos.edu.ng",
    studentId: "CS/2022/045",
    level: "200",
    approved: true,
    cgpa: undefined,
    phone: undefined,
    completionStatus: "incomplete",
    submittedAt: "2024-02-01T14:20:00Z",
    entryYear: "2022",
    lga: undefined,
    address: undefined,
    skills: ["Python", "Django"],
    bio: undefined
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.johnson@alumni.unijos.edu.ng", 
    studentId: "CS/2018/123",
    level: "400",
    approved: true,
    cgpa: 4.8,
    phone: "+234 805 987 6543",
    completionStatus: "former",
    submittedAt: "2022-06-15T16:45:00Z",
    entryYear: "2018", 
    lga: "Bassa",
    address: "Lagos, Nigeria",
    skills: ["Java", "Spring Boot", "AWS"],
    bio: "Software engineer at Google, graduated with first class honors."
  }
]

export const useStudentData = () => {
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    // Load from localStorage or use sample data
    const storedStudents = localStorage.getItem('students')
    if (storedStudents) {
      const parsed = JSON.parse(storedStudents)
      // Add sample data if no real data exists
      if (parsed.length === 0) {
        setStudents(sampleStudents)
        localStorage.setItem('students', JSON.stringify(sampleStudents))
      } else {
        setStudents(parsed)
      }
    } else {
      setStudents(sampleStudents)
      localStorage.setItem('students', JSON.stringify(sampleStudents))
    }
  }, [])

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updates } : s)
      localStorage.setItem('students', JSON.stringify(updated))
      return updated
    })
  }

  const deleteStudent = (id: string) => {
    setStudents(prev => {
      const filtered = prev.filter(s => s.id !== id)
      localStorage.setItem('students', JSON.stringify(filtered))
      return filtered
    })
  }

  const addStudent = (student: Student) => {
    setStudents(prev => {
      const updated = [...prev, student]
      localStorage.setItem('students', JSON.stringify(updated))
      return updated
    })
  }

  return {
    students,
    updateStudent,
    deleteStudent,
    addStudent
  }
}