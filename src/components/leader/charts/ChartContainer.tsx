
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

/**
 * Consistent container for chart components
 */
const ChartContainer: React.FC<ChartContainerProps> = ({ 
  title, 
  description, 
  children 
}) => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartContainer;
