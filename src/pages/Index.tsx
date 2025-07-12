import { Link } from "react-router-dom"
import { GraduationCap, Users, FileText, TrendingUp, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/Header"

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Comprehensive bio-data collection and management for all CS students",
      color: "text-primary"
    },
    {
      icon: FileText,
      title: "Digital Records",
      description: "Secure digital storage of academic and personal information",
      color: "text-success"
    },
    {
      icon: TrendingUp,
      title: "Analytics & Reports",
      description: "Generate insights and reports from student data",
      color: "text-info"
    },
    {
      icon: GraduationCap,
      title: "Academic Tracking",
      description: "Monitor student progress and academic achievements",
      color: "text-warning"
    }
  ]

  const stats = [
    { label: "Active Students", value: "500+", icon: Users },
    { label: "Data Records", value: "10K+", icon: FileText },
    { label: "Academic Years", value: "5+", icon: GraduationCap },
    { label: "Success Rate", value: "95%", icon: Star }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-academic opacity-50" />
        <div className="container relative mx-auto text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium bg-primary/10 border-primary/20">
              University of Jos - Computer Science Department
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Student Bio-Data
              <br />
              Management System
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A comprehensive digital platform for managing student information, academic records, 
              and personnel data for the Computer Science Department at University of Jos.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/biodata-form">
              <Button size="lg" className="btn-university px-8 py-3 text-lg">
                Register Bio-Data
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto space-y-12">
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold">
              Comprehensive Student Data Management
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage student information efficiently and securely
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
            {features.map((feature, index) => (
              <Card key={index} className="card-academic group hover:shadow-medium transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary text-white">
        <div className="container mx-auto text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join the digital transformation of student data management at University of Jos
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/biodata-form">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
                Complete Your Profile
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-primary transition-all duration-300 font-semibold shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">UniJos CS Portal</span>
          </div>
          <p className="text-muted-foreground">
            Computer Science Department, University of Jos
          </p>
          <p className="text-sm text-muted-foreground">
            © 2024 University of Jos. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
