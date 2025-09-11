import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, UserCheck, UserX, Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react"
import { useAdmin } from "@/hooks/useAdmin"
import { useStudentAuth } from "@/hooks/useStudentAuth"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { AdminDialog } from "./AdminDialog"

export const AdminPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAdminDialog, setShowAdminDialog] = useState(false)
  const [editingStudent, setEditingStudent] = useState<any>(null)
  const { isAdmin } = useAdmin()
  const { allStudents, updateStudent, deleteStudent, approveStudent } = useStudentAuth()
  const { toast } = useToast()

  const handleAdminAccess = () => {
    setShowAdminDialog(true)
  }

  const handleAdminSuccess = () => {
    setIsOpen(true)
  }

  const handleApprove = (studentId: string) => {
    approveStudent(studentId)
    toast({
      title: "Student Approved",
      description: "Student profile has been approved successfully.",
    })
  }

  const handleDelete = (studentId: string) => {
    deleteStudent(studentId)
    toast({
      title: "Student Deleted",
      description: "Student profile has been deleted.",
      variant: "destructive",
    })
  }

  const handleEdit = (student: any) => {
    setEditingStudent(student)
  }

  const handleSaveEdit = () => {
    if (editingStudent) {
      updateStudent(editingStudent.id, editingStudent)
      setEditingStudent(null)
      toast({
        title: "Profile Updated",
        description: "Student profile has been updated successfully.",
      })
    }
  }

  const pendingStudents = allStudents.filter(s => !s.approved)
  const approvedStudents = allStudents.filter(s => s.approved)

  if (!isAdmin) {
    return (
      <>
        <Button variant="outline" onClick={handleAdminAccess} className="btn-academic">
          <Settings className="mr-2 h-4 w-4" />
          Admin Panel
        </Button>
        <AdminDialog
          isOpen={showAdminDialog}
          onClose={() => setShowAdminDialog(false)}
          onSuccess={handleAdminSuccess}
          feature="Admin Panel"
        />
      </>
    )
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="btn-academic">
            <Settings className="mr-2 h-4 w-4" />
            Admin Panel
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Admin Panel - Student Management
            </DialogTitle>
            <DialogDescription>
              Manage student profiles, approve new registrations, and oversee the system.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Pending ({pendingStudents.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Approved ({approvedStudents.length})
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Statistics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="space-y-4">
              <div className="grid gap-4">
                {pendingStudents.map((student) => (
                  <Card key={student.id} className="border-warning/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={student.profilePicture} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{student.name}</CardTitle>
                            <CardDescription>{student.email} | {student.studentId}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-warning text-warning">
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <strong>Level:</strong> {student.level}
                        </div>
                        <div>
                          <strong>Phone:</strong> {student.phone || 'N/A'}
                        </div>
                        <div>
                          <strong>LGA:</strong> {student.lga || 'N/A'}
                        </div>
                        <div>
                          <strong>CGPA:</strong> {student.cgpa || 'N/A'}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(student.id)}
                          className="btn-university"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(student)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(student.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {pendingStudents.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No pending students to review.
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="approved" className="space-y-4">
              <div className="grid gap-4">
                {approvedStudents.map((student) => (
                  <Card key={student.id} className="border-success/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={student.profilePicture} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{student.name}</CardTitle>
                            <CardDescription>{student.email} | {student.studentId}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-success text-success">
                          Approved
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <strong>Level:</strong> {student.level}
                        </div>
                        <div>
                          <strong>Phone:</strong> {student.phone || 'N/A'}
                        </div>
                        <div>
                          <strong>LGA:</strong> {student.lga || 'N/A'}
                        </div>
                        <div>
                          <strong>CGPA:</strong> {student.cgpa || 'N/A'}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(student)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(student.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {approvedStudents.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No approved students yet.
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="stats">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{allStudents.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">{approvedStudents.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-warning">{pendingStudents.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-info">
                      {allStudents.length > 0 ? Math.round((approvedStudents.length / allStudents.length) * 100) : 0}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      {editingStudent && (
        <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Student Profile</DialogTitle>
              <DialogDescription>
                Make changes to the student's profile information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-student-id">Student ID</Label>
                  <Input
                    id="edit-student-id"
                    value={editingStudent.studentId}
                    onChange={(e) => setEditingStudent({...editingStudent, studentId: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-level">Level</Label>
                  <Input
                    id="edit-level"
                    value={editingStudent.level}
                    onChange={(e) => setEditingStudent({...editingStudent, level: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editingStudent.phone || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-cgpa">CGPA</Label>
                  <Input
                    id="edit-cgpa"
                    type="number"
                    step="0.01"
                    value={editingStudent.cgpa || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, cgpa: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-bio">Bio</Label>
                <Textarea
                  id="edit-bio"
                  value={editingStudent.bio || ''}
                  onChange={(e) => setEditingStudent({...editingStudent, bio: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingStudent(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} className="btn-university">
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}