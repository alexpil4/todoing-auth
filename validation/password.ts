import { z } from 'zod';

export const passwordSchema = z.string().min(8, 'Password must contain at least 8 characters');

export const passwordMatchSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .superRefine((data, context) => {
    if (data.password !== data.passwordConfirm) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['passwordConfirm'],
        message: 'Password do not match',
      });
    }
  });
