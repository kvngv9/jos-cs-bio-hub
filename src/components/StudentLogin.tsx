import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, LogIn, LogOut, Edit } from "lucide-react"
import { useStudentAuth } from "@/hooks/useStudentAuth"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ForgotPassword } from "@/components/ForgotPassword"

export const StudentLogin = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { currentStudent, login, logout } = useStudentAuth()
  const { toast } = useToast()

  const handleLogin = async () => {
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const success = login(email, password)
    
    if (success) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${currentStudent?.name}! You can now update your profile.`,
      })
      setIsOpen(false)
      setEmail("")
      setPassword("")
    } else {
      toast({
        title: "Login Failed", 
        description: "Invalid email/password. Make sure you have submitted your biodata first.",
        variant: "destructive",
      })
    }
    
    setIsLoading(false)
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
  }

  if (currentStudent) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Welcome, {currentStudent.name}
          </CardTitle>
          <CardDescription>
            Email: {currentStudent.email} | Level: {currentStudent.level}
            {currentStudent.approved && (
              <Badge variant="outline" className="ml-2 border-success text-success">
                Active
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="btn-academic">
          <LogIn className="mr-2 h-4 w-4" />
          Student Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Student Login
          </DialogTitle>
          <DialogDescription>
            Login to update your profile and access student features.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="student-email">Email Address</Label>
            <Input
              id="student-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="student-password">Password</Label>
            <Input
              id="student-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <div className="flex justify-center">
              <Button 
                variant="link" 
                size="sm"
                onClick={() => setShowForgotPassword(true)}
                className="text-primary hover:text-primary/80"
              >
                Forgot Password?
              </Button>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button 
                onClick={handleLogin} 
                disabled={!email || !password || isLoading}
                className="btn-university"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
      
      <ForgotPassword 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        userType="student"
      />
    </Dialog>
  )
}