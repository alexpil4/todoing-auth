'use server';

import db from '@/db/drizzle';
import { passwordSchema } from '@/validation/password';
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

export const loginWithCredential = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  // try {
  const loginSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
  });

  const loginValidation = loginSchema.safeParse({ email, password });

  if (!loginValidation.success) {
    return {
      error: true,
      message: loginValidation.error?.issues[0]?.message ?? 'An error occurred',
    };
  }

  // } catch (e) {
  // if (isApiError(e) && e.code === '23505') {
  //   return {
  //     error: true,
  //     message: 'An account is already registered with that email address.',
  //   };
  // }
  // return {
  //   error: true,
  //   message: 'An error occurred.',
  // };
  // }
};
