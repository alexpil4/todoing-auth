'use client';

import { Button } from '@/components/ui/button';
import { logout } from './actions';

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
}
