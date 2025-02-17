'use server';

import { auth } from '@/auth';
import db from '@/db/drizzle';
import { passwordResetTokens } from '@/db/passwordResetTokens';
import { users } from '@/db/usersSchema';
import { passwordMatchSchema } from '@/validation/password';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';

export const updatePassword = async ({
  token,
  password,
  passwordConfirm,
}: {
  token: string;
  password: string;
  passwordConfirm: string;
}) => {
  const passwordValidation = passwordMatchSchema.safeParse({ password, passwordConfirm });

  if (!passwordValidation.success) {
    return {
      error: true,
      message: passwordValidation.error.issues[0].message ?? 'Error occurred.',
    };
  }

  const session = await auth();

  if (session?.user?.id) {
    return {
      error: true,
      message: 'Already logged in. Please log out to reset your password.',
    };
  }

  let isValidToken = false;

  if (token) {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    const now = Date.now();

    // Check if db token is expired
    if (!!passwordResetToken?.tokenExpiry && now < passwordResetToken.tokenExpiry.getTime()) {
      isValidToken = true;
    }

    if (!isValidToken) {
      return {
        error: true,
        message: 'Your token is invalid or has expired.',
        isTokenInvalid: true,
      };
    }

    // Generate hashed password to be stored inside the db
    const hashedPassword = await hash(password, 10);

    // Update the user password
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, passwordResetToken.userId!));

    // Delete token from db once the password has been reset
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, passwordResetToken.id));
  }
};
