'use server';

import { auth } from '@/auth';
import db from '@/db/drizzle';
import { passwordResetTokens } from '@/db/passwordResetTokens';
import { users } from '@/db/usersSchema';
import { mailer } from '@/lib/email';
import { randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';

export const passwordReset = async (emailAddress: string) => {
  const session = await auth();

  if (!!session?.user?.id) {
    return {
      error: true,
      message: 'You are already logged in',
    };
  }
  const [user] = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, emailAddress));

  if (!user) {
    return;
  }

  const passwordResetToken = randomBytes(32).toString('hex');
  // Token expires after 1 hour = 36e6
  const tokenExpiry = new Date(Date.now() + 3.6e6);

  await db
    .insert(passwordResetTokens)
    .values({
      userId: user.id,
      token: passwordResetToken,
      tokenExpiry,
    })
    .onConflictDoUpdate({
      target: passwordResetTokens.userId,
      set: {
        token: passwordResetToken,
        tokenExpiry,
      },
    });

  const resetLink = `${process.env.APP_BASE_URL}/update-password?token=${passwordResetToken}`;

  await mailer.sendMail({
    from: 'test@resend.dev',
    subject: 'Password reset request',
    to: emailAddress,
    html: `Hey, ${emailAddress}! You requested to reset your password. Here's your password reset link, it will expire in 1 hour:
    <a href="${resetLink}">${resetLink}</a>`,
  });
};
