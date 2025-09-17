import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Trash2, Edit, Mail, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ForgotPassword } from "@/components/ForgotPassword"

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export const AdminManagement = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "Admin"
  })
  const { toast } = useToast()

  useEffect(() => {
    // Load admin users from localStorage
    const saved = localStorage.getItem('admin_users')
    if (saved) {
      setAdminUsers(JSON.parse(saved))
    } else {
      // Create default admin
      const defaultAdmin: AdminUser = {
        id: "default-admin",
        name: "Super Admin",
        email: "admin@unijos.edu.ng",
        role: "Super Admin",
        createdAt: new Date().toISOString()
      }
      setAdminUsers([defaultAdmin])
      localStorage.setItem('admin_users', JSON.stringify([defaultAdmin]))
    }
  }, [])

  const handleCreateAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    // Check if email already exists
    if (adminUsers.some(admin => admin.email === newAdmin.email)) {
      toast({
        title: "Error",
        description: "An admin with this email already exists",
        variant: "destructive"
      })
      return
    }

    const admin: AdminUser = {
      id: Date.now().toString(),
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      createdAt: new Date().toISOString()
    }

    const updatedAdmins = [...adminUsers, admin]
    setAdminUsers(updatedAdmins)
    localStorage.setItem('admin_users', JSON.stringify(updatedAdmins))

    toast({
      title: "Admin Created",
      description: `${admin.name} has been added as an admin`
    })

    setNewAdmin({ name: "", email: "", role: "Admin" })
    setShowCreateDialog(false)
  }

  const handleDeleteAdmin = (id: string) => {
    if (id === "default-admin") {
      toast({
        title: "Error",
        description: "Cannot delete the default super admin",
        variant: "destructive"
      })
      return
    }

    const updatedAdmins = adminUsers.filter(admin => admin.id !== id)
    setAdminUsers(updatedAdmins)
    localStorage.setItem('admin_users', JSON.stringify(updatedAdmins))

    toast({
      title: "Admin Deleted",
      description: "Admin user has been removed"
    })
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="btn-academic">
            <Shield className="mr-2 h-4 w-4" />
            Admin Management
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Admin User Management
            </DialogTitle>
            <DialogDescription>
              Manage administrative users and their access permissions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Current Administrators</h3>
              <Button onClick={() => setShowCreateDialog(true)} size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Admin
              </Button>
            </div>

            <div className="space-y-3">
              {adminUsers.map((admin) => (
                <Card key={admin.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{admin.name}</h4>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {admin.role}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {admin.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(admin.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {admin.id !== "default-admin" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div className="pt-4 border-t">
              <Button 
                variant="link" 
                onClick={() => setShowForgotPassword(true)}
                className="text-primary hover:text-primary/80"
              >
                Reset Admin Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Admin Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Administrator</DialogTitle>
            <DialogDescription>
              Create a new admin user account with access to the system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Full Name</Label>
              <Input
                id="admin-name"
                placeholder="Enter admin's full name"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email Address</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="Enter admin's email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin-role">Role</Label>
              <Input
                id="admin-role"
                placeholder="Admin role"
                value={newAdmin.role}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, role: e.target.value }))}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAdmin}>
                Create Admin
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ForgotPassword 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        userType="admin"
      />
    </>
  )
}