export {};

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
}
