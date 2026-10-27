export interface HotspotPoint {
  id: number;
  topicNumber: number;
  title: string;
  category: string;
  tag: string;
  text: string;
  x: number; // percentage from left (0 - 100)
  y: number; // percentage from top (0 - 100)
  regionName: string;
  iconType?: 'wind' | 'temp' | 'fish' | 'rain' | 'crop' | 'storm' | 'cycle' | 'history' | 'globe';
}

export interface ClimateCard {
  id: string;
  letterKey: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  letter: string;
  uppercaseLetter: string;
  image: string;
  title: string;
  text: string;
  dateTag?: string;
  location?: string;
  mobileOrder: number;
  desktopOrder: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  relatedTopicId?: number;
}

export interface RankingEntry {
  id: string;
  name: string;
  score: number;
  totalQuestions: number;
  timeSeconds: number;
  date: string;
  schoolGrade?: string;
  deviceFingerprint?: string;
}
