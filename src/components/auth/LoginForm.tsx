
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Leaf } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      console.log("🌿 attempting login for:", email);
      await signIn(email, password);
      
      // Inicialmente navegamos al onboarding
      // El componente onboarding verificará si ya tiene emociones configuradas
      // y redirigirá al usuario al jardín si es necesario
      navigate('/onboarding');
      
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || 'Failed to sign in. Please check your credentials.');
      
      toast({
        title: 'Error de inicio de sesión',
        description: err.message || 'Hubo un problema al iniciar sesión. Verifica tus credenciales.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md garden-card">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="bg-garden-primary p-3 rounded-full">
            <Leaf className="h-6 w-6 text-white animate-leaf-sway" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center font-bold">Login to TeraGarden</CardTitle>
        <CardDescription className="text-center">
          Enter your email and password to access your garden
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="input-garden"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <a 
                href="#" 
                className="text-sm text-garden-primary hover:text-garden-dark transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-garden"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full btn-garden-primary"
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <a 
            href="/register" 
            className="text-garden-primary hover:text-garden-dark font-medium transition-colors"
          >
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
