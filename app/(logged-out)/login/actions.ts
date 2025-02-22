'use server';

import { signIn } from '@/auth';
import db from '@/db/drizzle';
import { users } from '@/db/usersSchema';
import { passwordSchema } from '@/validation/password';
import { compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const loginWithCredential = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
  });

  const loginValidation = loginSchema.safeParse({ email, password });

  if (!loginValidation.success) {
    return {
      error: true,
      message: loginValidation.error?.issues[0]?.message ?? 'An error occurred.',
    };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: 'Incorrect email or password.',
    };
  }
};

export const preLoginCheck = async ({ email, password }: { email: string; password: string }) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  // Check the username
  if (!user) {
    return {
      error: true,
      message: 'Incorrect credentials',
    };
  } else {
    // Check the password
    const passwordCorrect = await compare(password, user.password!);

    if (!passwordCorrect) {
      return {
        error: true,
        message: 'Incorrect credentials',
      };
    }
  }

  return {
    twoFactorAuthActivated: user.twoFactorAuthActivated,
  };
};
