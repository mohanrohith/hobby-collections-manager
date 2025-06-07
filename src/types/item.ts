import { Timestamp } from 'firebase/firestore';

export interface Item {
  id: string;
  name: string;
  description?: string;
  category: string;
  subCategory?: string;
  tags: string[];
  images?: string[];
  imageUrl?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  condition?: string;
  notes?: string;
  manufacturer?: string;
  yearReleased?: number;
  value?: number;
  status?: 'Owned' | 'Wishlist' | 'Sold';
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  iconUrl?: string;
  defaultTags?: string[];
}
