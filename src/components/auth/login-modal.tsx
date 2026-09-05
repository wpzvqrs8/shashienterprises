'use client';

import React from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { X, ShieldCheck, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, modalMessage, modalReturnUrl, signInWithGoogle } = useAuth();

  if (!isLoginModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-ink-950 text-parchment-text border border-ink-800 rounded-[14px] p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close X Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 text-muted hover:text-white p-1 rounded-full hover:bg-ink-900 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Badge */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-ember-500/10 border border-ember-500/30 text-ember-500 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gold-500 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Account Login Required</span>
          </span>
          <h3 className="font-display text-2xl text-parchment-50 mt-1">
            Sign In with Google
          </h3>
        </div>

        {/* Dynamic Contextual Message */}
        <div className="bg-ink-900 border border-ink-800 rounded-[8px] p-4 text-xs text-parchment-text/80 leading-relaxed text-center">
          {modalMessage || 'Please sign in with your Google Account to proceed with wholesale quote checkout and order tracking.'}
        </div>

        {/* Benefits list */}
        <div className="space-y-2 text-xs text-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-jade-600 shrink-0" />
            <span>Instant B2B Wholesale GST Invoice Quote Generation</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-jade-600 shrink-0" />
            <span>Real-time Pan-India Express Courier Waybill Tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-jade-600 shrink-0" />
            <span>Verified Google Account Security & Anti-Fraud Protection</span>
          </div>
        </div>

        {/* Primary Google Auth Button */}
        <button
          onClick={() => {
            closeLoginModal();
            signInWithGoogle(modalReturnUrl);
          }}
          className="w-full bg-white hover:bg-parchment-50 text-ink-950 font-bold py-3.5 px-4 rounded-[8px] transition-all flex items-center justify-center gap-3 shadow-lg group cursor-pointer border border-parchment-300"
        >
          {/* Google G SVG */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="text-sm font-bold tracking-wide">Continue with Google Account</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-auto text-muted" />
        </button>

        {/* Footer Note */}
        <div className="text-[11px] text-center text-muted">
          By signing in, you agree to Shashi Enterprises B2B Terms of Wholesale Trade & Privacy Policy.
        </div>

      </div>
    </div>
  );
};
