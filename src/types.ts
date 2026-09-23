export type ThemeMode = 'dark' | 'light';
export type PanelMode = 'public' | 'admin';
export type ProjectCategory = 'Video Editing' | 'Graphics Design' | 'Meta Marketing';

export interface CommentItem {
  id: string;
  author: string;
  text: string;
  date: string;
  approved?: boolean;
}

export interface VideoItem {
  id: string;
  platform?: 'youtube' | 'facebook' | 'direct';
  youtubeId?: string;
  facebookUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  title: string;
  category?: string;
  duration?: string;
  description?: string;
  isShort?: boolean;
  tags?: string[];
  likes?: number;
  comments?: CommentItem[];
  isCustomUpload?: boolean;
  uploadedAt?: number;
}

export interface GraphicItem {
  id: string;
  title: string;
  filename: string;
  images?: string[];
  thumbnailIndex?: number;
  category?: string;
  dimensions?: string;
  tags?: string[];
  description?: string;
  behanceUrl?: string;
  client?: string;
  tools?: string[];
  likes?: number;
  comments?: CommentItem[];
  isCustomUpload?: boolean;
  uploadedAt?: number;
}

export interface MarketingItem {
  id: string;
  title: string;
  platform: 'Meta Ads' | 'Facebook' | 'Instagram' | 'Google Ads' | 'Digital Marketing' | string;
  category?: string;
  thumbnailUrl?: string;
  images?: string[];
  metrics?: {
    roas?: string;
    reach?: string;
    leads?: string;
    spend?: string;
    sales?: string;
    ctr?: string;
  };
  description?: string;
  tags?: string[];
  linkUrl?: string;
  likes?: number;
  comments?: CommentItem[];
  isCustomUpload?: boolean;
  uploadedAt?: number;
}

export interface SiteSettings {
  adminEmail: string;
  adminPassword: string;
  profileName: string;
  profileTitle: string;
  profileBio: string;
  profileAvatar: string;
  showLikesAndComments: boolean;
  socialLinks: {
    behance: string;
    whatsapp: string;
    facebook: string;
    youtube: string;
    email: string;
  };
}
