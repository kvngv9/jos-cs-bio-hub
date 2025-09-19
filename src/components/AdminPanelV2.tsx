import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useStudentAuth } from "@/hooks/useStudentAuth"
import { useAdmin } from "@/hooks/useAdmin"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminManagement } from "@/components/AdminManagement"
import { 
  Users, 
  UserCheck, 
  UserX, 
  Download, 
  Upload, 
  FileText, 
  Search, 
  Edit,
  Trash2,
  MessageCircle,
  PlusCircle,
  Settings,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Megaphone,
  Pin
} from "lucide-react"

interface Announcement {
  id: string
  title: string
  content: string
  type: 'general' | 'exam' | 'event' | 'urgent' | 'academic'
  date: Date
  isPinned: boolean
  author: string
  targetLevel?: string
}

interface LegacyPost {
  id: string
  name: string
  matricNumber: string
  quote: string
  level: string
  timestamp: Date
  likes: number
  category: 'inspiration' | 'wisdom' | 'advice' | 'humor'
}

export const AdminPanelV2 = () => {
  const { allStudents, updateStudent, deleteStudent, exportStudentData, getStudentsByStatus } = useStudentAuth()
  const { currentAdmin, isSuperAdmin } = useAdmin()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("overview")
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [legacyPosts, setLegacyPosts] = useState<LegacyPost[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  const [editingStudent, setEditingStudent] = useState<any>(null)
  const [newAnnouncement, setNewAnnouncement] = useState<Partial<Announcement>>({})
  const [showAdminManagement, setShowAdminManagement] = useState(false)

  useEffect(() => {
    // Load announcements
    const savedAnnouncements = localStorage.getItem('announcements')
    if (savedAnnouncements) {
      const parsed = JSON.parse(savedAnnouncements)
      setAnnouncements(parsed.map((a: any) => ({ ...a, date: new Date(a.date) })))
    }

    // Load legacy posts
    const savedLegacyPosts = localStorage.getItem('legacyWallEntries')
    if (savedLegacyPosts) {
      const parsed = JSON.parse(savedLegacyPosts)
      setLegacyPosts(parsed.map((p: any) => ({ ...p, timestamp: new Date(p.timestamp) })))
    }

    // Load student questions
    const savedQuestions = localStorage.getItem('student_questions')
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions))
    }
  }, [])

  const stats = useMemo(() => {
    const completed = getStudentsByStatus("completed")
    const incomplete = getStudentsByStatus("incomplete")
    const former = getStudentsByStatus("former")
    
    return {
      total: allStudents.length,
      completed: completed.length,
      incomplete: incomplete.length,
      former: former.length,
      approved: allStudents.filter(s => s.approved).length,
      pending: allStudents.filter(s => !s.approved).length,
      pendingQuestions: questions.filter(q => q.status === 'pending').length
    }
  }, [allStudents, questions, getStudentsByStatus])

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [allStudents, searchTerm])

  const handleStudentEdit = (student: any) => {
    setEditingStudent({ ...student })
  }

  const handleStudentUpdate = () => {
    if (editingStudent) {
      updateStudent(editingStudent.id, editingStudent)
      setEditingStudent(null)
      toast({
        title: "Student Updated",
        description: "Student biodata has been successfully updated.",
      })
    }
  }

  const handleStudentDelete = (studentId: string) => {
    deleteStudent(studentId)
    toast({
      title: "Student Deleted",
      description: "Student record has been removed from the system.",
      variant: "destructive"
    })
  }

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and content",
        variant: "destructive"
      })
      return
    }

    const announcement: Announcement = {
      id: Date.now().toString(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      type: newAnnouncement.type || 'general',
      date: new Date(),
      isPinned: newAnnouncement.isPinned || false,
      author: currentAdmin?.username || 'Admin',
      targetLevel: newAnnouncement.targetLevel
    }

    const updatedAnnouncements = [announcement, ...announcements]
    setAnnouncements(updatedAnnouncements)
    localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements))
    setNewAnnouncement({})
    
    toast({
      title: "Announcement Added",
      description: "New announcement has been published.",
    })
  }

  const handleDeleteAnnouncement = (id: string) => {
    const updatedAnnouncements = announcements.filter(a => a.id !== id)
    setAnnouncements(updatedAnnouncements)
    localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements))
    
    toast({
      title: "Announcement Deleted",
      description: "Announcement has been removed.",
    })
  }

  const handleReplyToQuestion = (questionId: string, reply: string) => {
    const updatedQuestions = questions.map(q => 
      q.id === questionId 
        ? { ...q, response: reply, status: 'answered', answeredAt: new Date().toISOString() }
        : q
    )
    setQuestions(updatedQuestions)
    localStorage.setItem('student_questions', JSON.stringify(updatedQuestions))
    
    toast({
      title: "Reply Sent",
      description: "Your response has been sent to the student.",
    })
  }

  const handleDeleteLegacyPost = (postId: string) => {
    const updatedPosts = legacyPosts.filter(p => p.id !== postId)
    setLegacyPosts(updatedPosts)
    localStorage.setItem('legacyWallEntries', JSON.stringify(updatedPosts))
    
    toast({
      title: "Post Deleted",
      description: "Legacy wall post has been removed.",
    })
  }

  if (!currentAdmin) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You need admin privileges to access this panel.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {currentAdmin.username} ({currentAdmin.role === 'super_admin' ? 'Super Admin' : 'Admin'})
          </p>
        </div>
        <div className="flex gap-2">
          {isSuperAdmin() && (
            <Button 
              variant="outline" 
              onClick={() => setShowAdminManagement(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Admin Management
            </Button>
          )}
          <Button onClick={exportStudentData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold text-primary">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{stats.incomplete}</p>
            <p className="text-sm text-muted-foreground">Incomplete</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserCheck className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-600">{stats.former}</p>
            <p className="text-sm text-muted-foreground">Former</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserCheck className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserX className="h-8 w-8 mx-auto text-red-600 mb-2" />
            <p className="text-2xl font-bold text-red-600">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-8 w-8 mx-auto text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-purple-600">{stats.pendingQuestions}</p>
            <p className="text-sm text-muted-foreground">Questions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="legacy">Legacy Wall</TabsTrigger>
          <TabsTrigger value="questions">Q&A</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {allStudents.slice(0, 5).map(student => (
                    <div key={student.id} className="flex justify-between items-center">
                      <span className="text-sm">{student.name}</span>
                      <Badge variant={student.completionStatus === "completed" ? "default" : "secondary"}>
                        {student.completionStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {questions.slice(0, 5).map(question => (
                    <div key={question.id} className="text-sm">
                      <p className="font-medium">{question.studentName}</p>
                      <p className="text-muted-foreground truncate">{question.question}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Completion Rate:</span>
                    <span>{Math.round((stats.completed / stats.total) * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approval Rate:</span>
                    <span>{Math.round((stats.approved / stats.total) * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Announcements:</span>
                    <span>{announcements.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Legacy Posts:</span>
                    <span>{legacyPosts.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredStudents.map(student => (
              <Card key={student.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-academic border-2 border-primary/20 flex items-center justify-center overflow-hidden">
                        {student.profilePicture || student.profileImage ? (
                          <img src={student.profilePicture || student.profileImage} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <div className="text-sm font-medium text-primary">
                            {student.name?.charAt(0) || student.firstName?.charAt(0) || 'S'}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim()}</h3>
                        <p className="text-sm text-muted-foreground">
                          {student.studentId} • {student.email}
                        </p>
                        <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                          <span>Level {student.level}</span>
                          {student.phone && <span>• {student.phone}</span>}
                          {student.entryYear && <span>• {student.entryYear}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={student.completionStatus === "completed" ? "default" : "secondary"}>
                        {student.completionStatus}
                      </Badge>
                      <Badge variant={student.approved ? "default" : "secondary"}>
                        {student.approved ? "Approved" : "Pending"}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStudentEdit(student)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStudentDelete(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Announcements</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={newAnnouncement.title || ""}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={newAnnouncement.content || ""}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Type</Label>
                      <Select 
                        value={newAnnouncement.type || "general"}
                        onValueChange={(value) => setNewAnnouncement({...newAnnouncement, type: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="exam">Exam</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Target Level (Optional)</Label>
                      <Select 
                        value={newAnnouncement.targetLevel || ""}
                        onValueChange={(value) => setNewAnnouncement({...newAnnouncement, targetLevel: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All levels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100L">100L</SelectItem>
                          <SelectItem value="200L">200L</SelectItem>
                          <SelectItem value="300L">300L</SelectItem>
                          <SelectItem value="400L">400L</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleAddAnnouncement} className="w-full">
                    Publish Announcement
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {announcements.map(announcement => (
              <Card key={announcement.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{announcement.title}</h3>
                        {announcement.isPinned && <Pin className="h-4 w-4 text-primary" />}
                        <Badge variant="outline">{announcement.type}</Badge>
                        {announcement.targetLevel && (
                          <Badge variant="secondary">{announcement.targetLevel}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                      <p className="text-xs text-muted-foreground">
                        By {announcement.author} • {announcement.date.toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="legacy" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Legacy Wall Management</h2>
          </div>

          <div className="space-y-4">
            {legacyPosts.map(post => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{post.name}</h3>
                        <Badge variant="outline">{post.category}</Badge>
                      </div>
                      <p className="text-sm mb-2">"{post.quote}"</p>
                      <p className="text-xs text-muted-foreground">
                        {post.matricNumber} • {post.timestamp.toLocaleDateString()} • {post.likes} likes
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteLegacyPost(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Student Questions & Responses</h2>
            <Badge variant="secondary">{stats.pendingQuestions} Pending</Badge>
          </div>

          <div className="space-y-4">
            {questions.map(question => (
              <Card key={question.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{question.studentName}</h3>
                      <Badge variant={question.status === 'pending' ? 'destructive' : 'default'}>
                        {question.status}
                      </Badge>
                    </div>
                    <p className="text-sm">{question.question}</p>
                    <p className="text-xs text-muted-foreground">
                      Asked on {new Date(question.timestamp).toLocaleDateString()}
                    </p>
                    
                    {question.status === 'pending' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">Reply</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reply to {question.studentName}</DialogTitle>
                            <DialogDescription>Question: {question.question}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Type your response..."
                              id={`reply-${question.id}`}
                              className="min-h-[100px]"
                            />
                            <Button 
                              onClick={() => {
                                const reply = (document.getElementById(`reply-${question.id}`) as HTMLTextAreaElement)?.value
                                if (reply) {
                                  handleReplyToQuestion(question.id, reply)
                                }
                              }}
                              className="w-full"
                            >
                              Send Response
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    {question.response && (
                      <div className="bg-muted p-3 rounded">
                        <p className="text-sm font-medium">Admin Response:</p>
                        <p className="text-sm">{question.response}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Answered on {new Date(question.answeredAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={exportStudentData} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Students (CSV)
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate PDF Report
                </Button>
                <Button variant="outline" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bulk Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Import Students
                </Button>
                <Button variant="outline" className="w-full">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Approve All Pending
                </Button>
                <Button variant="outline" className="w-full">
                  <Megaphone className="h-4 w-4 mr-2" />
                  Send Bulk Notification
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Database Size:</span>
                  <span>{allStudents.length} records</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Backup:</span>
                  <span>Never</span>
                </div>
                <div className="flex justify-between">
                  <span>System Status:</span>
                  <Badge variant="default">Online</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Student Edit Dialog */}
      {editingStudent && (
        <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Student: {editingStudent.name || `${editingStudent.firstName || ''} ${editingStudent.lastName || ''}`.trim()}</DialogTitle>
              <DialogDescription>
                Complete administrative access to edit all biodata fields
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="academic">Academic Info</TabsTrigger>
                <TabsTrigger value="additional">Additional Info</TabsTrigger>
                <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={editingStudent.firstName || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={editingStudent.lastName || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, lastName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Middle Name</Label>
                    <Input
                      value={editingStudent.middleName || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, middleName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      value={editingStudent.email || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      value={editingStudent.phone || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={editingStudent.dateOfBirth || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, dateOfBirth: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select 
                      value={editingStudent.gender || ""} 
                      onValueChange={(value) => setEditingStudent({...editingStudent, gender: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <Input
                      value={editingStudent.nationality || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, nationality: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>State of Origin</Label>
                    <Input
                      value={editingStudent.stateOfOrigin || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, stateOfOrigin: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Local Government Area (LGA)</Label>
                    <Input
                      value={editingStudent.lga || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, lga: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label>Residential Address</Label>
                  <Textarea
                    value={editingStudent.address || ""}
                    onChange={(e) => setEditingStudent({...editingStudent, address: e.target.value})}
                    className="min-h-[60px]"
                  />
                </div>
              </TabsContent>

              <TabsContent value="academic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Student ID/Matric Number</Label>
                    <Input
                      value={editingStudent.studentId || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, studentId: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Level</Label>
                    <Select 
                      value={editingStudent.level || ""} 
                      onValueChange={(value) => setEditingStudent({...editingStudent, level: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 Level</SelectItem>
                        <SelectItem value="200">200 Level</SelectItem>
                        <SelectItem value="300">300 Level</SelectItem>
                        <SelectItem value="400">400 Level</SelectItem>
                        <SelectItem value="500">500 Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Entry Year</Label>
                    <Input
                      type="number"
                      value={editingStudent.entryYear || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, entryYear: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Expected Graduation Year</Label>
                    <Input
                      type="number"
                      value={editingStudent.expectedGraduation || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, expectedGraduation: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label>Completion Status</Label>
                  <Select 
                    value={editingStudent.completionStatus || "incomplete"} 
                    onValueChange={(value) => setEditingStudent({...editingStudent, completionStatus: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="incomplete">Incomplete</SelectItem>
                      <SelectItem value="former">Former Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Skills (comma-separated)</Label>
                  <Textarea
                    value={editingStudent.skills?.join(", ") || ""}
                    onChange={(e) => {
                      const skillsArray = e.target.value.split(",").map(s => s.trim()).filter(s => s)
                      setEditingStudent({...editingStudent, skills: skillsArray})
                    }}
                    placeholder="JavaScript, Python, React, etc."
                    className="min-h-[60px]"
                  />
                </div>
              </TabsContent>

              <TabsContent value="additional" className="space-y-4">
                <div>
                  <Label>Personality Type</Label>
                  <Select 
                    value={editingStudent.personalityType || ""} 
                    onValueChange={(value) => setEditingStudent({...editingStudent, personalityType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select personality type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="logical">Logical</SelectItem>
                      <SelectItem value="leader">Leader</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="adventurous">Adventurous</SelectItem>
                      <SelectItem value="harmonious">Harmonious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Hobbies & Interests</Label>
                  <Textarea
                    value={editingStudent.hobbies || ""}
                    onChange={(e) => setEditingStudent({...editingStudent, hobbies: e.target.value})}
                    placeholder="Reading, gaming, sports, music, etc."
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label>Goals & Aspirations</Label>
                  <Textarea
                    value={editingStudent.goals || ""}
                    onChange={(e) => setEditingStudent({...editingStudent, goals: e.target.value})}
                    placeholder="Career goals, life aspirations, etc."
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label>Bio/About</Label>
                  <Textarea
                    value={editingStudent.bio || ""}
                    onChange={(e) => setEditingStudent({...editingStudent, bio: e.target.value})}
                    placeholder="Personal bio or description"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Approval Status</Label>
                    <Select 
                      value={editingStudent.approved ? "true" : "false"} 
                      onValueChange={(value) => setEditingStudent({...editingStudent, approved: value === "true"})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Approved</SelectItem>
                        <SelectItem value="false">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input
                      value={editingStudent.department || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, department: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="emergency" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Emergency Contact Name</Label>
                    <Input
                      value={editingStudent.emergencyName || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, emergencyName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Emergency Contact Phone</Label>
                    <Input
                      value={editingStudent.emergencyPhone || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, emergencyPhone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label>Relationship to Emergency Contact</Label>
                  <Input
                    value={editingStudent.emergencyRelationship || ""}
                    onChange={(e) => setEditingStudent({...editingStudent, emergencyRelationship: e.target.value})}
                    placeholder="Parent, Sibling, Guardian, etc."
                  />
                </div>

                <div className="border-t pt-4 mt-6">
                  <h4 className="text-sm font-medium mb-3">Legacy Fields (for compatibility)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Guardian Name</Label>
                      <Input
                        value={editingStudent.guardianName || ""}
                        onChange={(e) => setEditingStudent({...editingStudent, guardianName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Guardian Phone</Label>
                      <Input
                        value={editingStudent.guardianPhone || ""}
                        onChange={(e) => setEditingStudent({...editingStudent, guardianPhone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Next of Kin</Label>
                      <Input
                        value={editingStudent.nextOfKin || ""}
                        onChange={(e) => setEditingStudent({...editingStudent, nextOfKin: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Next of Kin Phone</Label>
                      <Input
                        value={editingStudent.nextOfKinPhone || ""}
                        onChange={(e) => setEditingStudent({...editingStudent, nextOfKinPhone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Last modified: {editingStudent.submittedAt ? new Date(editingStudent.submittedAt).toLocaleDateString() : 'Never'}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditingStudent(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleStudentUpdate}
                  className="bg-gradient-primary"
                >
                  Save All Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Admin Management Dialog */}
      {showAdminManagement && (
        <Dialog open={showAdminManagement} onOpenChange={setShowAdminManagement}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Admin Management</DialogTitle>
              <DialogDescription>
                Manage administrator accounts and permissions
              </DialogDescription>
            </DialogHeader>
            <AdminManagement />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}