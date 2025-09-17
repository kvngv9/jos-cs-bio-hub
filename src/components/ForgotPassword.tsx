import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ForgotPasswordProps {
  isOpen: boolean
  onClose: () => void
  userType: "student" | "admin"
}

export const ForgotPassword = ({ isOpen, onClose, userType }: ForgotPasswordProps) => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"email" | "success">("email")
  const { toast } = useToast()

  const handleSendReset = async () => {
    if (!email) return
    
    setIsLoading(true)
    
    // Simulate sending email
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Store reset request in localStorage
    const resetRequests = JSON.parse(localStorage.getItem('password_resets') || '[]')
    const resetToken = Math.random().toString(36).substring(2, 15)
    
    resetRequests.push({
      email,
      token: resetToken,
      userType,
      timestamp: Date.now(),
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    })
    
    localStorage.setItem('password_resets', JSON.stringify(resetRequests))
    
    toast({
      title: "Reset Link Sent",
      description: `A password reset link has been sent to ${email}`,
    })
    
    setStep("success")
    setIsLoading(false)
  }

  const handleClose = () => {
    setStep("email")
    setEmail("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Forgot Password
          </DialogTitle>
          <DialogDescription>
            {step === "email" 
              ? `Enter your email address and we'll send you a link to reset your ${userType} password.`
              : "Check your email for the reset link."
            }
          </DialogDescription>
        </DialogHeader>
        
        {step === "email" ? (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendReset} 
                disabled={!email || isLoading}
                className="btn-university"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-success" />
              </div>
              <p className="text-sm text-muted-foreground">
                If an account with that email exists, you'll receive a password reset link shortly.
              </p>
            </div>
            <div className="flex justify-center">
              <Button onClick={handleClose} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}