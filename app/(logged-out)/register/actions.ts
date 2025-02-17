'use server';
import db from '@/db/drizzle';
import { passwordMatchSchema } from '@/validation/password';
import { z } from 'zod';
import { hash } from 'bcryptjs';
import { users } from '@/db/usersSchema';

interface ApiError {
  code: string;
}

function isApiError(x: unknown): x is ApiError {
  if (x && typeof x === 'object' && 'code' in x) {
    return true;
  }
  return false;
}

export const registerUser = async ({
  email,
  password,
  passwordConfirm,
}: {
  email: string;
  password: string;
  passwordConfirm: string;
}) => {
  try {
    const newUserSchema = z
      .object({
        email: z.string().email(),
      })
      .and(passwordMatchSchema);

    const newUserValidation = newUserSchema.safeParse({ email, password, passwordConfirm });

    if (!newUserValidation.success) {
      return {
        error: true,
        message: newUserValidation.error.issues[0]?.message ?? 'An error occurred.',
      };
    }
    // Hashing the password
    const hashedPassword = await hash(password, 10);

    await db.insert(users).values({
      email,
      password: hashedPassword,
    });
  } catch (e) {
    if (isApiError(e) && e.code === '23505') {
      return {
        error: true,
        message: 'An account is already registered with that email address.',
      };
    }
    return {
      error: true,
      message: 'An error occurred.',
    };
  }
};
