
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export type UserProfile = {
  id: string;
  created_at: string;
  name?: string;
  onboarding_complete?: boolean;
};

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

  const getUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data as UserProfile;
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  const createUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([{ id: userId }])
        .select();
      
      if (error) throw error;
      return data[0] as UserProfile;
    } catch (error: any) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

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
      // Fix here: Update the way we access the user from the response
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin + '/login',
        }
      });

      if (error) throw error;
      
      if (data?.user) {
        // Create user profile
        try {
          await createUserProfile(data.user.id);
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
