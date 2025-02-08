import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function LoggedOutLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // If id exists (logged-in)
  if (!!session?.user?.id) {
    redirect('/my-account');
  }

  return children;
}
