import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { AnimatedBackground } from "@/components/AnimatedBackground"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  GraduationCap, 
  Users, 
  Award, 
  BookOpen, 
  Cpu, 
  Code, 
  Database, 
  Globe, 
  Lightbulb,
  Target,
  Heart,
  Star
} from "lucide-react"

const DepartmentInfo = () => {
  const courses = [
    {
      code: "CSC 101",
      title: "Introduction to Computer Science",
      level: "100",
      description: "Fundamental concepts of computing and programming"
    },
    {
      code: "CSC 201", 
      title: "Data Structures and Algorithms",
      level: "200",
      description: "Core data structures and algorithmic problem solving"
    },
    {
      code: "CSC 301",
      title: "Database Management Systems", 
      level: "300",
      description: "Design and implementation of database systems"
    },
    {
      code: "CSC 401",
      title: "Software Engineering",
      level: "400", 
      description: "Large-scale software development methodologies"
    },
    {
      code: "CSC 501",
      title: "Artificial Intelligence",
      level: "500",
      description: "Machine learning and AI system development"
    },
    {
      code: "CSC 502",
      title: "Cybersecurity",
      level: "500", 
      description: "Network security and ethical hacking"
    }
  ]

  const facilities = [
    {
      name: "Computer Laboratory",
      description: "State-of-the-art computers with latest software for practical sessions"
    },
    {
      name: "Server Room",
      description: "High-performance servers for database and network administration"
    },
    {
      name: "Research Lab",
      description: "Dedicated space for student and faculty research projects"
    },
    {
      name: "Digital Library",
      description: "Access to online journals, books, and research materials"
    }
  ]

  const faculty = [
    {
      name: "Prof. Dr. John Adebayo",
      position: "Head of Department",
      specialization: "Artificial Intelligence & Machine Learning",
      qualifications: "PhD Computer Science, MSc, BSc"
    },
    {
      name: "Dr. Sarah Okafor",
      position: "Associate Professor", 
      specialization: "Database Systems & Information Security",
      qualifications: "PhD Information Technology, MSc, BSc"
    },
    {
      name: "Dr. Michael Yusuf",
      position: "Senior Lecturer",
      specialization: "Software Engineering & Web Development", 
      qualifications: "PhD Software Engineering, MSc, BSc"
    },
    {
      name: "Dr. Grace Musa",
      position: "Lecturer",
      specialization: "Computer Networks & Cybersecurity",
      qualifications: "PhD Computer Networks, MSc, BSc"
    }
  ]

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 space-y-12">
          {/* Department Overview */}
          <section className="text-center space-y-6 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Computer Science Department
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Leading the future of technology education at University of Jos
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="card-academic">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    To provide world-class computer science education that prepares students 
                    for leadership roles in technology and innovation.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-academic">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center">
                    <Lightbulb className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    To be a premier center of excellence in computer science education, 
                    research, and technological innovation in Africa.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-academic">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>Our Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    Excellence, Innovation, Integrity, Collaboration, and 
                    Continuous Learning in all our endeavors.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator className="my-12" />

          {/* Courses Section */}
          <section className="space-y-8 animate-slide-up">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                Academic Programs
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive curriculum designed to meet industry standards and prepare 
                students for the digital economy
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => (
                <Card key={index} className="card-academic hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-primary border-primary">
                        Level {course.level}
                      </Badge>
                      <Code className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-lg">{course.code}</CardTitle>
                    <CardDescription className="font-medium text-foreground">
                      {course.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {course.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator className="my-12" />

          {/* Faculty Section */}
          <section className="space-y-8 animate-slide-up">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                Our Faculty
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experienced educators and researchers committed to student success
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {faculty.map((member, index) => (
                <Card key={index} className="card-academic">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center">
                        <GraduationCap className="h-8 w-8 text-white" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{member.name}</CardTitle>
                        <Badge variant="secondary">{member.position}</Badge>
                        <p className="text-sm text-muted-foreground">
                          {member.qualifications}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Specialization:</h4>
                      <p className="text-muted-foreground text-sm">
                        {member.specialization}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator className="my-12" />

          {/* Facilities Section */}
          <section className="space-y-8 animate-slide-up">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
                <Cpu className="h-8 w-8 text-primary" />
                Facilities & Resources
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Modern facilities equipped with cutting-edge technology for optimal learning
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {facilities.map((facility, index) => (
                <Card key={index} className="card-academic">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Database className="h-6 w-6 text-primary" />
                      {facility.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {facility.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-muted/50 rounded-xl p-8 space-y-6 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Get In Touch</h2>
              <p className="text-lg text-muted-foreground">
                Ready to join our community of future tech leaders?
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3 text-center">
              <div className="space-y-2">
                <h3 className="font-semibold">Department Office</h3>
                <p className="text-muted-foreground text-sm">
                  Faculty of Natural Sciences Building<br />
                  University of Jos, Plateau State
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Contact</h3>
                <p className="text-muted-foreground text-sm">
                  Email: cs@unijos.edu.ng<br />
                  Phone: +234 (0) 73 290 4000
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Office Hours</h3>
                <p className="text-muted-foreground text-sm">
                  Monday - Friday: 8:00 AM - 5:00 PM<br />
                  Saturday: 9:00 AM - 2:00 PM
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DepartmentInfo;