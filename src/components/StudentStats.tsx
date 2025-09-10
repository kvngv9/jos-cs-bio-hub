import { Users, GraduationCap, BookOpen, Trophy, TrendingUp, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StudentStats() {
  const stats = [
    {
      title: "Total Students",
      value: "1,234",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Students",
      value: "1,156",
      change: "+5%",
      changeType: "positive" as const,
      icon: GraduationCap,
      color: "text-green-600"
    },
    {
      title: "Graduating Soon",
      value: "287",
      change: "0%",
      changeType: "neutral" as const,
      icon: BookOpen,
      color: "text-orange-600"
    },
    {
      title: "High Achievers",
      value: "456",
      change: "+8%",
      changeType: "positive" as const,
      icon: Trophy,
      color: "text-purple-600"
    },
    {
      title: "Average CGPA",
      value: "3.85",
      change: "+0.12",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "text-primary"
    },
    {
      title: "This Academic Year",
      value: "2024/25",
      change: "Current",
      changeType: "neutral" as const,
      icon: Calendar,
      color: "text-muted-foreground"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className={`text-xs ${
              stat.changeType === 'positive' 
                ? 'text-green-600' 
                : 'text-muted-foreground'
            }`}>
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}