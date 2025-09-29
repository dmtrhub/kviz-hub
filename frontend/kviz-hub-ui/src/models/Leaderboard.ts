export interface LeaderboardEntry {
  id: number;
  userId: string;
  username: string;
  quizId: number;
  quizTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  achievedAt: string;
  position: number;
  duration: number; // u minutima
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  totalCount: number;
}

export interface LeaderboardFilter {
  quizId?: number; 
  timePeriod?: "all" | "weekly" | "monthly";
  top?: number;
}

export interface QuizOption {
  id: number;
  title: string;
}