'use client';

import React from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { LogOut, ShieldCheck } from 'lucide-react';

export const AdminTopbar: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-parchment-100 border-b border-parchment-300 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-muted">
          Active Administrative Session
        </span>
        <span className="inline-flex items-center gap-1 bg-jade-100 text-jade-600 text-[11px] font-bold px-2 py-0.5 rounded border border-jade-600/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin Access Verified</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs">
          {user?.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="Admin Profile" className="w-7 h-7 rounded-full" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-ink-950 text-parchment-text flex items-center justify-center font-bold text-xs">
              {(user?.email?.[0] || 'A').toUpperCase()}
            </div>
          )}
          <span className="font-bold text-ink-950">{user?.email || 'Admin'}</span>
        </div>

        <button
          onClick={signOut}
          className="text-xs font-bold text-muted hover:text-danger flex items-center gap-1 border-l border-parchment-300 pl-4 py-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

