import { useState } from "react"
import { Users, GraduationCap, Trophy, TrendingUp, Plus, Search, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Student {
  id: string
  name: string
  studentId: string
  level: string
  cgpa: number
  email: string
  profileImage?: string
  skills: string[]
  status: "Active" | "Graduate" | "Suspended"
}

// Mock data for demonstration
const mockStudents: Student[] = [
  {
    id: "1",
    name: "John Doe",
    studentId: "CS/2020/001",
    level: "400",
    cgpa: 4.5,
    email: "john.doe@unijos.edu.ng",
    skills: ["JavaScript", "React", "Node.js"],
    status: "Active"
  },
  {
    id: "2", 
    name: "Jane Smith",
    studentId: "CS/2021/045",
    level: "300",
    cgpa: 4.2,
    email: "jane.smith@unijos.edu.ng",
    skills: ["Python", "Django", "PostgreSQL"],
    status: "Active"
  },
  {
    id: "3",
    name: "Michael Johnson",
    studentId: "CS/2019/123",
    level: "500",
    cgpa: 4.8,
    email: "michael.j@unijos.edu.ng", 
    skills: ["Java", "Spring", "Angular"],
    status: "Active"
  }
]

export default function Dashboard() {
  const [students] = useState<Student[]>(mockStudents)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState<string>("all")

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = filterLevel === "all" || student.level === filterLevel
    return matchesSearch && matchesLevel
  })

  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === "Active").length,
    averageCGPA: (students.reduce((sum, s) => sum + s.cgpa, 0) / students.length).toFixed(2),
    graduatesThisYear: students.filter(s => s.level === "500").length
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          CS Department Dashboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive bio-data management system for Computer Science students at University of Jos
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
        <Card className="card-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Registered in system</p>
          </CardContent>
        </Card>

        <Card className="card-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.activeStudents}</div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>

        <Card className="card-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CGPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{stats.averageCGPA}</div>
            <p className="text-xs text-muted-foreground">Department average</p>
          </CardContent>
        </Card>

        <Card className="card-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Final Year</CardTitle>
            <Trophy className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.graduatesThisYear}</div>
            <p className="text-xs text-muted-foreground">500 Level students</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between animate-slide-up">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">All Levels</option>
            <option value="100">100 Level</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
            <option value="500">500 Level</option>
          </select>
        </div>
        <Button className="btn-university" size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Add New Student
        </Button>
      </div>

      {/* Students Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
        {filteredStudents.map((student, index) => (
          <Card key={student.id} className="card-profile animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarImage src={student.profileImage} />
                  <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    {student.studentId}
                    <Badge variant="outline" className="text-xs">
                      {student.level}L
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">CGPA</span>
                <span className="font-bold text-primary">{student.cgpa.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Skills</span>
                <div className="flex flex-wrap gap-1">
                  {student.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {student.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{student.skills.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Badge 
                  variant={student.status === "Active" ? "default" : "secondary"}
                  className={student.status === "Active" ? "bg-success text-success-foreground" : ""}
                >
                  {student.status}
                </Badge>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="card-academic animate-slide-up">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <span className="text-sm">Bulk Import</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Filter className="h-6 w-6 text-primary" />
              <span className="text-sm">Generate Report</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-sm">Academic Records</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              <span className="text-sm">Export Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}