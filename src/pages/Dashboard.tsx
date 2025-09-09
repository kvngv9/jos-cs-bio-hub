import { useState, useMemo, useCallback, memo } from "react"
import { Users, GraduationCap, Trophy, TrendingUp, Plus, Search, Filter, X, Mail, Phone, MapPin, Download, Grid, List } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "react-router-dom"
import { useAdmin } from "@/hooks/useAdmin"
import { AdminDialog } from "@/components/AdminDialog"
import { useToast } from "@/hooks/use-toast"
import { StudentCard } from "@/components/StudentCard"

interface Student {
  id: string
  name: string
  studentId: string
  level: string
  cgpa?: number
  email: string
  phone?: string
  profileImage?: string
  skills: string[]
  status: "Active" | "Graduate" | "Suspended"
  hobbies?: string[]
  goals?: string[]
  address?: string
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
    phone: "+234 803 123 4567",
    skills: ["JavaScript", "React", "Node.js"],
    status: "Active",
    hobbies: ["Football", "Reading", "Coding"],
    goals: ["Become a Senior Software Engineer", "Start a tech company"],
    address: "Jos, Plateau State"
  },
  {
    id: "2",
    name: "Chinedu Okafor",
    studentId: "CS/2019/123",
    level: "400",
    cgpa: 4.8,
    email: "chinedu.okafor@unijos.edu.ng", 
    phone: "+234 802 987 6543",
    skills: ["Java", "Spring", "Angular"],
    status: "Active",
    hobbies: ["Chess", "Basketball", "Music"],
    goals: ["Work at Google", "Build enterprise applications"],
    address: "Abuja, FCT"
  },
  {
    id: "3",
    name: "Emeka Nwosu",
    studentId: "CS/2020/156",
    level: "400",
    cgpa: 4.1,
    email: "emeka.nwosu@unijos.edu.ng",
    phone: "+234 805 234 5678",
    skills: ["PHP", "Laravel", "MySQL"],
    status: "Active",
    hobbies: ["Photography", "Travel", "Cooking"],
    goals: ["Master web development", "Work remotely"],
    address: "Lagos, Lagos State"
  },
  {
    id: "4",
    name: "Blessing Okoro",
    studentId: "CS/2020/089",
    level: "400",
    cgpa: 4.3,
    email: "blessing.okoro@unijos.edu.ng",
    phone: "+234 807 345 6789",
    skills: ["C#", ".NET", "Azure"],
    status: "Active",
    hobbies: ["Dancing", "Singing", "Volunteering"],
    goals: ["Become a cloud architect", "Help others learn tech"],
    address: "Port Harcourt, Rivers State"
  },
  {
    id: "5",
    name: "Ibrahim Musa",
    studentId: "CS/2020/145",
    level: "400",
    cgpa: 4.0,
    email: "ibrahim.musa@unijos.edu.ng",
    phone: "+234 809 456 7890",
    skills: ["Go", "Kubernetes", "Docker"],
    status: "Active",
    hobbies: ["Reading", "Hiking", "Tech meetups"],
    goals: ["Master DevOps", "Work in fintech"],
    address: "Kano, Kano State"
  },
  
  // 300 Level Students
  {
    id: "6", 
    name: "Fatima Usman",
    studentId: "CS/2021/045",
    level: "300",
    cgpa: 4.2,
    email: "fatima.usman@unijos.edu.ng",
    phone: "+234 808 567 8901",
    skills: ["Python", "Django", "PostgreSQL"],
    status: "Active",
    hobbies: ["Writing", "Painting", "Fitness"],
    goals: ["Become a data scientist", "Publish a tech blog"],
    address: "Kaduna, Kaduna State"
  },
  {
    id: "7",
    name: "Zainab Mohammed",
    studentId: "CS/2021/089",
    level: "300",
    cgpa: 4.6,
    email: "zainab.mohammed@unijos.edu.ng",
    phone: "+234 806 678 9012",
    skills: ["React Native", "Flutter", "Mobile Dev"],
    status: "Active",
    hobbies: ["Gaming", "Animation", "Design"],
    goals: ["Build successful mobile apps", "Learn AI/ML"],
    address: "Maiduguri, Borno State"
  },
  {
    id: "8",
    name: "Daniel Adamu",
    studentId: "CS/2021/234",
    level: "300",
    cgpa: 3.9,
    email: "daniel.adamu@unijos.edu.ng",
    phone: "+234 810 789 0123",
    skills: ["Vue.js", "Express", "MongoDB"],
    status: "Active",
    hobbies: ["Music production", "Football", "Movies"],
    goals: ["Master full-stack development", "Create a music app"],
    address: "Jos, Plateau State"
  },
  {
    id: "9",
    name: "Grace Onyeka",
    studentId: "CS/2021/178",
    level: "300",
    cgpa: 4.4,
    email: "grace.onyeka@unijos.edu.ng",
    phone: "+234 812 890 1234",
    skills: ["UI/UX Design", "Figma", "Adobe XD"],
    status: "Active",
    hobbies: ["Art", "Fashion", "Traveling"],
    goals: ["Become a lead designer", "Start a design agency"],
    address: "Enugu, Enugu State"
  },
  {
    id: "10",
    name: "Samuel Yakubu",
    studentId: "CS/2021/456",
    level: "300",
    cgpa: 3.8,
    email: "samuel.yakubu@unijos.edu.ng",
    phone: "+234 814 901 2345",
    skills: ["Cybersecurity", "Ethical Hacking", "Network Security"],
    status: "Active",
    hobbies: ["Gaming", "Tech research", "Swimming"],
    goals: ["Become a security expert", "Help protect organizations"],
    address: "Bauchi, Bauchi State"
  },

  // 200 Level Students  
  {
    id: "11",
    name: "Amina Hassan",
    studentId: "CS/2022/067",
    level: "200",
    cgpa: 4.1,
    email: "amina.hassan@unijos.edu.ng",
    phone: "+234 816 012 3456",
    skills: ["HTML", "CSS", "JavaScript"],
    status: "Active",
    hobbies: ["Reading", "Calligraphy", "Cooking"],
    goals: ["Learn advanced programming", "Get internship"],
    address: "Sokoto, Sokoto State"
  },
  {
    id: "12",
    name: "Chioma Ezekiel",
    studentId: "CS/2022/134",
    level: "200",
    cgpa: 3.7,
    email: "chioma.ezekiel@unijos.edu.ng",
    phone: "+234 818 123 4567",
    skills: ["Java", "C++", "Python"],
    status: "Active",
    hobbies: ["Singing", "Dancing", "Volunteering"],
    goals: ["Excel in algorithms", "Join tech community"],
    address: "Owerri, Imo State"
  },
  {
    id: "13",
    name: "Yusuf Aliyu",
    studentId: "CS/2022/289",
    level: "200",
    cgpa: 3.9,
    email: "yusuf.aliyu@unijos.edu.ng",
    phone: "+234 820 234 5678",
    skills: ["Git", "Linux", "Database Design"],
    status: "Active",
    hobbies: ["Chess", "Reading", "Mentoring"],
    goals: ["Master data structures", "Build a portfolio"],
    address: "Katsina, Katsina State"
  },
  {
    id: "14",
    name: "Esther James",
    studentId: "CS/2022/345",
    level: "200",
    cgpa: 4.0,
    email: "esther.james@unijos.edu.ng",
    phone: "+234 822 345 6789",
    skills: ["Web Design", "Photoshop", "Bootstrap"],
    status: "Active",
    hobbies: ["Art", "Photography", "Social media"],
    goals: ["Learn React", "Create beautiful websites"],
    address: "Uyo, Akwa Ibom State"
  },
  {
    id: "15",
    name: "Mohammed Garba",
    studentId: "CS/2022/567",
    level: "200",
    cgpa: 3.6,
    email: "mohammed.garba@unijos.edu.ng",
    phone: "+234 824 456 7890",
    skills: ["C Programming", "Problem Solving", "Mathematics"],
    status: "Active",
    hobbies: ["Football", "Mathematics", "Tech news"],
    goals: ["Improve programming skills", "Join coding competitions"],
    address: "Gombe, Gombe State"
  },

  // 100 Level Students
  {
    id: "16",
    name: "Precious Adaora",
    studentId: "CS/2023/123",
    level: "100",
    cgpa: 3.8,
    email: "precious.adaora@unijos.edu.ng",
    phone: "+234 826 567 8901",
    skills: ["Basic Programming", "Computer Fundamentals"],
    status: "Active",
    hobbies: ["Reading", "Music", "Learning"],
    goals: ["Master programming basics", "Choose specialization"],
    address: "Abakaliki, Ebonyi State"
  },
  {
    id: "17",
    name: "Abdul Rahman",
    studentId: "CS/2023/045",
    level: "100",
    cgpa: 4.2,
    email: "abdul.rahman@unijos.edu.ng",
    phone: "+234 828 678 9012",
    skills: ["Microsoft Office", "Basic HTML"],
    status: "Active",
    hobbies: ["Reading Quran", "Football", "Technology"],
    goals: ["Learn to code", "Understand computer science"],
    address: "Zaria, Kaduna State"
  },
  {
    id: "18",
    name: "Joy Okechukwu",
    studentId: "CS/2023/234",
    level: "100",
    cgpa: 3.5,
    email: "joy.okechukwu@unijos.edu.ng",
    phone: "+234 830 789 0123",
    skills: ["Computer Basics", "Typing"],
    status: "Active",
    hobbies: ["Singing", "Dancing", "Movies"],
    goals: ["Learn programming", "Make friends"],
    address: "Awka, Anambra State"
  },
  {
    id: "19",
    name: "Suleiman Bello",
    studentId: "CS/2023/456",
    level: "100",
    cgpa: 3.9,
    email: "suleiman.bello@unijos.edu.ng",
    phone: "+234 832 890 1234",
    skills: ["Problem Solving", "Basic Math"],
    status: "Active",
    hobbies: ["Football", "Reading", "Prayer"],
    goals: ["Excel in studies", "Learn advanced computing"],
    address: "Birnin Kebbi, Kebbi State"
  },
  {
    id: "20",
    name: "Favour Eze",
    studentId: "CS/2023/789",
    level: "100",
    cgpa: 4.0,
    email: "favour.eze@unijos.edu.ng",
    phone: "+234 834 901 2345",
    skills: ["Research", "Communication"],
    status: "Active",
    hobbies: ["Writing", "Social media", "Fashion"],
    goals: ["Understand programming", "Build confidence"],
    address: "Calabar, Cross River State"
  }
]

