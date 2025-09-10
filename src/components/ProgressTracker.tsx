import { Trophy, Star, Target, Award, Book, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  earned: boolean
  progress?: number
}

interface ProgressTrackerProps {
  profileCompletion: number
  level: string
  achievements?: Achievement[]
}

export function ProgressTracker({ profileCompletion, level, achievements = [] }: ProgressTrackerProps) {
  const defaultAchievements: Achievement[] = [
    {
      id: 'profile-complete',
      title: 'Profile Master',
      description: 'Complete 100% of your profile',
      icon: Star,
      earned: profileCompletion >= 100,
      progress: profileCompletion
    },
    {
      id: 'first-login',
      title: 'Welcome Aboard',
      description: 'Complete your first profile setup',
      icon: Target,
      earned: profileCompletion > 20
    },
    {
      id: 'academic-achiever',
      title: 'Academic Star',
      description: 'Maintain excellent academic records',
      icon: Book,
      earned: level === '400' || level === '500'
    },
    {
      id: 'social-butterfly',
      title: 'Social Connector',
      description: 'Connect with other students',
      icon: Users,
      earned: false
    }
  ]

  const allAchievements = achievements.length > 0 ? achievements : defaultAchievements
  const earnedCount = allAchievements.filter(a => a.earned).length

  const getCompletionLevel = (completion: number) => {
    if (completion >= 100) return { label: 'Gold Profile', color: 'bg-yellow-500', textColor: 'text-yellow-600' }
    if (completion >= 75) return { label: 'Silver Profile', color: 'bg-gray-400', textColor: 'text-gray-600' }
    if (completion >= 50) return { label: 'Bronze Profile', color: 'bg-orange-500', textColor: 'text-orange-600' }
    return { label: 'Basic Profile', color: 'bg-blue-500', textColor: 'text-blue-600' }
  }

  const completionLevel = getCompletionLevel(profileCompletion)

  return (
    <div className="space-y-6">
      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Profile Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Profile Completion</span>
            <Badge className={`${completionLevel.textColor} border-current`} variant="outline">
              {completionLevel.label}
            </Badge>
          </div>
          <div className="space-y-2">
            <Progress value={profileCompletion} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{profileCompletion}% Complete</span>
              <span>{100 - profileCompletion}% Remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Achievements ({earnedCount}/{allAchievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {allAchievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  achievement.earned 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-muted/30 border-muted'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  achievement.earned 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <achievement.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">{achievement.title}</h4>
                    {achievement.earned && (
                      <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">
                        Earned
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  {achievement.progress !== undefined && !achievement.earned && (
                    <div className="mt-2">
                      <Progress value={achievement.progress} className="h-1" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.progress}% Complete
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}