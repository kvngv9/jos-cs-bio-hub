import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Users, ArrowRight, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden py-12 px-4 bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="floating-particle w-3 h-3" style={{ top: '20%', left: '10%', animationDelay: '0s' }} />
        <div className="floating-particle w-2 h-2" style={{ top: '60%', left: '20%', animationDelay: '2s' }} />
        <div className="floating-particle w-4 h-4" style={{ top: '40%', right: '15%', animationDelay: '4s' }} />
        <div className="geometric-shape w-16 h-16" style={{ top: '10%', right: '20%', animationDelay: '1s' }} />
        <div className="geometric-shape w-12 h-12" style={{ bottom: '20%', left: '15%', animationDelay: '3s' }} />
        <div className="gradient-orb w-32 h-32" style={{ top: '30%', left: '50%', animationDelay: '2s' }} />
      </div>
      
      <div className="container relative mx-auto text-center space-y-8 animate-fade-in">
        {/* University Badge */}
        <div className="flex justify-center">
          <Badge variant="outline" className="px-6 py-3 text-sm font-medium bg-primary/10 border-primary/20 backdrop-blur-sm">
            <GraduationCap className="mr-2 h-4 w-4" />
            University of Jos - Computer Science Department
          </Badge>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
            Student Bio-Data
            <br />
            <span className="relative">
              Management System
              <Sparkles className="absolute -top-1 -right-6 h-6 w-6 text-warning animate-pulse" />
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A comprehensive digital platform for managing student information, academic records, 
            and personnel data for the Computer Science Department at University of Jos.
          </p>
        </div>

        {/* Stats Preview */}
        <div className="flex flex-wrap justify-center gap-4 py-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">500+</div>
            <div className="text-xs text-muted-foreground">Active Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">95%</div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-info">10K+</div>
            <div className="text-xs text-muted-foreground">Data Records</div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
          <Link to="/biodata-form">
            <Button size="lg" className="btn-university px-6 py-3 text-base font-semibold">
              <Star className="mr-2 h-4 w-4" />
              Register Bio-Data
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          
          <Link to="/dashboard">
            <Button variant="outline" size="lg" className="px-6 py-3 text-base bg-background/80 backdrop-blur-sm border-primary/30 hover:bg-primary/10">
              <Users className="mr-2 h-4 w-4" />
              View Dashboard
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-6 pt-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs">Secure & Private</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs">Real-time Updates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
            <span className="text-xs">24/7 Available</span>
          </div>
        </div>
      </div>
    </section>
  );
}