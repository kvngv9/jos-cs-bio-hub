export interface PersonalityProfile {
  type: string
  color: string
  gradient: string
  description: string
}

export const personalityColors: Record<string, PersonalityProfile> = {
  creative: {
    type: "Creative",
    color: "hsl(270, 70%, 60%)",
    gradient: "linear-gradient(135deg, hsl(270, 70%, 60%) 0%, hsl(290, 60%, 70%) 100%)",
    description: "Artistic, innovative, and imaginative"
  },
  logical: {
    type: "Logical",
    color: "hsl(210, 70%, 60%)",
    gradient: "linear-gradient(135deg, hsl(210, 70%, 60%) 0%, hsl(200, 60%, 70%) 100%)",
    description: "Analytical, systematic, and detail-oriented"
  },
  leader: {
    type: "Leader",
    color: "hsl(0, 70%, 60%)",
    gradient: "linear-gradient(135deg, hsl(0, 70%, 60%) 0%, hsl(15, 60%, 70%) 100%)",
    description: "Confident, decisive, and motivational"
  },
  social: {
    type: "Social",
    color: "hsl(150, 70%, 50%)",
    gradient: "linear-gradient(135deg, hsl(150, 70%, 50%) 0%, hsl(170, 60%, 60%) 100%)",
    description: "Outgoing, empathetic, and collaborative"
  },
  adventurous: {
    type: "Adventurous",
    color: "hsl(30, 70%, 60%)",
    gradient: "linear-gradient(135deg, hsl(30, 70%, 60%) 0%, hsl(45, 60%, 70%) 100%)",
    description: "Bold, curious, and risk-taking"
  },
  harmonious: {
    type: "Harmonious",
    color: "hsl(60, 50%, 70%)",
    gradient: "linear-gradient(135deg, hsl(60, 50%, 70%) 0%, hsl(80, 40%, 80%) 100%)",
    description: "Peaceful, balanced, and diplomatic"
  }
}

export const getPersonalityFromSkills = (skills: string[]): PersonalityProfile => {
  const skillsLower = skills.map(s => s.toLowerCase())
  
  // Creative indicators
  if (skillsLower.some(skill => 
    ['ui/ux', 'design', 'photoshop', 'figma', 'art', 'creative', 'graphics', 'adobe'].includes(skill)
  )) {
    return personalityColors.creative
  }
  
  // Leadership indicators
  if (skillsLower.some(skill => 
    ['management', 'leadership', 'team lead', 'project management', 'scrum master'].includes(skill)
  )) {
    return personalityColors.leader
  }
  
  // Social indicators
  if (skillsLower.some(skill => 
    ['communication', 'public speaking', 'marketing', 'sales', 'hr', 'social media'].includes(skill)
  )) {
    return personalityColors.social
  }
  
  // Adventurous indicators
  if (skillsLower.some(skill => 
    ['blockchain', 'ai', 'machine learning', 'devops', 'startup', 'entrepreneur'].includes(skill)
  )) {
    return personalityColors.adventurous
  }
  
  // Default to logical for technical skills
  return personalityColors.logical
}