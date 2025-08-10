'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function UserMenu() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserName(user.email || 'User');
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-700">Hi, {userName}</span>
      <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
    </div>
  );
}
