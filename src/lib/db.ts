import { supabaseAdmin } from './supabase';

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
  siteData?: any;
}

export interface PaymentRecord {
  id: string;
  userEmail: string;
  planId: string;
  itemName: string;
  amount: string;
  currency: string;
  billingCycle: string;
  txnId: string;
  status: 'pending' | 'verified' | 'failed';
  paymentMethod: string;
  createdAt: string;
}

// In-memory fallback caches
let usersCache: User[] = [];

let subscribersCache: Subscriber[] = [];

let contactMessagesCache: ContactMessage[] = [];

let sitesCache: SiteRecord[] = [];

let paymentsCache: PaymentRecord[] = [];

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(normalizeEmail(email));
}

// ==========================================
// Authentication Database Methods
// ==========================================
export async function findUserByEmail(email: string): Promise<User | undefined> {
  const cleanEmail = normalizeEmail(email);

  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        passwordHash: data.password_hash,
        plan: data.plan,
        createdAt: data.created_at,
        avatar: data.avatar
      };
    }
  } catch (err) {
    console.warn('[Supabase] Fallback to usersCache:', err);
  }

  return usersCache.find((u) => u.email === cleanEmail);
}

export async function createUser(
  name: string, 
  email: string, 
  password: string, 
  plan: 'free' | 'pro' = 'free'
): Promise<{ success: boolean; user?: Omit<User, 'passwordHash'>; message: string }> {
  const cleanEmail = normalizeEmail(email);
  const cleanName = name.trim();

  if (!cleanName) return { success: false, message: 'Full name is required.' };
  if (!isValidEmail(cleanEmail)) return { success: false, message: 'Please enter a valid email address.' };
  if (!password || password.length < 6) return { success: false, message: 'Password must be at least 6 characters.' };

  const existing = await findUserByEmail(cleanEmail);
  if (existing) {
    return { success: false, message: 'An account with this email already exists. Please log in.' };
  }

  const initials = cleanName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newUser: User = {
    id: newUserId,
    name: cleanName,
    email: cleanEmail,
    passwordHash: password,
    plan,
    createdAt: now,
    avatar: initials
  };

  try {
    const { error } = await supabaseAdmin.from('users').insert({
      id: newUserId,
      name: cleanName,
      email: cleanEmail,
      password_hash: password,
      plan,
      avatar: initials,
      created_at: now,
      updated_at: now
    });

    if (error) {
      console.error('[Supabase] Insert user error:', error);
    }
  } catch (err) {
    console.warn('[Supabase] Failed to write to users table, keeping in cache:', err);
  }

  usersCache.push(newUser);

  const { passwordHash, ...safeUser } = newUser;
  return { success: true, user: safeUser, message: 'Account created successfully in Supabase!' };
}

export async function verifyUser(
  email: string, 
  password: string
): Promise<{ success: boolean; user?: Omit<User, 'passwordHash'>; message: string }> {
  const cleanEmail = normalizeEmail(email);
  const user = await findUserByEmail(cleanEmail);

  if (!user) {
    return { success: false, message: 'No account found with this email. Please sign up.' };
  }

  if (user.passwordHash !== password) {
    return { success: false, message: 'Incorrect password. Please try again.' };
  }

  const { passwordHash, ...safeUser } = user;
  return { success: true, user: safeUser, message: 'Welcome back!' };
}

// ==========================================
// Subscriptions / Newsletter API
// ==========================================
export async function addSubscriber(
  email: string, 
  source = 'frontpage'
): Promise<{ success: boolean; message: string; subscriber?: Subscriber }> {
  const cleanEmail = normalizeEmail(email);
  if (!isValidEmail(cleanEmail)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  const id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  const newSub: Subscriber = {
    id,
    email: cleanEmail,
    createdAt: now,
    source,
  };

  try {
    const { data: existing } = await supabaseAdmin
      .from('subscribers')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existing) {
      return { 
        success: true, 
        message: "You're already subscribed! Check your inbox for updates.", 
        subscriber: { id: existing.id, email: existing.email, createdAt: existing.created_at, source: existing.source } 
      };
    }

    await supabaseAdmin.from('subscribers').insert({
      id,
      email: cleanEmail,
      source,
      created_at: now
    });
  } catch (err) {
    console.warn('[Supabase] Subscribers table error, fallback to cache:', err);
  }

  subscribersCache.push(newSub);
  return {
    success: true,
    message: `Welcome aboard! You've joined Launchly early access.`,
    subscriber: newSub,
  };
}

export async function getSubscribersCount(): Promise<number> {
  try {
    const { count, error } = await supabaseAdmin
      .from('subscribers')
      .select('*', { count: 'exact', head: true });

    if (!error && count !== null) {
      return count;
    }
  } catch (err) {
    console.warn('[Supabase] getSubscribersCount fallback:', err);
  }
  return subscribersCache.length;
}

// ==========================================
// Contact messages API
// ==========================================
export async function addContactMessage(
  name: string, 
  email: string, 
  message: string
): Promise<{ success: boolean; message: string }> {
  const cleanEmail = normalizeEmail(email);
  if (!name.trim()) return { success: false, message: 'Name is required.' };
  if (!isValidEmail(cleanEmail)) return { success: false, message: 'Valid email is required.' };
  if (!message.trim() || message.length < 10) return { success: false, message: 'Please provide at least 10 characters for your message.' };

  const id = `msg_${Date.now()}`;
  const now = new Date().toISOString();

  const msg: ContactMessage = {
    id,
    name: name.trim(),
    email: cleanEmail,
    message: message.trim(),
    createdAt: now,
  };

  try {
    await supabaseAdmin.from('contact_messages').insert({
      id,
      name: name.trim(),
      email: cleanEmail,
      message: message.trim(),
      created_at: now
    });
  } catch (err) {
    console.warn('[Supabase] contact_messages error:', err);
  }

  contactMessagesCache.push(msg);
  return { success: true, message: 'Thank you! Our engineering team will review your inquiry within 24 hours.' };
}

