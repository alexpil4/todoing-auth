import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChangePasswordForm from './ChangePasswordForm';

export default function ChangePassword() {
  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-1xl uppercase">CHANGE PASSWORD</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </main>
  );
}
