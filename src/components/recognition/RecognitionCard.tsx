
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import RecognitionList from './RecognitionList';
import { EmotionalRecognition, RecognitionCategory } from '@/types/leader';

interface RecognitionCardProps {
  receivedRecognitions: EmotionalRecognition[];
  sentRecognitions: EmotionalRecognition[];
  categoryMap: Record<string, RecognitionCategory>;
  unreadCount: number;
  error: string | null;
  onOpenRecognition: (recognition: EmotionalRecognition) => void;
  onRefresh: () => void;
  activeTab: 'received' | 'sent';
  onTabChange: (value: string) => void;
}

const RecognitionCard = ({
  receivedRecognitions,
  sentRecognitions,
  categoryMap,
  unreadCount,
  error,
  onOpenRecognition,
  onRefresh,
  activeTab,
  onTabChange
}: RecognitionCardProps) => {
  const hasReceivedRecognitions = receivedRecognitions && receivedRecognitions.length > 0;
  const hasSentRecognitions = sentRecognitions && sentRecognitions.length > 0;
  const hasAnyRecognitions = hasReceivedRecognitions || hasSentRecognitions;
  
  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Frutos Emocionales</CardTitle>
            <Button variant="ghost" size="sm" onClick={onRefresh} title="Reintentar">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Hubo un problema al cargar los reconocimientos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No se pudieron cargar los reconocimientos. Por favor intenta nuevamente.
            </AlertDescription>
          </Alert>
          <div className="text-xs text-muted-foreground mt-2">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!hasAnyRecognitions) {
    return (
      <Card className="border-dashed">
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle className="text-muted-foreground">Frutos Emocionales</CardTitle>
            <CardDescription>
              No has recibido ni enviado reconocimientos todavía
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onRefresh} title="Actualizar">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Frutos Emocionales</CardTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <div className="bg-primary text-primary-foreground rounded-full h-6 min-w-6 flex items-center justify-center px-2 text-xs font-medium">
                {unreadCount} nuevo{unreadCount > 1 ? 's' : ''}
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={onRefresh} title="Actualizar">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          Reconocimientos enviados y recibidos
        </CardDescription>
      </CardHeader>
      
      <Tabs 
        defaultValue="received" 
        value={activeTab} 
        onValueChange={onTabChange} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-2 w-full">
          <TabsTrigger value="received">
            Recibidos {unreadCount > 0 && <span className="ml-1 text-xs">({unreadCount})</span>}
          </TabsTrigger>
          <TabsTrigger value="sent">Enviados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="received" className="mt-0">
          <CardContent>
            <RecognitionList
              recognitions={receivedRecognitions}
              categories={categoryMap}
              onOpenRecognition={onOpenRecognition}
              type="received"
            />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="sent" className="mt-0">
          <CardContent>
            <RecognitionList
              recognitions={sentRecognitions}
              categories={categoryMap}
              onOpenRecognition={onOpenRecognition}
              type="sent"
            />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default RecognitionCard;
