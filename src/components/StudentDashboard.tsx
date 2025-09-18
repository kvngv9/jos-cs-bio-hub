import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useStudentAuth } from "@/hooks/useStudentAuth"
import { useToast } from "@/hooks/use-toast"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Trophy, 
  Edit,
  Calendar,
  Clock,
  Star
} from "lucide-react"

export const StudentDashboard = () => {
  const { currentStudent } = useStudentAuth()
  const { toast } = useToast()
  const [profileCompletion, setProfileCompletion] = useState(0)

  useEffect(() => {
    if (currentStudent) {
      // Calculate profile completion percentage
      const fields = [
        currentStudent.name,
        currentStudent.email,
        currentStudent.phone,
        currentStudent.address,
        currentStudent.cgpa,
        currentStudent.bio,
        currentStudent.skills?.length,
        currentStudent.profilePicture
      ]
      
      const completedFields = fields.filter(field => 
        field !== undefined && field !== null && field !== ""
      ).length
      
      const completion = Math.round((completedFields / fields.length) * 100)
      setProfileCompletion(completion)
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

  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "Profile editing feature coming soon!",
    })
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Student Dashboard
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
                </div>
              </div>
            </div>
            <Button onClick={handleEditProfile} className="btn-university">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
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
                  <span className="text-sm">{currentStudent.lga}</span>
                </div>
              )}
              {currentStudent.cgpa && (
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">CGPA: {currentStudent.cgpa}</span>
                </div>
              )}
            </div>
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
              {currentStudent.entryYear && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Entry Year:</span>
                  <span className="text-sm">{currentStudent.entryYear}</span>
                </div>
              )}
              {currentStudent.cgpa && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">CGPA:</span>
                  <Badge variant="outline" className="text-primary border-primary">
                    {currentStudent.cgpa}
                  </Badge>
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

      {/* Bio Section */}
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

      {/* Goals Section */}
      {currentStudent.goals && (
        <Card className="card-academic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              My Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{currentStudent.goals}</p>
          </CardContent>
        </Card>
      )}

      {/* Account Status */}
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
    </div>
  )
}