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
import { AdminManagement } from "./AdminManagement"
import { useStudentData } from "@/hooks/useStudentData"

export const AdminPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAdminDialog, setShowAdminDialog] = useState(false)
  const [editingStudent, setEditingStudent] = useState<any>(null)
  const { isAdmin } = useAdmin()
  const { allStudents, updateStudent, deleteStudent, approveStudent } = useStudentAuth()
  const { students: sampleData } = useStudentData()
  
  // Merge real student data with sample data for demonstration
  const allStudentsWithSamples = [...allStudents, ...sampleData.filter(s => !allStudents.find(existing => existing.id === s.id))]
  const { toast } = useToast()

  const handleAdminAccess = () => {
    setShowAdminDialog(true)
  }

  const handleAdminSuccess = () => {
    setIsOpen(true)
  }

  const handleApprove = (studentId: string) => {
    updateStudent(studentId, { completionStatus: "completed" })
    toast({
      title: "Student Approved",
      description: "Student profile has been marked as completed.",
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

  const completedStudents = allStudentsWithSamples.filter(s => s.completionStatus === "completed")
  const incompleteStudents = allStudentsWithSamples.filter(s => s.completionStatus === "incomplete") 
  const formerStudents = allStudentsWithSamples.filter(s => s.completionStatus === "former")

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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Settings className="h-5 w-5 text-primary" />
              Admin Panel - Student Management
            </DialogTitle>
            <DialogDescription className="text-sm">
              Manage student profiles, approve new registrations, and oversee the system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">System Management</h3>
            </div>
            <AdminManagement />
          </div>

          <Tabs defaultValue="completed" className="w-full">
            <TabsList className="grid w-full grid-cols-4 text-xs sm:text-sm">
              <TabsTrigger value="completed" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Completed</span>
                <span className="sm:hidden">({completedStudents.length})</span>
                <span className="hidden sm:inline">({completedStudents.length})</span>
              </TabsTrigger>
              <TabsTrigger value="incomplete" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Incomplete</span>
                <span className="sm:hidden">({incompleteStudents.length})</span>
                <span className="hidden sm:inline">({incompleteStudents.length})</span>
              </TabsTrigger>
              <TabsTrigger value="former" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Former</span>
                <span className="sm:hidden">({formerStudents.length})</span>
                <span className="hidden sm:inline">({formerStudents.length})</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Statistics</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="completed" className="space-y-4">
              <div className="grid gap-4">
                {completedStudents.map((student) => (
                  <Card key={student.id} className="border-success/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={student.profilePicture} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base md:text-lg">{student.name}</CardTitle>
                            <CardDescription className="text-xs md:text-sm">{student.email} | {student.studentId}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-success text-success text-xs">
                          Completed
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-4 text-sm">
                        <div><strong>Level:</strong> {student.level}</div>
                        <div><strong>Phone:</strong> {student.phone || 'N/A'}</div>
                        <div><strong>LGA:</strong> {student.lga || 'N/A'}</div>
                        <div><strong>Completion:</strong> {student.completionStatus}</div>
                        <div><strong>Entry Year:</strong> {student.entryYear || 'N/A'}</div>
                        <div><strong>Status:</strong> {student.approved ? 'Active' : 'Pending'}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
                          <Edit className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(student.id)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {completedStudents.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No completed biodata entries found.
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="incomplete" className="space-y-4">
              <div className="grid gap-4">
                {incompleteStudents.map((student) => (
                  <Card key={student.id} className="border-warning/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={student.profilePicture} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base md:text-lg">{student.name}</CardTitle>
                            <CardDescription className="text-xs md:text-sm">{student.email} | {student.studentId}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-warning text-warning text-xs">
                          Incomplete
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-4 text-sm">
                        <div><strong>Level:</strong> {student.level}</div>
                        <div><strong>Phone:</strong> {student.phone || 'Missing'}</div>
                        <div><strong>LGA:</strong> {student.lga || 'Missing'}</div>
                        <div><strong>CGPA:</strong> {student.cgpa || 'Missing'}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => handleApprove(student.id)} className="btn-university">
                          <UserCheck className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Mark Complete</span>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
                          <Edit className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {incompleteStudents.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No incomplete biodata entries found.
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="former" className="space-y-4">
              <div className="grid gap-4">
                {formerStudents.map((student) => (
                  <Card key={student.id} className="border-muted/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={student.profilePicture} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base md:text-lg">{student.name}</CardTitle>
                            <CardDescription className="text-xs md:text-sm">{student.email} | {student.studentId}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-muted text-muted-foreground text-xs">
                          Former
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-4 text-sm">
                        <div><strong>Level:</strong> {student.level}</div>
                        <div><strong>Final CGPA:</strong> {student.cgpa || 'N/A'}</div>
                        <div><strong>Entry Year:</strong> {student.entryYear || 'N/A'}</div>
                        <div><strong>Status:</strong> Alumni</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
                          <Edit className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">View Details</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {formerStudents.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No former students found.
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
                    <div className="text-2xl font-bold">{allStudentsWithSamples.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">{completedStudents.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Incomplete</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-warning">{incompleteStudents.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Former Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-info">{formerStudents.length}</div>
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