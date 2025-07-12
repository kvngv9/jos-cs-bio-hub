import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Trophy, 
  Briefcase, 
  Code, 
  Camera,
  Save,
  Plus,
  Trash2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

const biodataSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  middleName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  nationality: z.string().min(2, "Nationality is required"),
  stateOfOrigin: z.string().min(2, "State of origin is required"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  
  // Academic Information
  studentId: z.string().min(1, "Student ID is required"),
  level: z.enum(["100", "200", "300", "400", "500"]),
  cgpa: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 5.0;
  }, "CGPA must be between 0.00 and 5.00"),
  entryYear: z.string().min(4, "Entry year is required"),
  expectedGraduation: z.string().min(4, "Expected graduation year is required"),
  
  // Emergency Contact
  emergencyName: z.string().min(2, "Emergency contact name is required"),
  emergencyPhone: z.string().min(10, "Emergency contact phone is required"),
  emergencyRelationship: z.string().min(2, "Relationship is required"),
})

type BiodataFormData = z.infer<typeof biodataSchema>

interface Skill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

interface Project {
  title: string;
  description: string;
  technologies: string;
  year: string;
}

interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export function BiodataForm() {
  const { toast } = useToast()
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const form = useForm<BiodataFormData>({
    resolver: zodResolver(biodataSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "Male",
      nationality: "Nigerian",
      stateOfOrigin: "",
      address: "",
      studentId: "",
      level: "100",
      cgpa: "",
      entryYear: new Date().getFullYear().toString(),
      expectedGraduation: (new Date().getFullYear() + 4).toString(),
      emergencyName: "",
      emergencyPhone: "",
      emergencyRelationship: "",
    },
  })

  const onSubmit = (data: BiodataFormData) => {
    const completeData = {
      ...data,
      skills,
      projects,
      experiences,
      profileImage,
    }
    
    console.log("Bio-data submitted:", completeData)
    toast({
      title: "Bio-data Saved Successfully!",
      description: "Your profile information has been updated.",
    })
  }

  const addSkill = () => {
    setSkills([...skills, { name: "", level: "Beginner" }])
  }

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    const updatedSkills = [...skills]
    updatedSkills[index] = { ...updatedSkills[index], [field]: value }
    setSkills(updatedSkills)
  }

  const addProject = () => {
    setProjects([...projects, { title: "", description: "", technologies: "", year: "" }])
  }

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index))
  }

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const updatedProjects = [...projects]
    updatedProjects[index] = { ...updatedProjects[index], [field]: value }
    setProjects(updatedProjects)
  }

  const addExperience = () => {
    setExperiences([...experiences, { company: "", role: "", duration: "", description: "" }])
  }

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index))
  }

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updatedExperiences = [...experiences]
    updatedExperiences[index] = { ...updatedExperiences[index], [field]: value }
    setExperiences(updatedExperiences)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="text-center space-y-2 animate-fade-in">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Student Bio-Data Form
        </h1>
        <p className="text-muted-foreground">
          Complete your profile information for the CS Department database
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Picture */}
          <Card className="card-academic animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-gradient-academic border-2 border-primary/20 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-upload"
                  />
                  <label htmlFor="profile-upload">
                    <Button type="button" variant="outline" asChild className="cursor-pointer">
                      <span>Upload Photo</span>
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 400x400px, max 5MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="card-academic animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your basic personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your middle name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your nationality" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stateOfOrigin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State of Origin</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your state of origin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your full address" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="card-academic animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+234 XXX XXX XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="card-academic animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID/Matric Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CS/2020/001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="100">100 Level</SelectItem>
                        <SelectItem value="200">200 Level</SelectItem>
                        <SelectItem value="300">300 Level</SelectItem>
                        <SelectItem value="400">400 Level</SelectItem>
                        <SelectItem value="500">500 Level</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cgpa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current CGPA</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 4.50" 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        max="5.00" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="entryYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of Entry</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2020" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expectedGraduation"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Expected Graduation Year</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2024" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card className="card-academic animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Technical Skills
              </CardTitle>
              <CardDescription>
                Add your programming languages, frameworks, and technical competencies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Input
                      placeholder="e.g., JavaScript, Python, React"
                      value={skill.name}
                      onChange={(e) => updateSkill(index, "name", e.target.value)}
                    />
                  </div>
                  <div className="w-32">
                    <Select
                      value={skill.level}
                      onValueChange={(value) => updateSkill(index, "level", value as Skill["level"])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeSkill(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addSkill} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card className="card-academic animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Projects & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {projects.map((project, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Project {index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeProject(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      placeholder="Project Title"
                      value={project.title}
                      onChange={(e) => updateProject(index, "title", e.target.value)}
                    />
                    <Input
                      placeholder="Year"
                      value={project.year}
                      onChange={(e) => updateProject(index, "year", e.target.value)}
                    />
                  </div>
                  <Input
                    placeholder="Technologies Used (e.g., React, Node.js, MongoDB)"
                    value={project.technologies}
                    onChange={(e) => updateProject(index, "technologies", e.target.value)}
                  />
                  <Textarea
                    placeholder="Project Description"
                    value={project.description}
                    onChange={(e) => updateProject(index, "description", e.target.value)}
                    className="resize-none"
                  />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addProject} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card className="card-academic animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Work Experience & Internships
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {experiences.map((experience, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Experience {index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeExperience(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      placeholder="Company/Organization"
                      value={experience.company}
                      onChange={(e) => updateExperience(index, "company", e.target.value)}
                    />
                    <Input
                      placeholder="Role/Position"
                      value={experience.role}
                      onChange={(e) => updateExperience(index, "role", e.target.value)}
                    />
                  </div>
                  <Input
                    placeholder="Duration (e.g., June 2023 - August 2023)"
                    value={experience.duration}
                    onChange={(e) => updateExperience(index, "duration", e.target.value)}
                  />
                  <Textarea
                    placeholder="Description of responsibilities and achievements"
                    value={experience.description}
                    onChange={(e) => updateExperience(index, "description", e.target.value)}
                    className="resize-none"
                  />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addExperience} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="card-academic animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="emergencyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name of emergency contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+234 XXX XXX XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyRelationship"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Parent, Guardian, Sibling" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button 
              type="submit" 
              size="lg" 
              className="btn-university px-8 py-3 text-lg font-semibold"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Bio-Data
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}