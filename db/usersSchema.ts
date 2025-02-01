import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique(),
  password: text('password'),
  createdAt: timestamp('').defaultNow(),
  twoFactorAuthSecret: text('2fa_secret'),
  twoFactorAuthActivated: boolean('2fa_activated').default(false),
});
