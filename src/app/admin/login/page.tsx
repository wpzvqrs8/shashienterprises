'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/auth-provider';
import { ShieldAlert, ShieldCheck, LogOut, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAdmin, signInWithGoogle, signOut, loading } = useAuth();

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_GMAIL || 'enterprisesshashi5@gmail.com';

  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.push('/admin');
    }
  }, [user, isAdmin, loading, router]);

  return (
    <div className="min-h-screen bg-ink-950 text-parchment-text flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-ink-900 border border-ink-800 rounded-[14px] p-8 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="relative h-14 w-52 mx-auto">
            <Image
              src="/logo_black_bg.png"
              alt="Shashi Enterprises Admin"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="font-display text-2xl text-parchment-50 tracking-wide">
            Admin Console Portal
          </h1>
          <p className="text-xs text-muted">
            Shashi Enterprises B2B Internal Administration
          </p>
        </div>

        {/* Security Rule Warning */}
        <div className="bg-ink-950 p-3 rounded-[6px] border border-ink-800 text-[11px] text-gold-500 font-mono flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Restricted Portal: Only <strong>{adminEmail}</strong> has administrative access.</span>
        </div>

        {loading ? (
          <div className="text-center py-6 text-xs text-muted font-mono animate-pulse">
            Checking Google session status...
          </div>
        ) : user ? (
          <div className="space-y-4 bg-ink-950 p-4 rounded-[10px] border border-ink-800">
            <div className="text-xs space-y-1">
              <div className="text-muted text-[10px] uppercase font-bold">Currently Signed In:</div>
              <div className="font-mono text-parchment-50 font-bold">{user.email}</div>
              {isAdmin ? (
                <div className="text-jade-400 font-bold text-xs flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Admin Account Verified
                </div>
              ) : (
                <div className="text-red-400 text-xs font-bold">
                  Access Denied: This email does not match {adminEmail}
                </div>
              )}
            </div>

            {isAdmin ? (
              <Button variant="ember" size="md" fullWidth onClick={() => router.push('/admin')} className="gap-2">
                <span>Enter Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="dark" size="sm" fullWidth onClick={signOut} className="gap-2 text-xs border border-ink-700">
                <LogOut className="w-4 h-4" />
                <span>Sign Out & Switch Account</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
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

      </div>
    </div>
  );
}

