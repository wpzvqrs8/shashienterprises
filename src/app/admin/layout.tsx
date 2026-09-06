'use client';

import React from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Lock, LogOut, ArrowRight } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-950 text-parchment-text flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-ember-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted font-mono">Verifying Admin Credentials...</p>
      </div>
    );
  }

  // Strict Admin Lockout Security Guard
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-ink-950 text-parchment-text flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-ink-900 border border-red-500/40 rounded-[14px] p-8 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-2xl text-parchment-50 tracking-wide font-bold">
              Admin Access Restricted
            </h1>
            <p className="text-xs text-muted leading-relaxed">
              Access to the Shashi Enterprises management portal is strictly locked. Only authorized administrator Google accounts are permitted.
            </p>
          </div>

          {user ? (
            <div className="bg-ink-950 p-4 rounded-[8px] border border-ink-800 space-y-3 text-left">
              <div className="text-[11px] text-muted uppercase font-bold tracking-wider">Current Account:</div>
              <div className="text-xs font-mono text-gold-500 font-bold truncate">{user.email}</div>
              <p className="text-[11px] text-red-400">
                This Google account is not granted admin portal privileges.
              </p>
              <Button variant="dark" size="sm" fullWidth onClick={signOut} className="gap-2 text-xs border border-ink-700">
                <LogOut className="w-4 h-4" />
                <span>Sign Out & Switch Account</span>
              </Button>
            </div>
          ) : (
            <div className="pt-2">
              <button
                onClick={() => signInWithGoogle()}
                className="w-full bg-ember-600 hover:bg-ember-500 text-white font-bold text-xs sm:text-sm p-3.5 rounded-[8px] flex items-center justify-center gap-3 shadow-warm transition-all"
              >
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center p-0.5 shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <span>Sign In with Admin Google Account</span>
              </button>
            </div>
          )}

          <div className="pt-2 text-[11px] text-muted">
            Shashi Enterprises Security Audit Protocol
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment-50 flex pl-14 md:pl-0 w-full max-w-full overflow-x-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        <main className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto w-full max-w-full">{children}</main>
      </div>
    </div>
  );
}

