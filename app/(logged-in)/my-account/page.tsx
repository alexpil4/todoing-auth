import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import TwoFactorAuthForm from './TwoFactorAuthForm';
import db from '@/db/drizzle';
import { users } from '@/db/usersSchema';
import { eq } from 'drizzle-orm';

export default async function MyAccount() {
  const session = await auth();

  const [user] = session?.user?.id
    ? await db
        .select({
          twoFactorActivated: users.twoFactorAuthActivated,
        })
        .from(users)
        .where(eq(users.id, parseInt(session?.user?.id)))
    : [];

  const is2FAActivated = user.twoFactorActivated ?? false;

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-1xl uppercase">MY ACCOUNT</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>Email Address</Label>
        <div className="text-muted-foreground">{session?.user?.email}</div>
        <TwoFactorAuthForm is2FAActivated={is2FAActivated} />
      </CardContent>
    </Card>
  );
}
