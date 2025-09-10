import { useState, useEffect } from "react"
import { Quote, Heart, Star, MessageCircle, Send, GraduationCap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/Header"
import { AnimatedBackground } from "@/components/AnimatedBackground"
import { useToast } from "@/hooks/use-toast"

interface LegacyEntry {
  id: string
  name: string
  matricNumber: string
  quote: string
  level: string
  timestamp: Date
  likes: number
  category: 'inspiration' | 'wisdom' | 'advice' | 'humor'
}

export function LegacyWall() {
  const [entries, setEntries] = useState<LegacyEntry[]>([])
  const [newQuote, setNewQuote] = useState("")
  const [name, setName] = useState("")
  const [matricNumber, setMatricNumber] = useState("")
  const [category, setCategory] = useState<LegacyEntry['category']>('inspiration')
  const [filter, setFilter] = useState<'all' | LegacyEntry['category']>('all')
  const { toast } = useToast()

  useEffect(() => {
    const savedEntries = localStorage.getItem('legacyWallEntries')
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries)
      setEntries(parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })))
    }
  }, [])

  const saveEntries = (newEntries: LegacyEntry[]) => {
    localStorage.setItem('legacyWallEntries', JSON.stringify(newEntries))
    setEntries(newEntries)
  }

  const addEntry = () => {
    if (!newQuote.trim() || !name.trim() || !matricNumber.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    const entry: LegacyEntry = {
      id: Date.now().toString(),
      name,
      matricNumber,
      quote: newQuote,
      level: matricNumber.includes('/') ? matricNumber.split('/')[1]?.charAt(0) + '00L' : 'Alumni',
      timestamp: new Date(),
      likes: 0,
      category
    }

    const newEntries = [entry, ...entries]
    saveEntries(newEntries)
    
    setNewQuote("")
    setName("")
    setMatricNumber("")
    setCategory('inspiration')
    
    toast({
      title: "Quote Added!",
      description: "Your wisdom has been added to our legacy wall",
    })
  }

  const likeEntry = (id: string) => {
    const newEntries = entries.map(entry => 
      entry.id === id ? { ...entry, likes: entry.likes + 1 } : entry
    )
    saveEntries(newEntries)
  }

  const filteredEntries = filter === 'all' 
    ? entries 
    : entries.filter(entry => entry.category === filter)

  const getCategoryIcon = (cat: LegacyEntry['category']) => {
    switch (cat) {
      case 'inspiration': return <Star className="h-4 w-4" />
      case 'wisdom': return <GraduationCap className="h-4 w-4" />
      case 'advice': return <MessageCircle className="h-4 w-4" />
      case 'humor': return <Heart className="h-4 w-4" />
    }
  }

  const getCategoryColor = (cat: LegacyEntry['category']) => {
    switch (cat) {
      case 'inspiration': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      case 'wisdom': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'advice': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'humor': return 'bg-pink-500/10 text-pink-600 border-pink-500/20'
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Header />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Legacy Wall
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A digital monument where every CS student leaves their mark - quotes, wisdom, and life lessons 
            that inspire future generations
          </p>
        </div>

        {/* Add New Quote Form */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Leave Your Legacy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Your Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input 
                placeholder="Matric Number (e.g., UJ/2020/123)" 
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
              />
            </div>
            <Textarea 
              placeholder="Share your wisdom, quote, motto, or life lesson..."
              value={newQuote}
              onChange={(e) => setNewQuote(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {(['inspiration', 'wisdom', 'advice', 'humor'] as const).map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategory(cat)}
                    className="capitalize"
                  >
                    {getCategoryIcon(cat)}
                    <span className="ml-1">{cat}</span>
                  </Button>
                ))}
              </div>
              <Button onClick={addEntry} className="px-6">
                <Send className="h-4 w-4 mr-2" />
                Add to Wall
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-2 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All ({entries.length})
          </Button>
          {(['inspiration', 'wisdom', 'advice', 'humor'] as const).map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? 'default' : 'outline'}
              onClick={() => setFilter(cat)}
              className="capitalize"
            >
              {getCategoryIcon(cat)}
              <span className="ml-1">{cat} ({entries.filter(e => e.category === cat).length})</span>
            </Button>
          ))}
        </div>

        {/* Legacy Entries */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary opacity-60" />
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <Badge className={getCategoryColor(entry.category)} variant="outline">
                    {getCategoryIcon(entry.category)}
                    <span className="ml-1 capitalize">{entry.category}</span>
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => likeEntry(entry.id)}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    {entry.likes}
                  </Button>
                </div>
                
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/20" />
                  <p className="text-foreground leading-relaxed italic pl-4">
                    "{entry.quote}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                  <div>
                    <p className="font-medium text-foreground">{entry.name}</p>
                    <p>{entry.matricNumber} • {entry.level}</p>
                  </div>
                  <p>{entry.timestamp.toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <Quote className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No quotes yet</h3>
            <p className="text-muted-foreground">Be the first to share your wisdom!</p>
          </div>
        )}
      </div>
    </div>
  )
}