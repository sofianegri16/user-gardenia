
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, ChevronLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import TeamDashboard from '@/components/leader/TeamDashboard';
import AIAssistant from '@/components/leader/AIAssistant';
import { useTeamData } from '@/hooks/useTeamData';

const LeaderDashboard = () => {
  const { user, isLoading: isAuthLoading, signOut } = useAuth();
  const { isLeader } = useTeamData();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Redirect if no user
    if (!user && !isAuthLoading) {
      navigate('/login');
    }
  }, [user, isAuthLoading, navigate]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al cerrar sesión. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  };
  
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 mb-4 rounded-full bg-gray-200"></div>
          <span className="text-lg font-medium">Cargando...</span>
        </div>
      </div>
    );
  }
  
  if (!isLeader) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-garden-light">
        <div className="text-center mb-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Restringido</h1>
          <p className="text-lg text-muted-foreground mb-6">
            No tienes los permisos necesarios para acceder al panel de líderes.
          </p>
          <Button 
            onClick={() => navigate('/garden')}
            variant="default"
          >
            Volver a mi jardín
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-b from-garden-light to-white">
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/garden')}
          className="flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          <span>Volver a mi jardín</span>
        </Button>
        
        <Button 
          onClick={handleSignOut} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </Button>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-garden-primary">Panel de Liderazgo</h1>
          <p className="text-lg text-muted-foreground">
            Monitorea el bienestar emocional de tu equipo
          </p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TeamDashboard />
          </div>
          <div className="lg:col-span-1">
            <AIAssistant />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderDashboard;
