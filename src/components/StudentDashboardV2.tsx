import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useStudentAuth } from "@/hooks/useStudentAuth"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Edit,
  Calendar,
  Clock,
  Star,
  Save,
  MessageCircle,
  HelpCircle,
  CheckCircle,
  AlertCircle
} from "lucide-react"

export const StudentDashboardV2 = () => {
  const { currentStudent, updateProfile } = useStudentAuth()
  const { toast } = useToast()
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<any>({})
  const [questionsDialogOpen, setQuestionsDialogOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState("")

  useEffect(() => {
    if (currentStudent) {
      // Calculate profile completion percentage
      const fields = [
        currentStudent.name,
        currentStudent.email,
        currentStudent.phone,
        currentStudent.address,
        currentStudent.bio,
        currentStudent.skills?.length,
        currentStudent.gender,
        currentStudent.stateOfOrigin,
        currentStudent.dateOfBirth,
        currentStudent.guardianName,
        currentStudent.guardianPhone,
        currentStudent.nextOfKin,
        currentStudent.emergencyContact
      ]
      
      const completedFields = fields.filter(field => 
        field !== undefined && field !== null && field !== ""
      ).length
      
      const completion = Math.round((completedFields / fields.length) * 100)
      setProfileCompletion(completion)
      setEditData(currentStudent)
    }
  }, [currentStudent])

  if (!currentStudent) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="text-center py-12">
          <CardContent>
            <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Please Login</h2>
            <p className="text-muted-foreground">
              You need to be logged in to view your dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSave = () => {
    updateProfile(editData)
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your biodata has been successfully updated.",
    })
  }

  const handleQuestionSubmit = () => {
    if (!newQuestion.trim()) return
    
    // Save question to localStorage for admin to see
    const questions = JSON.parse(localStorage.getItem('student_questions') || '[]')
    const question = {
      id: Date.now().toString(),
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      question: newQuestion,
      timestamp: new Date().toISOString(),
      status: 'pending',
      response: null
    }
    questions.push(question)
    localStorage.setItem('student_questions', JSON.stringify(questions))
    
    setNewQuestion("")
    setQuestionsDialogOpen(false)
    toast({
      title: "Question Submitted",
      description: "Your question has been sent to the admin. You'll receive a response soon.",
    })
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Student Profile
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {currentStudent.name}!
        </p>
      </div>

      {/* Profile Overview */}
      <Card className="card-academic animate-slide-up">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={currentStudent.profilePicture} />
                <AvatarFallback className="text-lg">
                  {currentStudent.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{currentStudent.name}</CardTitle>
                <CardDescription className="text-base">
                  {currentStudent.studentId} • Level {currentStudent.level}
                </CardDescription>
                <div className="flex gap-2 mt-2">
                  <Badge variant={currentStudent.approved ? "default" : "secondary"}>
                    {currentStudent.approved ? "Active" : "Pending"}
                  </Badge>
                  <Badge variant="outline">
                    CS Department
                  </Badge>
                  <Badge variant={currentStudent.completionStatus === "completed" ? "default" : "secondary"}>
                    {currentStudent.completionStatus === "completed" ? "Complete" : "Incomplete"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsEditing(!isEditing)} className="btn-university">
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
              {isEditing && (
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-sm text-muted-foreground">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2" />
            </div>
            <Separator />
            
            {/* Editable Fields */}
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editData.name || ""}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={editData.email || ""}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={editData.phone || ""}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={editData.gender || ""} onValueChange={(value) => setEditData({...editData, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stateOfOrigin">State of Origin</Label>
                  <Input
                    id="stateOfOrigin"
                    value={editData.stateOfOrigin || ""}
                    onChange={(e) => setEditData({...editData, stateOfOrigin: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lga">Local Government Area</Label>
                  <Input
                    id="lga"
                    value={editData.lga || ""}
                    onChange={(e) => setEditData({...editData, lga: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={editData.dateOfBirth || ""}
                    onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select value={editData.bloodGroup || ""} onValueChange={(value) => setEditData({...editData, bloodGroup: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={editData.address || ""}
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editData.bio || ""}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardianName">Guardian Name</Label>
                  <Input
                    id="guardianName"
                    value={editData.guardianName || ""}
                    onChange={(e) => setEditData({...editData, guardianName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardianPhone">Guardian Phone</Label>
                  <Input
                    id="guardianPhone"
                    value={editData.guardianPhone || ""}
                    onChange={(e) => setEditData({...editData, guardianPhone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={editData.emergencyContact || ""}
                    onChange={(e) => setEditData({...editData, emergencyContact: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyContactPhone"
                    value={editData.emergencyContactPhone || ""}
                    onChange={(e) => setEditData({...editData, emergencyContactPhone: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{currentStudent.email}</span>
                </div>
                {currentStudent.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{currentStudent.phone}</span>
                  </div>
                )}
                {currentStudent.lga && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{currentStudent.lga}, {currentStudent.stateOfOrigin}</span>
                  </div>
                )}
                {currentStudent.gender && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm capitalize">{currentStudent.gender}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-academic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Academic Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Student ID:</span>
                <span className="text-sm">{currentStudent.studentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Current Level:</span>
                <span className="text-sm">{currentStudent.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Department:</span>
                <span className="text-sm">Computer Science</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Faculty:</span>
                <span className="text-sm">Natural Sciences</span>
              </div>
              {currentStudent.entryYear && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Entry Year:</span>
                  <span className="text-sm">{currentStudent.entryYear}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-academic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Skills & Interests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStudent.skills && currentStudent.skills.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentStudent.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                {currentStudent.hobbies && currentStudent.hobbies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Hobbies</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentStudent.hobbies.map((hobby, index) => (
                        <Badge key={index} variant="outline">
                          {hobby}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No skills added yet. Update your profile to add skills.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bio and Goals */}
      {currentStudent.bio && (
        <Card className="card-academic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              About Me
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{currentStudent.bio}</p>
          </CardContent>
        </Card>
      )}

      {currentStudent.goals && (
        <Card className="card-academic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              My Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{currentStudent.goals}</p>
          </CardContent>
        </Card>
      )}

      {/* Account Status & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-academic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Account Status:</span>
                <Badge variant={currentStudent.approved ? "default" : "secondary"}>
                  {currentStudent.approved ? "Active" : "Pending Review"}
                </Badge>
              </div>
              {currentStudent.submittedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Registered:</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(currentStudent.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm">Profile Completion:</span>
                <Badge variant="outline">
                  {profileCompletion}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-academic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Have questions or need assistance? Send a message to the admin.
            </p>
            <Dialog open={questionsDialogOpen} onOpenChange={setQuestionsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Submit Question
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit a Question</DialogTitle>
                  <DialogDescription>
                    Ask the admin any questions about your biodata, academic records, or general inquiries.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Type your question here..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setQuestionsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleQuestionSubmit}>
                      Submit Question
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}