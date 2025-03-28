
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface TeamDashboardErrorProps {
  error: string | null;
}

const TeamDashboardError: React.FC<TeamDashboardErrorProps> = ({ error }) => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>No se pudieron cargar los datos</CardTitle>
        <CardDescription>
          {error || 'No hay datos de equipo disponibles en este momento'}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default TeamDashboardError;
