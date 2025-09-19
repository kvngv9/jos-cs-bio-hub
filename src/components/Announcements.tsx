import { useState, useEffect } from "react"
import { Megaphone, Pin, Calendar, Clock, Users, BookOpen, Trophy, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Header } from "@/components/Header"
import { AnimatedBackground } from "@/components/AnimatedBackground"

interface Announcement {
  id: string
  title: string
  content: string
  type: 'general' | 'exam' | 'event' | 'urgent' | 'academic'
  date: Date
  isPinned: boolean
  author: string
  targetLevel?: string
}

export function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  useEffect(() => {
    // Load announcements from localStorage (admin-created) or use default sample data
    const savedAnnouncements = localStorage.getItem('announcements')
    if (savedAnnouncements) {
      const parsed = JSON.parse(savedAnnouncements)
      setAnnouncements(parsed.map((a: any) => ({ ...a, date: new Date(a.date) })))
    } else {
      // Default sample data
      setAnnouncements([
    {
      id: '1',
      title: 'Final Year Project Defense Schedule',
      content: 'Final year students (400L) are to note that project defense will commence on Monday, December 9th, 2024. Check the notice board for your allocated time slots. Ensure all documentation is complete before your defense date.',
      type: 'academic',
      date: new Date('2024-12-01'),
      isPinned: true,
      author: 'Dr. Sarah Johnson',
      targetLevel: '400L'
    },
    {
      id: '2',
      title: 'First Semester Examination Timetable Released',
      content: 'The first semester examination timetable for 2024/2025 academic session has been released. All students should check their emails and the department notice board for details. Exams begin January 15th, 2025.',
      type: 'exam',
      date: new Date('2024-11-28'),
      isPinned: true,
      author: 'Academic Office'
    },
    {
      id: '3',
      title: 'CS Department Annual Tech Conference 2024',
      content: 'Join us for the annual Computer Science Tech Conference on December 20th, 2024. This year\'s theme: "AI and the Future of Computing". Guest speakers include industry experts from Microsoft, Google, and local tech startups. Registration is free for CS students.',
      type: 'event',
      date: new Date('2024-11-25'),
      isPinned: false,
      author: 'Events Committee'
    },
    {
      id: '4',
      title: 'Server Maintenance - Learning Management System',
      content: 'The university\'s LMS will undergo scheduled maintenance on December 5th, 2024, from 2:00 AM to 6:00 AM. Services will be temporarily unavailable during this period. Plan accordingly for assignment submissions.',
      type: 'urgent',
      date: new Date('2024-12-02'),
      isPinned: false,
      author: 'IT Support'
    },
    {
      id: '5',
      title: 'Guest Lecture: Machine Learning in Healthcare',
      content: 'Prof. Emmanuel Adagunodo will deliver a guest lecture on "Applications of Machine Learning in Healthcare Systems" on December 12th, 2024, at 2:00 PM in Lecture Hall A. All levels welcome.',
      type: 'academic',
      date: new Date('2024-11-30'),
      isPinned: false,
      author: 'Dr. Michael Adebayo'
    },
    {
      id: '6',
      title: 'Programming Competition - CodeFest 2024',
      content: 'Registration is now open for CodeFest 2024, our annual programming competition. Teams of 3 students can register. Cash prizes for top 3 teams. Registration deadline: December 8th, 2024.',
      type: 'event',
      date: new Date('2024-11-26'),
      isPinned: false,
      author: 'CS Student Association'
    },
    {
      id: '7',
      title: 'Course Registration Reminder - 200L Students',
      content: '200L students who haven\'t completed their course registration for second semester should do so immediately. Late registration attracts additional fees. Contact the academic office for assistance.',
      type: 'urgent',
      date: new Date('2024-12-03'),
      isPinned: true,
      author: 'Academic Office'
    },
    {
      id: '8',
      title: 'Department Library New Books Arrival',
      content: 'New collection of computer science books have arrived at the department library. Topics include Cloud Computing, Cybersecurity, Data Science, and Mobile App Development. Visit the library for more details.',
      type: 'general',
      date: new Date('2024-11-29'),
      isPinned: false,
      author: 'Library Committee'
    }
  ])
    }
  }, [])

  const getTypeIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'general': return <Megaphone className="h-4 w-4" />
      case 'exam': return <BookOpen className="h-4 w-4" />
      case 'event': return <Calendar className="h-4 w-4" />
      case 'urgent': return <AlertCircle className="h-4 w-4" />
      case 'academic': return <Users className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: Announcement['type']) => {
    switch (type) {
      case 'general': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'exam': return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      case 'event': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'urgent': return 'bg-red-500/10 text-red-600 border-red-500/20'
      case 'academic': return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    }
  }

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return b.date.getTime() - a.date.getTime()
  })

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Header />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Announcements & Updates
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest news, events, exam schedules, and important notices 
            from the Computer Science Department
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {(['general', 'exam', 'event', 'urgent', 'academic'] as const).map((type) => {
            const count = announcements.filter(a => a.type === type).length
            return (
              <Card key={type} className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center mb-2">
                    <div className={`p-2 rounded-lg ${getTypeColor(type)}`}>
                      {getTypeIcon(type)}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">{count}</p>
                  <p className="text-sm text-muted-foreground capitalize">{type}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {sortedAnnouncements.map((announcement) => (
            <Card key={announcement.id} className={`transition-all duration-300 hover:shadow-lg ${announcement.isPinned ? 'ring-2 ring-primary/20' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {announcement.isPinned && (
                      <Pin className="h-4 w-4 text-primary" />
                    )}
                    <Badge className={getTypeColor(announcement.type)} variant="outline">
                      {getTypeIcon(announcement.type)}
                      <span className="ml-1 capitalize">{announcement.type}</span>
                    </Badge>
                    {announcement.targetLevel && (
                      <Badge variant="secondary">
                        {announcement.targetLevel}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(announcement.date)}
                    </p>
                  </div>
                </div>
                <CardTitle className="text-xl leading-tight">
                  {announcement.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground leading-relaxed">
                  {announcement.content}
                </p>
                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    By {announcement.author}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Read More
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{announcement.title}</DialogTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getTypeColor(announcement.type)} variant="outline">
                            {getTypeIcon(announcement.type)}
                            <span className="ml-1 capitalize">{announcement.type}</span>
                          </Badge>
                          {announcement.targetLevel && (
                            <Badge variant="secondary">
                              {announcement.targetLevel}
                            </Badge>
                          )}
                        </div>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            By {announcement.author} • {formatDate(announcement.date)}
                          </p>
                          <p className="leading-relaxed">{announcement.content}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-6 text-center space-y-4">
            <h3 className="text-lg font-semibold">Need Help or Have Questions?</h3>
            <p className="text-muted-foreground">
              Contact the department office or reach out to your course advisors for assistance
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline">
                Contact Office
              </Button>
              <Button>
                Submit Question
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}