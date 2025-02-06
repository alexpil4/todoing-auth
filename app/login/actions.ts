import { signIn } from '@/auth';
import { passwordSchema } from '@/validation/password';
import { z } from 'zod';

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

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    console.log(error);
  }
};
