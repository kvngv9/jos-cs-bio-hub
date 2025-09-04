import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock } from "lucide-react"
import { useAdmin } from "@/hooks/useAdmin"
import { useToast } from "@/hooks/use-toast"

interface AdminDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  feature: string
}

export const AdminDialog = ({ isOpen, onClose, onSuccess, feature }: AdminDialogProps) => {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAdmin()
  const { toast } = useToast()

  const handleLogin = async () => {
    setIsLoading(true)
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const success = login(password)
    
    if (success) {
      toast({
        title: "Admin Access Granted",
        description: `You now have access to ${feature}`,
      })
      onSuccess()
      onClose()
      setPassword("")
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin password. Please try again.",
        variant: "destructive",
      })
    }
    
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && password) {
      handleLogin()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Admin Authentication Required
          </DialogTitle>
          <DialogDescription>
            This feature ({feature}) requires admin privileges. Please enter the admin password to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Admin Password</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="transition-all duration-200"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleLogin} 
              disabled={!password || isLoading}
              className="btn-university"
            >
              {isLoading ? "Authenticating..." : "Authenticate"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}