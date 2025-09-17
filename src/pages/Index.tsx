import { Link } from "react-router-dom"
import { GraduationCap, Users, FileText, TrendingUp, ArrowRight, Star, Quote, Megaphone, Heart, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/Header"
import { AnimatedBackground } from "@/components/AnimatedBackground"
import { HeroBanner } from "@/components/HeroBanner"
import { Footer } from "@/components/Footer"

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
    },
    {
      icon: Quote,
      title: "Legacy Wall",
      description: "Share wisdom and quotes that inspire future generations",
      color: "text-purple-500"
    },
    {
      icon: Megaphone,
      title: "Announcements",
      description: "Stay updated with department news, events, and exam schedules",
      color: "text-blue-500"
    }
  ]

  const stats = [
    { label: "Active Students", value: "500+", icon: Users },
    { label: "Data Records", value: "10K+", icon: FileText },
    { label: "Academic Years", value: "5+", icon: GraduationCap },
    { label: "Success Rate", value: "95%", icon: Star }
  ]

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Header />
      
      <HeroBanner />

      {/* Stats Section */}
      <section className="py-12 md:py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-slide-up">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="mx-auto w-10 h-10 md:w-12 md:h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto space-y-12">
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              Comprehensive Student Data Management
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage student information efficiently and securely
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up">
            {features.map((feature, index) => (
              <Card key={index} className="card-academic group hover:shadow-medium transition-all duration-300">
                <CardHeader className="text-center pb-3">
                  <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className={`h-6 w-6 md:h-8 md:w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg md:text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-center leading-relaxed text-sm md:text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 bg-gradient-primary text-white">
        <div className="container mx-auto text-center space-y-6 md:space-y-8 animate-fade-in">
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Join the digital transformation of student data management at University of Jos
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link to="/biodata-form">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 md:px-8 py-3 text-base md:text-lg">
                Complete Your Profile
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
            <Link to="/department-info">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-6 md:px-8 py-3 text-base md:text-lg bg-success hover:bg-success/90 text-success-foreground transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
