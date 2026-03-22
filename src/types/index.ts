export interface UserProfile {
  id: string;
  email: string;
  name: string;
  gender?: string;
  age?: number;
  language?: string;
  interests?: string[];
  preferences?: {
    gender?: string;
    min_age?: number;
    max_age?: number;
    language?: string;
    interests?: string[];
  };
}

export interface ChatMessage {
  id: string;
  type: 'chat' | 'system' | 'typing' | 'leave' | 'error';
  sender_id?: string;
  content: string;
  timestamp: string;
  isMe: boolean;
}
