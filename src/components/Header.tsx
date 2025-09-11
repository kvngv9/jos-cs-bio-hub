import { GraduationCap, User, Home, Users, FileText, Quote, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Link, useLocation } from "react-router-dom"
import { AdminPanel } from "./AdminPanel"
import { StudentLogin } from "./StudentLogin"
import { useAdmin } from "@/hooks/useAdmin"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const location = useLocation()
  const { isAdmin, logout } = useAdmin()
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: Users, label: 'Dashboard' },
    { path: '/biodata-form', icon: FileText, label: 'Bio-Data' },
    { path: '/legacy-wall', icon: Quote, label: 'Legacy Wall' },
    { path: '/announcements', icon: Megaphone, label: 'Announcements' },
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
              UniJos CS Portal
            </h1>
            <p className="text-xs text-muted-foreground">Bio-Data Management System</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button 
                variant={location.pathname === item.path ? "default" : "ghost"} 
                size="sm"
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-3">
          <StudentLogin />
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout Admin
            </Button>
          )}
          <AdminPanel />
          <ThemeToggle />
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}