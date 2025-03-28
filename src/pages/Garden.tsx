
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sprout } from 'lucide-react';

const Garden = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If no user and not loading, redirect to login
    if (!user && !isLoading) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-garden-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-garden-light">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-garden-accent mb-4">
            <Sprout className="h-12 w-12 text-garden-dark" />
          </div>
          <h1 className="text-3xl font-bold mb-2">¡Tu jardín está listo!</h1>
          <p className="text-lg text-muted-foreground">
            Gracias por completar el proceso de onboarding emocional.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="mb-4">
            Este es el espacio donde crecerá tu jardín emocional.
          </p>
          <p className="text-muted-foreground">
            Próximamente añadiremos más funcionalidades para ayudarte a cultivar tu bienestar emocional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Garden;
