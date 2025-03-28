
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { Sprout } from 'lucide-react';

const Register = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already authenticated and not loading, redirect to onboarding
    if (user && !isLoading) {
      navigate('/onboarding');
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-garden-light">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-2">
            <Sprout className="h-8 w-8 text-garden-secondary" />
            <h1 className="text-3xl font-bold text-garden-dark">TeraGarden</h1>
          </div>
          <p className="text-garden-secondary text-lg">Start growing your digital garden</p>
        </div>
        
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
