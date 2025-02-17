import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/db/drizzle';
import { passwordResetTokens } from '@/db/passwordResetTokens';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import UpdatePasswordForm from './UpdatePasswordForm';

export default async function UpdatePassword({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
  }>;
}) {
  let isValidToken = false;

  const { token } = await searchParams;
  if (token) {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    const now = Date.now();

    if (!!passwordResetToken?.tokenExpiry && now < passwordResetToken.tokenExpiry.getTime()) {
      isValidToken = true;
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>
            {isValidToken
              ? 'Update password'
              : 'Your password reset link is invalid or has expired.'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isValidToken ? (
            <UpdatePasswordForm token={token ?? ''} />
          ) : (
            <Link className="underline" href="/password-reset">
              Request another password reset link
            </Link>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