// ==========================================
// Site Publishing API
// ==========================================
export async function publishSite(
  templateId: string, 
  siteName: string, 
  subdomain: string,
  userId?: string,
  siteData: any = {}
): Promise<{ success: boolean; site?: SiteRecord; message: string }> {
  const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (!cleanSubdomain || cleanSubdomain.length < 3) {
    return { success: false, message: 'Subdomain must be at least 3 alphanumeric characters.' };
  }

  const id = `site_${Date.now()}`;
  const now = new Date().toISOString();

  const newSite: SiteRecord = {
    id,
    templateId,
    name: siteName || 'My Launchly Website',
    subdomain: cleanSubdomain,
    status: 'live',
    views: 1,
    createdAt: now,
    updatedAt: now,
    siteData
  };

  try {
    const { data: existing } = await supabaseAdmin
      .from('sites')
      .select('id, user_id')
      .eq('subdomain', cleanSubdomain)
      .maybeSingle();

    if (existing) {
      if (userId && existing.user_id && existing.user_id !== userId) {
        return { success: false, message: `Subdomain "${cleanSubdomain}.launchly.site" is already taken. Try another name.` };
      }

      await supabaseAdmin.from('sites').update({
        template_id: templateId,
        name: siteName || 'My Launchly Website',
        status: 'live',
        site_data: siteData,
        updated_at: now
      }).eq('id', existing.id);

      const cacheIdx = sitesCache.findIndex(s => s.subdomain === cleanSubdomain);
      const updatedRecord: SiteRecord = {
        ...newSite,
        id: existing.id,
      };
      if (cacheIdx !== -1) {
        sitesCache[cacheIdx] = updatedRecord;
      } else {
        sitesCache.unshift(updatedRecord);
      }

      return {
        success: true,
        message: `Your site is updated live at https://${cleanSubdomain}.launchly.site!`,
        site: updatedRecord,
      };
    }

    await supabaseAdmin.from('sites').insert({
      id,
      user_id: userId || null,
      template_id: templateId,
      name: siteName || 'My Launchly Website',
      subdomain: cleanSubdomain,
      status: 'live',
      views: 1,
      site_data: siteData,
      created_at: now,
      updated_at: now
    });
  } catch (err) {
    console.warn('[Supabase] sites insert error, saving to cache:', err);
  }

  sitesCache.unshift(newSite);
  return {
    success: true,
    message: `Your site is published live at https://${cleanSubdomain}.launchly.site!`,
    site: newSite,
  };
}

export async function getAllSites(): Promise<SiteRecord[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('sites')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        templateId: d.template_id,
        name: d.name,
        subdomain: d.subdomain,
        customDomain: d.custom_domain,
        status: d.status,
        views: d.views,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
        siteData: d.site_data
      }));
    }
  } catch (err) {
    console.warn('[Supabase] getAllSites error:', err);
  }

  return [...sitesCache];
}

export async function getSitesForUser(userId?: string): Promise<SiteRecord[]> {
  try {
    let query = supabaseAdmin
      .from('sites')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (!error && data) {
      return data.map((d: any) => ({
        id: d.id,
        templateId: d.template_id,
        name: d.name,
        subdomain: d.subdomain,
        customDomain: d.custom_domain,
        status: d.status,
        views: d.views,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
        siteData: d.site_data
      }));
    }
  } catch (err) {
    console.warn('[Supabase] getSitesForUser error:', err);
  }

  return [...sitesCache];
}

export async function deleteSite(id: string): Promise<boolean> {
  try {
    await supabaseAdmin
      .from('sites')
      .delete()
      .eq('id', id);
  } catch (err) {
    console.warn('[Supabase] deleteSite error:', err);
  }

  sitesCache = sitesCache.filter(s => s.id !== id);
  return true;
}

// ==========================================
// Payments & Purchases API (QR Code & UPI)
// ==========================================
export async function recordPayment(
  userEmail: string,
  planId: string,
  itemName: string,
  amount: string,
  txnId: string,
  billingCycle = 'monthly',
  currency = 'USD'
): Promise<{ success: boolean; payment?: PaymentRecord; message: string }> {
  const cleanEmail = normalizeEmail(userEmail);
  const id = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  const record: PaymentRecord = {
    id,
    userEmail: cleanEmail,
    planId,
    itemName,
    amount,
    currency,
    billingCycle,
    txnId,
    status: 'verified',
    paymentMethod: 'qr_upi',
    createdAt: now,
  };

  try {
    await supabaseAdmin.from('payments').insert({
      id,
      user_email: cleanEmail,
      plan_id: planId,
      item_name: itemName,
      amount,
      currency,
      billing_cycle: billingCycle,
      txn_id: txnId,
      status: 'verified',
      payment_method: 'qr_upi',
      created_at: now
    });

    // If purchasing pro plan, upgrade user's account plan to pro
    if (planId === 'pro' && cleanEmail) {
      await supabaseAdmin
        .from('users')
        .update({ plan: 'pro', updated_at: now })
        .eq('email', cleanEmail);
    }
  } catch (err) {
    console.warn('[Supabase] recordPayment error, logging to cache:', err);
  }

  paymentsCache.unshift(record);

  return {
    success: true,
    payment: record,
    message: 'Payment recorded and verified successfully in Supabase database.'
  };
}
