
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout } from 'lucide-react';

const Onboarding = () => {
  const { user, isLoading, signOut } = useAuth();
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-garden-light">
      <div className="w-full max-w-md">
        <Card className="garden-card">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-garden-accent p-3 rounded-full">
                <Sprout className="h-6 w-6 text-garden-dark" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Welcome to TeraGarden!</CardTitle>
            <CardDescription className="text-center">
              Your account has been created successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              You're now logged in as <span className="font-medium">{user?.email}</span>
            </p>
            <p>
              This is the onboarding page where you'll start setting up your garden profile.
              In the next stage of development, we'll add more features here.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => signOut()}
              className="mt-4"
            >
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
