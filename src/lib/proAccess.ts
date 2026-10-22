import { cookies } from 'next/headers';
import { verifySessionToken } from './auth';
import { findUserByEmail } from './db';

export async function getProAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get('launchly_session')?.value;
  const session = token ? verifySessionToken(token) : null;
  if (!session?.id || !session.email) return { authenticated: false, isPro: false };

  const user = await findUserByEmail(session.email);
  return {
    authenticated: true,
    isPro: (user?.plan ?? session.plan) === 'pro',
  };
}
