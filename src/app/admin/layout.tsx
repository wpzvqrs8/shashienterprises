'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean>(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;

    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('shashi_admin_logged_in');
      if (!loggedIn) {
        localStorage.setItem('shashi_admin_logged_in', 'true');
      }
    }
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-parchment-50 flex pl-14 md:pl-0 w-full max-w-full overflow-x-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        <AdminTopbar />
        <main className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto w-full max-w-full">{children}</main>
      </div>
    </div>
  );
}
