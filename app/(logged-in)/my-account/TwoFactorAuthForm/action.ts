'use server';

import { auth } from '@/auth';
import db from '@/db/drizzle';
import { users } from '@/db/usersSchema';
import { eq } from 'drizzle-orm';
import { authenticator } from 'otplib';

export const get2FASecret = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: 'Unauthorized',
    };
  }

  const [user] = await db
    .select({ twoFactorSecret: users.twoFactorAuthSecret })
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)));

  if (!user) {
    return {
      error: true,
      message: 'User not found',
    };
  }

  let twoFactorAuthSecret = user.twoFactorSecret;

  if (!twoFactorAuthSecret) {
    twoFactorAuthSecret = authenticator.generateSecret();
    await db
      .update(users)
      .set({
        twoFactorAuthSecret,
      })
      .where(eq(users.id, parseInt(session.user.id)));
  }

  return {
    twoFactorSecret: authenticator.keyuri(session.user.email ?? '', 'Todoing', twoFactorAuthSecret),
  };
};
