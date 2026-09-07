'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export const ADMIN_EMAILS = (
  process.env.NEXT_PUBLIC_ADMIN_GMAIL ||
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
  'enterprisesshashi95@gmail.com,enterprisesshashi5@gmail.com,wpzvqrs8@gmail.com'
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

const DEVICE_USER_KEY = 'shashi_device_user_v2';

const saveDeviceUser = (u: User | null) => {
  if (typeof window === 'undefined') return;
  if (u) {
    try {
      const payload = {
        id: u.id,
        email: u.email,
        user_metadata: u.user_metadata || {},
        app_metadata: u.app_metadata || {},
        aud: u.aud || 'authenticated',
        created_at: u.created_at || new Date().toISOString()
      };
      localStorage.setItem(DEVICE_USER_KEY, JSON.stringify(payload));
    } catch (e) {}
  } else {
    try {
      localStorage.removeItem(DEVICE_USER_KEY);
    } catch (e) {}
  }
};

const loadDeviceUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DEVICE_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.email) {
      return parsed as User;
    }
  } catch (e) {}
  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(() => loadDeviceUser());
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalReturnUrl, setModalReturnUrl] = useState('');

  const isAdmin = Boolean(user && user.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));

  useEffect(() => {
    // Restore persistent user from device storage immediately
    const savedUser = loadDeviceUser();
    if (savedUser) {
      setUser(savedUser);
    }

    // 1. Fetch initial live Supabase auth session
    async function getInitialSession() {
      try {
        const { data: { session: initSession } } = await supabase.auth.getSession();
        setSession(initSession);
        if (initSession?.user) {
          setUser(initSession.user);
          saveDeviceUser(initSession.user);
        } else if (!savedUser) {
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching auth session:', err);
      } finally {
        setLoading(false);
      }
    }

    getInitialSession();

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      if (currentSession?.user) {
        setUser(currentSession.user);
        saveDeviceUser(currentSession.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        saveDeviceUser(null);
      }
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
          prompt: 'select_account',
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
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setUser(null);
      setSession(null);
      saveDeviceUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('shashi_buyer_logged_in');
        localStorage.removeItem('shashi_admin_logged_in');
        localStorage.removeItem(DEVICE_USER_KEY);
      }
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
