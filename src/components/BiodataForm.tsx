import React, { useState, useRef } from "react"
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
  Trash2,
  Upload,
  X
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
  lga: z.string().min(2, "Local Government Area is required"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  profileImage: z.string().optional(),
  
  // Academic Information
  studentId: z.string().min(1, "Student ID is required"),
  level: z.enum(["100", "200", "300", "400", "500"]),
  cgpa: z.string().optional().refine((val) => {
    if (!val || val === "") return true; // Allow empty/undefined values
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 5.0;
  }, "CGPA must be between 0.00 and 5.00"),
  entryYear: z.string().min(4, "Entry year is required"),
  expectedGraduation: z.string().min(4, "Expected graduation year is required"),
  
  // Additional Information
  hobbies: z.string().optional(),
  goals: z.string().optional(),
  personalityType: z.enum(["creative", "logical", "leader", "social", "adventurous", "harmonious"]).optional(),
  
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
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      lga: "",
      address: "",
      profileImage: "",
      studentId: "",
      level: "100",
      cgpa: "",
      entryYear: new Date().getFullYear().toString(),
      expectedGraduation: (new Date().getFullYear() + 4).toString(),
      hobbies: "",
      goals: "",
      personalityType: "logical",
      emergencyName: "",
      emergencyPhone: "",
      emergencyRelationship: "",
    },
  })

  const onSubmit = (data: BiodataFormData) => {
    // Include additional data
    const completeData = {
      ...data,
      skills,
      projects,
      experiences,
      profileImage
    }

    console.log(completeData)
    toast({
      title: "Bio-data submitted successfully!",
      description: "Your information has been saved to the system.",
    })
  }

  const addSkill = () => {
    setSkills([...skills, { name: "", level: "Beginner" }])
  }

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    const updatedSkills = skills.map((skill, i) => 
      i === index ? { ...skill, [field]: value } : skill
    )
    setSkills(updatedSkills)
  }

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const addProject = () => {
    setProjects([...projects, { title: "", description: "", technologies: "", year: "" }])
  }

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const updatedProjects = projects.map((project, i) => 
      i === index ? { ...project, [field]: value } : project
    )
    setProjects(updatedProjects)
  }

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index))
  }

  const addExperience = () => {
    setExperiences([...experiences, { company: "", role: "", duration: "", description: "" }])
  }

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updatedExperiences = experiences.map((experience, i) => 
      i === index ? { ...experience, [field]: value } : experience
    )
    setExperiences(updatedExperiences)
  }

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        })
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setProfileImage(imageData)
        form.setValue('profileImage', imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setProfileImage(null)
    form.setValue('profileImage', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-upload"
                  />
                  <div className="flex gap-2">
                    <label htmlFor="profile-upload">
                      <Button type="button" variant="outline" asChild className="cursor-pointer">
                        <span>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Photo
                        </span>
                      </Button>
                    </label>
                    {profileImage && (
                      <Button type="button" variant="outline" onClick={removeImage} size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload a profile picture (max 5MB, JPG/PNG)
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
                Basic personal details and identification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
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
                        <Input placeholder="Enter last name" {...field} />
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
                        <Input placeholder="Enter middle name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Enter email address" className="pl-10" {...field} />
                        </div>
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
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Enter phone number" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="date" className="pl-10" {...field} />
                        </div>
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
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter nationality" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stateOfOrigin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State of Origin</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter state of origin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lga"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local Government Area</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter LGA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residential Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea 
                          placeholder="Enter complete residential address" 
                          className="pl-10 min-h-[80px]" 
                          {...field} 
                        />
                      </div>
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
              <CardDescription>
                Your academic details and university information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID/Matriculation Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter student ID" {...field} />
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="cgpa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current CGPA (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          max="5" 
                          placeholder="0.00" 
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
                      <FormLabel>Entry Year</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="2024" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expectedGraduation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Graduation</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="2028" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="card-academic animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Additional Information
              </CardTitle>
              <CardDescription>
                Tell us more about yourself
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hobbies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hobbies & Interests</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your hobbies and interests..." 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Career Goals & Aspirations</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share your career goals and aspirations..." 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="personalityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personality Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your personality type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="creative">Creative - Artistic and innovative</SelectItem>
                        <SelectItem value="logical">Logical - Analytical and systematic</SelectItem>
                        <SelectItem value="leader">Leader - Natural leadership qualities</SelectItem>
                        <SelectItem value="social">Social - People-oriented and collaborative</SelectItem>
                        <SelectItem value="adventurous">Adventurous - Risk-taking and exploratory</SelectItem>
                        <SelectItem value="harmonious">Harmonious - Peaceful and balanced</SelectItem>
                      </SelectContent>
                    </Select>
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
                Skills & Competencies
              </CardTitle>
              <CardDescription>
                Add your technical and soft skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      placeholder="Skill name (e.g., JavaScript, Leadership)"
                      value={skill.name}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="w-40">
                    <Select
                      value={skill.level}
                      onValueChange={(value: any) => updateSkill(index, 'level', value)}
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
                    size="sm"
                    onClick={() => removeSkill(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addSkill}>
                <Plus className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card className="card-academic animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Projects
              </CardTitle>
              <CardDescription>
                Showcase your academic and personal projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {projects.map((project, index) => (
                <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Project {index + 1}</h4>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeProject(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Project title"
                      value={project.title}
                      onChange={(e) => updateProject(index, 'title', e.target.value)}
                    />
                    <Input
                      placeholder="Year completed"
                      value={project.year}
                      onChange={(e) => updateProject(index, 'year', e.target.value)}
                    />
                  </div>
                  <Input
                    placeholder="Technologies used (e.g., React, Python, MySQL)"
                    value={project.technologies}
                    onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                  />
                  <Textarea
                    placeholder="Project description..."
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addProject}>
                <Plus className="mr-2 h-4 w-4" />
                Add Project
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
              <CardDescription>
                Emergency contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
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
                      <FormLabel>Emergency Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="emergencyRelationship"
                render={({ field }) => (
                  <FormItem>
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
              className="btn-university px-12 py-3 text-lg"
            >
              <Save className="mr-2 h-5 w-5" />
              Submit Bio-Data
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}