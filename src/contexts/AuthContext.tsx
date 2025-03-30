import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
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
  session: Session | null; // Added session to the context
  isLoading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null); // Store session separately
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Function to fetch user profile - moved outside of event handlers
  const fetchUserProfile = async (userId: string) => {
    if (!userId) return null;
    
    try {
      console.log("🔍 Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      console.log("👤 Profile loaded:", data);
      return data as UserProfile;
    } catch (error: any) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Session initialization is critical - proper ordering of operations
  useEffect(() => {
    console.log("🔄 Initializing authentication");
    
    // Safety timeout to prevent UI freezing
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn("⚠️ Auth initialization timed out");
        setIsLoading(false);
        toast({
          title: "Authentication Error",
          description: "Could not connect to authentication service. Please try again.",
          variant: "destructive",
        });
      }
    }, 8000);
    
    // FIRST set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("🔔 Auth state changed:", event);
        
        // Only update basic state synchronously in the event handler
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Use setTimeout to avoid Supabase Auth deadlock
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserProfile(newSession.user.id).then(userProfile => {
              if (userProfile) {
                setProfile(userProfile);
              }
            });
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    const initSession = async () => {
      try {
        console.log("🔄 Checking for existing session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session retrieval error:", error);
          throw error;
        }
        
        if (data.session) {
          console.log("🔑 Active session found for:", data.session.user.id);
          setSession(data.session);
          setUser(data.session.user);
          
          // Fetch user profile
          const userProfile = await fetchUserProfile(data.session.user.id);
          if (userProfile) {
            console.log("👤 User profile loaded from session check");
            setProfile(userProfile);
          }
        } else {
          console.log("🔒 No active session found");
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        toast({
          title: "Authentication Error",
          description: "There was a problem with your session.",
          variant: "destructive",
        });
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    };

    initSession();

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [toast]);

  const createUserProfile = async (userId: string, fullName?: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([{ id: userId, name: fullName || null }])
        .select();
      
      if (error) throw error;
      return data[0] as UserProfile;
    } catch (error: any) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, fullName?: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin + '/login',
        }
      });

      if (error) throw error;
      
      if (data?.user) {
        // Create user profile with fullName if provided
        try {
          await createUserProfile(data.user.id, fullName);
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
          // Re-throw to prevent signup from being considered successful if profile creation fails
          throw error;
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
    let loginTimeoutId: NodeJS.Timeout | null = null;
    
    try {
      setIsLoading(true);
      console.log("🔄 Attempting sign in for:", email);
      
      // Set a timeout for login process
      loginTimeoutId = setTimeout(() => {
        setIsLoading(false);
        console.error("Login timed out after 10 seconds");
        toast({
          title: "Login Timeout",
          description: "The login process took too long. Please try again.",
          variant: "destructive",
        });
      }, 10000);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      console.log("✅ Sign in successful for:", email);
      
      // Success notification
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: 'Sign In Failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      if (loginTimeoutId) clearTimeout(loginTimeoutId);
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
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
    session, // Include session in the context value
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
