export interface Item {
  id: string;
  userId: string;
  name: string;
  category: string;
  subCategory?: string;
  manufacturer?: string;
  yearReleased?: number;
  tags?: string[];
  condition?: string;
  notes?: string;
  status?: 'Owned' | 'Wishlist' | 'Sold';
  dateAdded: string;
  dateModified: string;
  imageUrls?: string[];
  thumbnailUrl?: string;
  metadataSource?: 'autoApi' | 'scraped' | 'manual';
  additionalData?: Record<string, string | number | boolean | null>;
}

export interface Category {
  id: string;
  name: string;
  iconUrl?: string;
  defaultTags?: string[];
}
