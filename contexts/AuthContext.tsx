import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REMEMBER_ME_KEY = 'rememberMe';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check remember me preference first
    const initializeAuth = async () => {
      try {
        const rememberMe = await AsyncStorage.getItem(REMEMBER_ME_KEY);
        console.log('🔐 AuthContext: Remember Me preference:', rememberMe);
        
        // Only sign out if explicitly set to false
        if (rememberMe === 'false') {
          console.log('🚪 AuthContext: Remember Me is false, signing out...');
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }

        // If rememberMe is 'true' or null (first time), check for existing session
        console.log('🔍 AuthContext: Checking for existing session...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('✅ AuthContext: Session found:', session ? 'Yes' : 'No');
        if (session) {
          console.log('👤 AuthContext: User email:', session.user.email);
        }
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('❌ AuthContext: Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔄 AuthContext: Auth state changed:', _event);
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error && data.user) {
      // Store remember me as true by default for new signups
      await AsyncStorage.setItem(REMEMBER_ME_KEY, 'true');

      // Create profile with username
      const created_at = new Date().toISOString();
      const updated_at = created_at;

      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        username,
        full_name: username,
        created_at,
        updated_at,
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string, rememberMe: boolean) => {
    try {
      console.log('🔑 AuthContext: Signing in with Remember Me:', rememberMe);
      // Store the remember me preference BEFORE login
      await AsyncStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ AuthContext: Sign in failed:', error.message);
        // If login fails, remove the preference
        await AsyncStorage.removeItem(REMEMBER_ME_KEY);
      } else {
        console.log('✅ AuthContext: Sign in successful!');
      }

      return { error };
    } catch (err) {
      console.error('❌ AuthContext: Sign in error:', err);
      return { error: err };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Set remember me to true for OAuth logins by default
      await AsyncStorage.setItem(REMEMBER_ME_KEY, 'true');

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      return { error };
    } catch (err) {
      console.error('Google sign in error:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    // Clear remember me preference on sign out
    await AsyncStorage.removeItem(REMEMBER_ME_KEY);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
