import React, { useState } from "react"
import { QrCode, Phone, Mail, MapPin, Trophy, Code, ExternalLink, Share2, Languages, User } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateStudentQR, generateVCardQR } from "@/utils/qrGenerator"
import { getPersonalityFromSkills } from "@/utils/personalityColors"
import { generateAvatarFromInitials } from "@/utils/avatarGenerator"
import { translateStudentData, languageNames, type Language } from "@/utils/translation"

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

interface StudentCardProps {
  student: Student
  className?: string
}

export function StudentCard({ student, className }: StudentCardProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [vCardQR, setVCardQR] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en')
  
  const translatedStudent = translateStudentData(student, selectedLanguage)
  
  const personality = getPersonalityFromSkills(student.skills)
  
  // Calculate profile completion
  const calculateCompletion = () => {
    const fields = [
      student.name,
      student.email,
      student.phone,
      student.cgpa,
      student.profileImage,
      student.skills.length > 0,
      student.hobbies?.length,
      student.goals?.length,
      student.address
    ]
    const filledFields = fields.filter(field => field && field !== 0).length
    return Math.round((filledFields / fields.length) * 100)
  }
  
  const completion = calculateCompletion()
  
  const generateQRCodes = async () => {
    try {
      const studentData = {
        name: student.name,
        studentId: student.studentId,
        level: student.level,
        email: student.email,
        phone: student.phone,
        cgpa: student.cgpa,
        skills: student.skills
      }
      
      const [dataQR, contactQR] = await Promise.all([
        generateStudentQR(studentData),
        generateVCardQR(studentData)
      ])
      
      setQrCode(dataQR)
      setVCardQR(contactQR)
      setShowQR(true)
    } catch (error) {
      console.error('Failed to generate QR codes:', error)
    }
  }
  
  const getCompletionBadge = () => {
    if (completion === 100) return { text: "Gold Profile", color: "bg-yellow-500" }
    if (completion >= 80) return { text: "Silver Profile", color: "bg-gray-400" }
    if (completion >= 60) return { text: "Bronze Profile", color: "bg-orange-600" }
    return { text: "Basic Profile", color: "bg-gray-500" }
  }
  
  const badge = getCompletionBadge()

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${className}`}
      style={{
        background: personality.gradient,
        borderColor: personality.color
      }}
    >
      {/* Personality overlay */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      
      <CardHeader className="relative pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16 border-2" style={{ borderColor: personality.color }}>
              <AvatarImage 
                src={student.profileImage || generateAvatarFromInitials(student.name)} 
                alt={student.name}
              />
              <AvatarFallback className="text-lg font-semibold">
                {student.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg leading-tight">{student.name}</h3>
              <p className="text-sm text-muted-foreground">{student.studentId}</p>
              <Badge variant="outline" className="mt-1">
                Level {student.level}
              </Badge>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={generateQRCodes}
            className="h-8 w-8 p-0"
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Language Selector */}
        <div className="mt-2 flex items-center gap-2">
          <Languages className="h-3 w-3 text-muted-foreground" />
          <Select value={selectedLanguage} onValueChange={(value: Language) => setSelectedLanguage(value)}>
            <SelectTrigger className="h-6 text-xs border-none p-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(languageNames).map(([code, name]) => (
                <SelectItem key={code} value={code}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Profile Completion */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {translatedStudent._translations?.profileCompletionLabel || 'Profile Completion'}
            </span>
            <Badge className={`${badge.color} text-white text-xs`}>
              {badge.text}
            </Badge>
          </div>
          <Progress value={completion} className="h-2" />
          <span className="text-xs text-muted-foreground">{completion}%</span>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-3 pt-0">
        {/* Contact Info */}
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="truncate">{student.email}</span>
          </div>
          {student.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span>{student.phone}</span>
            </div>
          )}
          {student.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="truncate">{student.address}</span>
            </div>
          )}
        </div>
        
        {/* CGPA */}
        {student.cgpa && (
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">CGPA: {student.cgpa.toFixed(2)}</span>
          </div>
        )}
        
        {/* Skills */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Skills</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {student.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {student.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{student.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        
        {/* Personality Type */}
        <div className="flex items-center justify-between">
          <Badge 
            style={{ backgroundColor: personality.color, color: 'white' }}
            className="text-xs"
          >
            {personality.type}
          </Badge>
          <Badge variant={student.status === "Active" ? "default" : "secondary"}>
            {student.status}
          </Badge>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <ExternalLink className="h-3 w-3 mr-1" />
                View Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Student Profile - {student.name}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage src={student.profileImage} />
                      <AvatarFallback className="text-2xl">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">{student.name}</h3>
                    <p className="text-muted-foreground">{student.studentId}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Contact Information</h4>
                    <div className="text-sm space-y-1">
                      <p><Mail className="inline h-3 w-3 mr-2" />{student.email}</p>
                      {student.phone && <p><Phone className="inline h-3 w-3 mr-2" />{student.phone}</p>}
                      {student.address && <p><MapPin className="inline h-3 w-3 mr-2" />{student.address}</p>}
                    </div>
                  </div>
                  
                  {student.hobbies?.length && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Hobbies</h4>
                      <div className="flex flex-wrap gap-1">
                        {student.hobbies.map((hobby, index) => (
                          <Badge key={index} variant="outline">{hobby}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {student.goals?.length && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Goals</h4>
                      <div className="space-y-1">
                        {student.goals.map((goal, index) => (
                          <p key={index} className="text-sm">• {goal}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Academic Information</h4>
                    <div className="space-y-1 text-sm">
                      <p>Level: {student.level}</p>
                      {student.cgpa && <p>CGPA: {student.cgpa.toFixed(2)}</p>}
                      <p>Status: {student.status}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {student.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Personality Profile</h4>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: `${personality.color}20` }}>
                      <Badge style={{ backgroundColor: personality.color, color: 'white' }}>
                        {personality.type}
                      </Badge>
                      <p className="text-sm mt-2">{personality.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Profile Completion</h4>
                    <Progress value={completion} className="h-3" />
                    <div className="flex justify-between">
                      <span className="text-sm">{completion}% Complete</span>
                      <Badge className={`${badge.color} text-white`}>
                        {badge.text}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="ghost" size="sm" onClick={generateQRCodes}>
            <Share2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
      
      {/* QR Code Dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Codes for {student.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {qrCode && (
              <div className="text-center space-y-2">
                <h4 className="font-medium">Student Info</h4>
                <img src={qrCode} alt="Student QR Code" className="mx-auto" />
                <p className="text-xs text-muted-foreground">Scan for student details</p>
              </div>
            )}
            {vCardQR && (
              <div className="text-center space-y-2">
                <h4 className="font-medium">Contact Card</h4>
                <img src={vCardQR} alt="Contact QR Code" className="mx-auto" />
                <p className="text-xs text-muted-foreground">Scan to save contact</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}