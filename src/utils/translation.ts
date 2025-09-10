// Translation utility for student profiles
export type Language = 'en' | 'fr' | 'ha' | 'yo' | 'ig';

export interface TranslationDict {
  [key: string]: {
    en: string;
    fr: string;
    ha: string;
    yo: string;
    ig: string;
  };
}

export const translations: TranslationDict = {
  name: {
    en: 'Name',
    fr: 'Nom',
    ha: 'Suna',
    yo: 'Oruko',
    ig: 'Aha'
  },
  email: {
    en: 'Email',
    fr: 'Email',
    ha: 'Imel',
    yo: 'Imeeli',
    ig: 'Ozi-eletrọnik'
  },
  phone: {
    en: 'Phone',
    fr: 'Téléphone',
    ha: 'Waya',
    yo: 'Foonu',
    ig: 'Ekwentị'
  },
  level: {
    en: 'Level',
    fr: 'Niveau',
    ha: 'Matsayi',
    yo: 'Ipele',
    ig: 'Ọkwa'
  },
  skills: {
    en: 'Skills',
    fr: 'Compétences',
    ha: 'Basira',
    yo: 'Ọgbọn',
    ig: 'Nka'
  },
  hobbies: {
    en: 'Hobbies',
    fr: 'Loisirs',
    ha: 'Ayyukan Sha\'awa',
    yo: 'Awọn iṣẹ igbadun',
    ig: 'Ihe omume ntụrụndụ'
  },
  goals: {
    en: 'Goals',
    fr: 'Objectifs',
    ha: 'Manufa',
    yo: 'Awọn ibi-afẹde',
    ig: 'Ebumnuche'
  },
  address: {
    en: 'Address',
    fr: 'Adresse',
    ha: 'Adireshi',
    yo: 'Adirẹsi',
    ig: 'Adreesị'
  },
  cgpa: {
    en: 'CGPA',
    fr: 'CGPA',
    ha: 'CGPA',
    yo: 'CGPA',
    ig: 'CGPA'
  },
  student_id: {
    en: 'Student ID',
    fr: 'ID Étudiant',
    ha: 'ID Dalibi',
    yo: 'ID Ọmọ ile-ẹkọ',
    ig: 'ID nwa akwụkwọ'
  },
  view_profile: {
    en: 'View Profile',
    fr: 'Voir le profil',
    ha: 'Duba Bayani',
    yo: 'Wo profaili',
    ig: 'Lee profaịlụ'
  },
  share: {
    en: 'Share',
    fr: 'Partager',
    ha: 'Raba',
    yo: 'Pin',
    ig: 'Kekọrịta'
  },
  profile_completion: {
    en: 'Profile Completion',
    fr: 'Achèvement du profil',
    ha: 'Kammalawa Bayani',
    yo: 'Ipari profaili',
    ig: 'Mmecha profaịlụ'
  }
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  ha: 'Hausa',
  yo: 'Yorùbá',
  ig: 'Igbo'
};

export const translateText = (key: string, language: Language): string => {
  return translations[key]?.[language] || key;
};

export const translateStudentData = (studentData: any, language: Language) => {
  if (language === 'en') return studentData;
  
  // For demo purposes, we'll translate some basic fields
  const translated = { ...studentData };
  
  // Add translated labels for display
  translated._translations = {
    nameLabel: translateText('name', language),
    emailLabel: translateText('email', language),
    phoneLabel: translateText('phone', language),
    levelLabel: translateText('level', language),
    skillsLabel: translateText('skills', language),
    hobbiesLabel: translateText('hobbies', language),
    goalsLabel: translateText('goals', language),
    addressLabel: translateText('address', language),
    cgpaLabel: translateText('cgpa', language),
    studentIdLabel: translateText('student_id', language),
    viewProfileLabel: translateText('view_profile', language),
    shareLabel: translateText('share', language),
    profileCompletionLabel: translateText('profile_completion', language)
  };
  
  return translated;
};