
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Leaf } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const message = location.state?.message;
  
  useEffect(() => {
    // If user is already authenticated and not loading, redirect to onboarding
    if (user && !isLoading) {
      navigate('/onboarding');
    }
    
    // Show message if it exists in location state (e.g., from register page)
    if (message) {
      toast({
        title: 'Email Verification',
        description: message,
      });
    }
  }, [user, isLoading, navigate, message, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-garden-light">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-2">
            <Leaf className="h-8 w-8 text-garden-primary" />
            <h1 className="text-3xl font-bold text-garden-dark">TeraGarden</h1>
          </div>
          <p className="text-garden-secondary text-lg">Your digital plant paradise</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
