
import React from 'react';
import { Loader2 } from 'lucide-react';

const TeamDashboardLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="mr-2 h-8 w-8 animate-spin text-garden-primary" />
      <span className="text-lg font-medium">Cargando datos del equipo...</span>
    </div>
  );
};

export default TeamDashboardLoading;
