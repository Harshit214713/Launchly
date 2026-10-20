export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  tags: string[];
  badge?: 'Popular' | 'New' | 'Pro' | 'Staff Pick' | 'Trending' | 'Hot' | 'Awwwards SOTD' | 'Exclusive' | 'Design Award' | string;
  isPro: boolean;
  previewUrl: string;
  thumbnail: string;
  accent: string;
  bgColor: string;
  textColor: string;
  pages: string[];
  features: string[];
  rating?: number;
  reviewsCount?: number;
  topReview?: {
    author: string;
    role: string;
    comment: string;
  };
  sourceCodeAvailable?: boolean;
  sourceCodeUrl?: string;
  techStack?: string[];
  products?: Array<{ name: string; category: string; price: number; detail: string }>;
}

export type TemplateCategory = 'All' | 'SaaS' | 'AI' | 'Agency' | 'Portfolio' | 'Ecommerce' | 'Web3' | 'Media';

export interface Website {
  id: string;
  userId: string;
  name: string;
  templateId: string;
  status: 'draft' | 'published';
  subdomain?: string;
  publishedUrl?: string;
  content: WebsiteContent;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

export interface WebsiteContent {
  sections: Section[];
  theme: Theme;
  pages: Page[];
}

export interface Section {
  id: string;
  type: string;
  content: Record<string, unknown>;
  order: number;
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: string;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  isHome: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro';
  createdAt: string;
}
