export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  plan: 'free' | 'pro';
  createdAt: string;
  avatar?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
  source?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface SiteRecord {
  id: string;
  templateId: string;
  name: string;
  subdomain: string;
  status: 'live' | 'building' | 'draft';
  customDomain?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// In-memory cache with demo users
let usersCache: User[] = [
  {
    id: 'user_demo_1',
    name: 'Vardaan Demo',
    email: 'demo@launchly.site',
    passwordHash: 'password123',
    plan: 'pro',
    createdAt: new Date().toISOString(),
    avatar: 'VD'
  }
];

let subscribersCache: Subscriber[] = [
  { id: 'sub_1', email: 'alex@designer.studio', createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), source: 'hero' },
  { id: 'sub_2', email: 'elena@startuphq.io', createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), source: 'cta' }
];

let contactMessagesCache: ContactMessage[] = [];

let sitesCache: SiteRecord[] = [
  {
    id: 'site_1',
    templateId: 'saas-launch',
    name: 'NeuroAI Studio',
    subdomain: 'neuro-ai',
    status: 'live',
    customDomain: 'neuro.site',
    views: 14280,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'site_2',
    templateId: 'agency-creative',
    name: 'Kroma Studio',
    subdomain: 'kroma-studio',
    status: 'live',
    views: 8940,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(normalizeEmail(email));
}

// Authentication Database Methods
export function findUserByEmail(email: string): User | undefined {
  const cleanEmail = normalizeEmail(email);
  return usersCache.find((u) => u.email === cleanEmail);
}

export function findUserById(id: string): User | undefined {
  return usersCache.find((u) => u.id === id);
}

export function createUser(name: string, email: string, password: string, plan: 'free' | 'pro' = 'free'): { success: boolean; user?: Omit<User, 'passwordHash'>; message: string } {
  const cleanEmail = normalizeEmail(email);
  const cleanName = name.trim();

  if (!cleanName) return { success: false, message: 'Full name is required.' };
  if (!isValidEmail(cleanEmail)) return { success: false, message: 'Please enter a valid email address.' };
  if (!password || password.length < 6) return { success: false, message: 'Password must be at least 6 characters.' };

  const existing = findUserByEmail(cleanEmail);
  if (existing) {
    return { success: false, message: 'An account with this email already exists. Please log in.' };
  }

  const initials = cleanName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName,
    email: cleanEmail,
    passwordHash: password, // In production use bcrypt
    plan,
    createdAt: new Date().toISOString(),
    avatar: initials
  };

  usersCache.push(newUser);

  const { passwordHash, ...safeUser } = newUser;
  return { success: true, user: safeUser, message: 'Account created successfully!' };
}

export function verifyUser(email: string, password: string): { success: boolean; user?: Omit<User, 'passwordHash'>; message: string } {
  const cleanEmail = normalizeEmail(email);
  const user = findUserByEmail(cleanEmail);

  if (!user) {
    return { success: false, message: 'No account found with this email. Please sign up.' };
  }

  if (user.passwordHash !== password) {
    return { success: false, message: 'Incorrect password. Please try again.' };
  }

  const { passwordHash, ...safeUser } = user;
  return { success: true, user: safeUser, message: 'Welcome back!' };
}

// Subscriptions API
export function addSubscriber(email: string, source = 'frontpage'): { success: boolean; message: string; subscriber?: Subscriber } {
  const cleanEmail = normalizeEmail(email);
  if (!isValidEmail(cleanEmail)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  const existing = subscribersCache.find((s) => s.email === cleanEmail);
  if (existing) {
    return { success: true, message: "You're already subscribed! Check your inbox for updates.", subscriber: existing };
  }

  const newSub: Subscriber = {
    id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    email: cleanEmail,
    createdAt: new Date().toISOString(),
    source,
  };

  subscribersCache.push(newSub);
  return {
    success: true,
    message: `Welcome aboard! You're #${subscribersCache.length + 4200} on Launchly early access.`,
    subscriber: newSub,
  };
}

export function getSubscribersCount(): number {
  return subscribersCache.length + 4200;
}

// Contact messages API
export function addContactMessage(name: string, email: string, message: string): { success: boolean; message: string } {
  const cleanEmail = normalizeEmail(email);
  if (!name.trim()) return { success: false, message: 'Name is required.' };
  if (!isValidEmail(cleanEmail)) return { success: false, message: 'Valid email is required.' };
  if (!message.trim() || message.length < 10) return { success: false, message: 'Please provide at least 10 characters for your message.' };

  const msg: ContactMessage = {
    id: `msg_${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  contactMessagesCache.push(msg);
  return { success: true, message: 'Thank you! Our engineering team will review your inquiry within 24 hours.' };
}

// Site Publishing API
export function publishSite(templateId: string, siteName: string, subdomain: string): { success: boolean; site?: SiteRecord; message: string } {
  const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (!cleanSubdomain || cleanSubdomain.length < 3) {
    return { success: false, message: 'Subdomain must be at least 3 alphanumeric characters.' };
  }

  const exists = sitesCache.some((s) => s.subdomain === cleanSubdomain);
  if (exists) {
    return { success: false, message: `Subdomain "${cleanSubdomain}.launchly.site" is already taken. Try another name.` };
  }

  const newSite: SiteRecord = {
    id: `site_${Date.now()}`,
    templateId,
    name: siteName || 'My Launchly Website',
    subdomain: cleanSubdomain,
    status: 'live',
    views: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  sitesCache.unshift(newSite);
  return {
    success: true,
    message: `Your site is published live at https://${cleanSubdomain}.launchly.site!`,
    site: newSite,
  };
}

export function getAllSites(): SiteRecord[] {
  return [...sitesCache];
}
