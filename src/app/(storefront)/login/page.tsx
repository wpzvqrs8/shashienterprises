'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/auth-provider';
import { ShieldCheck, LogOut, ShoppingBag, ArrowRight } from 'lucide-react';

export default function BuyerLoginPage() {
  const router = useRouter();
  const { user, signInWithGoogle, signOut, loading, isAdmin } = useAuth();

  return (
    <div className="bg-parchment-50 min-h-screen py-16 flex items-center justify-center border-b border-parchment-300">
      <div className="max-w-md w-full mx-4 bg-parchment-100 border border-parchment-300 rounded-[12px] p-8 shadow-sm space-y-6">
        
        <div className="text-center space-y-2">
          <div className="relative h-14 w-52 mx-auto">
            <Image
              src="/logo_white_bg.png"
              alt="Shashi Enterprises"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="font-display text-2xl text-ink-950">Dealer Account Portal</h1>
          <p className="text-xs text-muted">Sign in with your Google Account to request quotes, view order history, and track orders.</p>
        </div>

        {loading ? (
          <div className="text-center py-6 text-xs text-muted animate-pulse">
            Checking session...
          </div>
        ) : user ? (
          <div className="space-y-4 bg-parchment-50 p-4 rounded-[10px] border border-parchment-300">
            <div className="flex items-center gap-3">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-ember-500 text-white font-bold flex items-center justify-center">
                  {(user.email?.[0] || 'U').toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-ink-950 truncate">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </div>
                <div className="text-[11px] text-muted truncate">{user.email}</div>
                <span className="text-[10px] text-jade-700 font-semibold inline-flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3" /> Signed In via Google
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-parchment-300">
              <Button variant="ember" size="md" fullWidth onClick={() => router.push('/shop')} className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Browse Storefront Catalog</span>
              </Button>
              {isAdmin && (
                <Button variant="dark" size="md" fullWidth onClick={() => router.push('/admin')} className="gap-2">
                  <span>Go to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              <Button variant="outline" size="md" fullWidth onClick={signOut} className="gap-2 text-danger border-danger/30 hover:bg-danger/10">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => signInWithGoogle()}
              className="w-full bg-ink-950 hover:bg-ink-900 text-parchment-text font-bold text-xs sm:text-sm p-3.5 rounded-[8px] flex items-center justify-center gap-3 shadow-md transition-all border border-ink-800"
            >
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center p-0.5 shrink-0">
                <svg className="w-full h-full" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <span>Sign In with Google Gmail</span>
            </button>

            <p className="text-[11px] text-muted text-center leading-normal">
              By signing in, your order requests will be linked to your Google Account email for verified wholesale quoting and security.
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-parchment-300 text-center text-xs text-muted space-y-2">
          <div>Need wholesale dealer pricing assistance?</div>
          <Link href="/contact" className="font-bold text-ember-600 hover:underline block">
            Contact Delhi Support Desk →
          </Link>
        </div>

      </div>
    </div>
  );
}

