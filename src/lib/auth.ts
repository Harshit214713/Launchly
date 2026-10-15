import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'launchly_dev_secret_key_change_in_production_32bytes';

// ==========================================
// 1. Password Hashing (scrypt + timing-safe comparison)
// ==========================================

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;

  // Handle potential legacy plain-text password gracefully
  if (!storedHash.includes(':')) {
    const isMatch = password === storedHash;
    return isMatch;
  }

  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;

  try {
    const computedHash = crypto.scryptSync(password, salt, 64).toString('hex');
    const computedBuffer = Buffer.from(computedHash, 'hex');
    const originalBuffer = Buffer.from(originalHash, 'hex');

    if (computedBuffer.length !== originalBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(computedBuffer, originalBuffer);
  } catch {
    return false;
  }
}

// ==========================================
// 2. Cryptographic Signed Session Tokens
// ==========================================

export interface SessionPayload {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro';
  createdAt: string;
  avatar?: string;
  exp: number; // Expiration timestamp in seconds
}

export function createSessionToken(user: {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro';
  createdAt: string;
  avatar?: string;
}): string {
  const payload: SessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days expiration
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  if (!token || !token.includes('.')) return null;

  const [payloadB64, signature] = token.split('.');
  if (!payloadB64 || !signature) return null;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(payloadB64)
      .digest('base64url');

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString('utf8')
    );

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
