import { Link } from "react-router-dom"
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary/5 via-secondary/3 to-accent/5 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Department Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-lg">CS Department</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              University of Jos Computer Science Department - Leading innovation in technology education and research.
            </p>
            <div className="flex space-x-3">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/biodata-form" className="text-muted-foreground hover:text-primary transition-colors">
                  Register Profile
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/legacy-wall" className="text-muted-foreground hover:text-primary transition-colors">
                  Legacy Wall
                </Link>
              </li>
              <li>
                <Link to="/announcements" className="text-muted-foreground hover:text-primary transition-colors">
                  Announcements
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Info */}
          <div>
            <h3 className="font-semibold mb-4">Academic</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Undergraduate Programs</li>
              <li>Postgraduate Studies</li>
              <li>Research Opportunities</li>
              <li>Course Catalog</li>
              <li>Academic Calendar</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>University of Jos, Jos, Plateau State</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+234 XXX XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>cs@unijos.edu.ng</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 University of Jos - Computer Science Department. All rights reserved.</p>
          <p className="mt-2">Designed for academic excellence</p>
        </div>
      </div>
    </footer>
  )
}