export default function Dashboard() {
  const [students] = useState<Student[]>(mockStudents)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [adminDialogOpen, setAdminDialogOpen] = useState(false)
  const [pendingAdminAction, setPendingAdminAction] = useState<() => void>(() => {})
  const [adminFeature, setAdminFeature] = useState("")
  
  const navigate = useNavigate()
  const { isAdmin } = useAdmin()
  const { toast } = useToast()

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
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
      title: "Bulk Import Started!",
      description: "Processing student data import in the background.",
    })
  }, [toast])

  const handleGenerateReport = useCallback(() => {
    toast({
      title: "Report Generated!",
      description: "Comprehensive student report has been generated successfully.",
    })
  }, [toast])

  const handleAcademicRecords = useCallback(() => {
    toast({
      title: "Academic Records Access!",
      description: "Opening academic records management system.",
    })
  }, [toast])

  const handleExportData = useCallback(() => {
    const csvData = students.map(student => 
      `"${student.name}","${student.studentId}","${student.level}","${student.cgpa || 'N/A'}","${student.email}","${student.skills.join('; ')}","${student.status}"`
    ).join('\n')
    
    const header = '"Name","Student ID","Level","CGPA","Email","Skills","Status"\n'
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
                placeholder="Search by name, ID, email, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="100">100 Level</SelectItem>
                  <SelectItem value="200">200 Level</SelectItem>
                  <SelectItem value="300">300 Level</SelectItem>
                  <SelectItem value="400">400 Level</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => requireAdminAccess(() => {
                const printWindow = window.open('', '_blank')
                if (printWindow) {
                  printWindow.document.write(`
                    <html>
                      <head><title>Student Directory</title></head>
                      <body>
                        <h1>Computer Science Department - Student Directory</h1>
                        ${filteredStudents.map(s => `
                          <div style="border: 1px solid #ccc; margin: 10px; padding: 10px;">
                            <h3>${s.name}</h3>
                            <p>ID: ${s.studentId} | Level: ${s.level} | CGPA: ${s.cgpa?.toFixed(2) || 'N/A'}</p>
                            <p>Email: ${s.email}</p>
                            <p>Skills: ${s.skills.join(', ')}</p>
                          </div>
                        `).join('')}
                      </body>
                    </html>
                  `)
                  printWindow.document.close()
                  printWindow.print()
                }
              }, "Print Directory")}
            >
              <Download className="h-4 w-4 mr-2" />
              Print
            </Button>
            
            <Button 
              className="btn-university" 
              size="lg"
              onClick={() => navigate('/biodata-form')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Student
            </Button>
          </div>
        </div>

        {/* Students Display */}
        {viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
            {filteredStudents.map((student, index) => (
              <StudentCard 
                key={student.id} 
                student={student} 
                className="animate-scale-in" 
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            {filteredStudents.map((student, index) => (
              <Card key={student.id} className="card-profile animate-scale-in">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.profileImage} />
                        <AvatarFallback>
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{student.studentId}</span>
                          <span>•</span>
                          <span>Level {student.level}</span>
                          {student.cgpa && (
                            <>
                              <span>•</span>
                              <span>CGPA: {student.cgpa.toFixed(2)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={student.status === "Active" ? "default" : "secondary"}>
                        {student.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No students found matching your criteria.</p>
          </div>
        )}

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