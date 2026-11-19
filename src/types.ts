export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  telegramChatId?: string;
  telegramBotToken?: string;
  remindersEnabled: boolean;
  reminderTime: string;
}

export interface GoodHabit {
  id: string;
  name: string;
  description: string;
  streak: number;
  lastCompleted: string | null;
  completedDates: string[];
  category: string;
  createdAt: string;
}

export interface BadHabit {
  id: string;
  name: string;
  quitDate: string;
  motivation: string;
  healthBenefits: HealthBenefit[];
  createdAt: string;
}

export interface HealthBenefit {
  timePassed: string; // in hours
  title: string;
  description: string;
  achieved: boolean;
}

export interface AppState {
  user: User | null;
  goodHabits: GoodHabit[];
  badHabits: BadHabit[];
}
