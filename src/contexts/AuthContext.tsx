
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, UserProfile, createUserProfile, getUserProfile } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextProps {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for active session on mount
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUser(data.session.user);
          
          // Get user profile
          try {
            const profile = await getUserProfile(data.session.user.id);
            setProfile(profile);
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        }
      } catch (error) {
        console.error('Session error:', error);
        toast({
          title: 'Authentication Error',
          description: 'There was a problem with your session.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          // Get user profile on auth change
          try {
            const profile = await getUserProfile(session.user.id);
            setProfile(profile);
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [toast]);

  const handleSignUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user: newUser } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin + '/login',
        }
      });

      if (newUser) {
        // Create user profile
        try {
          await createUserProfile(newUser.id);
          toast({
            title: 'Account Created',
            description: 'Please check your email to confirm your account.',
          });
        } catch (error: any) {
          console.error('Error creating profile:', error);
          toast({
            title: 'Profile Creation Error',
            description: error.message || 'Could not create user profile.',
            variant: 'destructive',
          });
        }
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: 'Sign Up Failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      if (data.user) {
        // Get user profile on successful sign in
        try {
          const userProfile = await getUserProfile(data.user.id);
          setProfile(userProfile);
          toast({
            title: 'Welcome back!',
            description: 'You have successfully signed in.',
          });
        } catch (error: any) {
          console.error('Error fetching profile:', error);
        }
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: 'Sign In Failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      toast({
        title: 'Signed Out',
        description: 'You have been signed out successfully.',
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: 'Sign Out Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    profile,
    isLoading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
