'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export const ADMIN_EMAILS = (
  process.env.NEXT_PUBLIC_ADMIN_GMAIL ||
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
  'enterprisesshashi5@gmail.com,wpzvqrs8@gmail.com'
)
  .toLowerCase()
  .split(',')
  .map(e => e.trim());

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoginModalOpen: boolean;
  modalMessage: string;
  modalReturnUrl: string;
  openLoginModal: (message?: string, returnUrl?: string) => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalReturnUrl, setModalReturnUrl] = useState('');

  const isAdmin = Boolean(user && user.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));

  useEffect(() => {
    // 1. Fetch initial session
    async function getInitialSession() {
      try {
        const { data: { session: initSession } } = await supabase.auth.getSession();
        setSession(initSession);
        setUser(initSession?.user ?? null);
      } catch (err) {
        console.error('Error fetching auth session:', err);
      } finally {
        setLoading(false);
      }
    }

    getInitialSession();

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signInWithGoogle = async (returnUrl?: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const nextPath = returnUrl || (typeof window !== 'undefined' ? window.location.pathname : '/');
    const redirectUrl = `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google Sign In Error:', error.message);
      alert(`Google Sign In failed: ${error.message}`);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('shashi_buyer_logged_in');
        localStorage.removeItem('shashi_admin_logged_in');
      }
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const openLoginModal = (message?: string, returnUrl?: string) => {
    setModalMessage(message || 'Sign in with your Google Account to place wholesale quote orders and track dispatch updates.');
    setModalReturnUrl(returnUrl || (typeof window !== 'undefined' ? window.location.pathname : '/'));
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        signInWithGoogle,
        signOut,
        isLoginModalOpen,
        modalMessage,
        modalReturnUrl,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
