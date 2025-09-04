import { useState, useMemo, useCallback, memo } from "react"
import { Users, GraduationCap, Trophy, TrendingUp, Plus, Search, Filter, X, Mail, Phone, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom"
import { useAdmin } from "@/hooks/useAdmin"
import { AdminDialog } from "@/components/AdminDialog"
import { useToast } from "@/hooks/use-toast"

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

// Mock data with realistic Nigerian names - Extended across all levels
const mockStudents: Student[] = [
  // 400 Level Students
  {
    id: "1",
    name: "Adebayo Olumide",
    studentId: "CS/2020/001",
    level: "400",
    cgpa: 4.5,
    email: "adebayo.olumide@unijos.edu.ng",
    skills: ["JavaScript", "React", "Node.js"],
    status: "Active"
  },
  {
    id: "2",
    name: "Chinedu Okafor",
    studentId: "CS/2019/123",
    level: "400",
    cgpa: 4.8,
    email: "chinedu.okafor@unijos.edu.ng", 
    skills: ["Java", "Spring", "Angular"],
    status: "Active"
  },
  {
    id: "3",
    name: "Emeka Nwosu",
    studentId: "CS/2020/156",
    level: "400",
    cgpa: 4.1,
    email: "emeka.nwosu@unijos.edu.ng",
    skills: ["PHP", "Laravel", "MySQL"],
    status: "Active"
  },
  {
    id: "4",
    name: "Blessing Okoro",
    studentId: "CS/2020/089",
    level: "400",
    cgpa: 4.3,
    email: "blessing.okoro@unijos.edu.ng",
    skills: ["C#", ".NET", "Azure"],
    status: "Active"
  },
  {
    id: "5",
    name: "Ibrahim Musa",
    studentId: "CS/2020/145",
    level: "400",
    cgpa: 4.0,
    email: "ibrahim.musa@unijos.edu.ng",
    skills: ["Go", "Kubernetes", "Docker"],
    status: "Active"
  },
  
  // 300 Level Students
  {
    id: "6", 
    name: "Fatima Usman",
    studentId: "CS/2021/045",
    level: "300",
    cgpa: 4.2,
    email: "fatima.usman@unijos.edu.ng",
    skills: ["Python", "Django", "PostgreSQL"],
    status: "Active"
  },
  {
    id: "7",
    name: "Zainab Mohammed",
    studentId: "CS/2021/089",
    level: "300",
    cgpa: 4.6,
    email: "zainab.mohammed@unijos.edu.ng",
    skills: ["React Native", "Flutter", "Mobile Dev"],
    status: "Active"
  },
  {
    id: "8",
    name: "Daniel Yakubu",
    studentId: "CS/2021/112",
    level: "300",
    cgpa: 3.8,
    email: "daniel.yakubu@unijos.edu.ng",
    skills: ["Ruby", "Rails", "Redis"],
    status: "Active"
  },
  {
    id: "9",
    name: "Grace Adamu",
    studentId: "CS/2021/203",
    level: "300",
    cgpa: 4.4,
    email: "grace.adamu@unijos.edu.ng",
    skills: ["Vue.js", "TypeScript", "Firebase"],
    status: "Active"
  },
  {
    id: "10",
    name: "Yusuf Garba",
    studentId: "CS/2021/167",
    level: "300",
    cgpa: 3.9,
    email: "yusuf.garba@unijos.edu.ng",
    skills: ["Rust", "WebAssembly", "Blockchain"],
    status: "Active"
  },
  
  // 200 Level Students
  {
    id: "11",
    name: "Aisha Abdullahi",
    studentId: "CS/2022/078",
    level: "200",
    cgpa: 3.9,
    email: "aisha.abdullahi@unijos.edu.ng",
    skills: ["C++", "Data Structures", "Algorithms"],
    status: "Active"
  },
  {
    id: "12",
    name: "Michael Eze",
    studentId: "CS/2022/134",
    level: "200",
    cgpa: 3.7,
    email: "michael.eze@unijos.edu.ng",
    skills: ["HTML", "CSS", "JavaScript"],
    status: "Active"
  },
  {
    id: "13",
    name: "Khadija Sani",
    studentId: "CS/2022/098",
    level: "200",
    cgpa: 4.1,
    email: "khadija.sani@unijos.edu.ng",
    skills: ["Python", "Pandas", "NumPy"],
    status: "Active"
  },
  {
    id: "14",
    name: "James Akpan",
    studentId: "CS/2022/156",
    level: "200",
    cgpa: 3.6,
    email: "james.akpan@unijos.edu.ng",
    skills: ["Java", "OOP", "SQL"],
    status: "Active"
  },
  {
    id: "15",
    name: "Hauwa Ahmed",
    studentId: "CS/2022/201",
    level: "200",
    cgpa: 4.0,
    email: "hauwa.ahmed@unijos.edu.ng",
    skills: ["C", "Assembly", "Computer Architecture"],
    status: "Active"
  },
  
  // 100 Level Students
  {
    id: "16",
    name: "Samuel Okonkwo",
    studentId: "CS/2023/045",
    level: "100",
    cgpa: 3.8,
    email: "samuel.okonkwo@unijos.edu.ng",
    skills: ["Basic Programming", "Mathematics", "Logic"],
    status: "Active"
  },
  {
    id: "17",
    name: "Mary Titus",
    studentId: "CS/2023/089",
    level: "100",
    cgpa: 4.2,
    email: "mary.titus@unijos.edu.ng",
    skills: ["Python Basics", "Problem Solving", "Mathematics"],
    status: "Active"
  },
  {
    id: "18",
    name: "Abdul Rahman",
    studentId: "CS/2023/123",
    level: "100",
    cgpa: 3.5,
    email: "abdul.rahman@unijos.edu.ng",
    skills: ["C Programming", "Discrete Math", "Logic"],
    status: "Active"
  },
  {
    id: "19",
    name: "Esther John",
    studentId: "CS/2023/167",
    level: "100",
    cgpa: 3.9,
    email: "esther.john@unijos.edu.ng",
    skills: ["HTML", "Basic CSS", "Mathematics"],
    status: "Active"
  },
  {
    id: "20",
    name: "Aliyu Bello",
    studentId: "CS/2023/201",
    level: "100",
    cgpa: 3.7,
    email: "aliyu.bello@unijos.edu.ng",
    skills: ["Programming Fundamentals", "Computer Literacy", "Mathematics"],
    status: "Active"
  }
]

export default function Dashboard() {
  const [students] = useState<Student[]>(mockStudents)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState<string>("all")
  const [adminDialogOpen, setAdminDialogOpen] = useState(false)
  const [pendingAdminAction, setPendingAdminAction] = useState<() => void>(() => {})
  const [adminFeature, setAdminFeature] = useState("")
  
  const navigate = useNavigate()
  const { isAdmin } = useAdmin()
  const { toast } = useToast()

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLevel = filterLevel === "all" || student.level === filterLevel
      return matchesSearch && matchesLevel
    })
  }, [students, searchTerm, filterLevel])

  const stats = useMemo(() => ({
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === "Active").length,
    finalYearStudents: students.filter(s => s.level === "400").length
  }), [students])

  const requireAdminAccess = useCallback((action: () => void, featureName: string) => {
    if (isAdmin) {
      action()
    } else {
      setPendingAdminAction(() => action)
      setAdminFeature(featureName)
      setAdminDialogOpen(true)
    }
  }, [isAdmin])

  const handleBulkImport = useCallback(() => {
    toast({
      title: "Bulk Import Feature",
      description: "This will allow you to import multiple student records from CSV/Excel files. Feature coming soon!",
    })
  }, [toast])

  const handleGenerateReport = useCallback(() => {
    const reportData = {
      totalStudents: stats.totalStudents,
      byLevel: {
        "100": students.filter(s => s.level === "100").length,
        "200": students.filter(s => s.level === "200").length,
        "300": students.filter(s => s.level === "300").length,
        "400": students.filter(s => s.level === "400").length,
      },
      averageCGPA: (students.reduce((sum, s) => sum + s.cgpa, 0) / students.length).toFixed(2)
    }
    toast({
      title: "Report Generated Successfully!",
      description: `Total Students: ${reportData.totalStudents}, Average CGPA: ${reportData.averageCGPA}`,
    })
  }, [stats, students, toast])

  const handleAcademicRecords = useCallback(() => {
    toast({
      title: "Academic Records Access",
      description: "Access granted to view detailed transcripts, track course progressions, and generate official documents.",
    })
  }, [toast])

  const handleExportData = useCallback(() => {
    const csvData = students.map(s => 
      `${s.name},${s.studentId},${s.level},${s.cgpa},${s.email},${s.skills.join(';')},${s.status}`
    ).join('\n')
    const header = "Name,Student ID,Level,CGPA,Email,Skills,Status\n"
    const blob = new Blob([header + csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'students_data.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast({
      title: "Data Exported Successfully!",
      description: "Student data has been exported to CSV file.",
    })
  }, [students, toast])

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto py-8 responsive-padding space-y-8">
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
      <div className="grid gap-6 md:grid-cols-3 animate-slide-up">
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
            <CardTitle className="text-sm font-medium">Final Year</CardTitle>
            <Trophy className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.finalYearStudents}</div>
            <p className="text-xs text-muted-foreground">400 Level students</p>
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
          </select>
        </div>
        <Button 
          className="btn-university" 
          size="lg"
          onClick={() => navigate('/biodata-form')}
        >
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.profileImage} />
                          <AvatarFallback className="bg-gradient-primary text-white font-semibold text-sm">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {student.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Student ID</p>
                          <p className="font-medium">{student.studentId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Level</p>
                          <p className="font-medium">{student.level}L</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">CGPA</p>
                          <p className="font-bold text-primary">{student.cgpa.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge variant={student.status === "Active" ? "default" : "secondary"} className="w-fit">
                            {student.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Contact Information</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{student.email}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Skills & Technologies</p>
                        <div className="flex flex-wrap gap-2">
                          {student.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => requireAdminAccess(handleBulkImport, "Bulk Import")}
            >
              <Users className="h-6 w-6 text-primary" />
              <span className="text-sm">Bulk Import</span>
              {!isAdmin && <span className="text-xs text-muted-foreground">(Admin Only)</span>}
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => requireAdminAccess(handleGenerateReport, "Generate Report")}
            >
              <Filter className="h-6 w-6 text-primary" />
              <span className="text-sm">Generate Report</span>
              {!isAdmin && <span className="text-xs text-muted-foreground">(Admin Only)</span>}
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => requireAdminAccess(handleAcademicRecords, "Academic Records")}
            >
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-sm">Academic Records</span>
              {!isAdmin && <span className="text-xs text-muted-foreground">(Admin Only)</span>}
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={handleExportData}
            >
              <Trophy className="h-6 w-6 text-primary" />
              <span className="text-sm">Export Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Dialog */}
      <AdminDialog
        isOpen={adminDialogOpen}
        onClose={() => setAdminDialogOpen(false)}
        onSuccess={pendingAdminAction}
        feature={adminFeature}
      />
      </div>
    </div>
  )
}