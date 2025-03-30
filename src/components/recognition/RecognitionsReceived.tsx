
import React, { useState, useMemo } from 'react';
import { useEmotionalRecognitions } from '@/hooks/useEmotionalRecognitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, AppleIcon, RefreshCw, AlertTriangle } from 'lucide-react';
import { EmotionalRecognition, RecognitionCategory } from '@/types/leader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RecognitionsReceived = () => {
  const { 
    receivedRecognitions, 
    sentRecognitions, 
    categories, 
    unreadCount, 
    isLoading,
    error,
    markAsRead, 
    refreshRecognitions 
  } = useEmotionalRecognitions();
  const [selectedRecognition, setSelectedRecognition] = useState<EmotionalRecognition | null>(null);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  
  // Create a lookup map for categories by ID for quick access
  const categoryMap = useMemo(() => {
    const map: Record<string, RecognitionCategory> = {};
    categories.forEach(category => {
      map[category.id] = category;
    });
    return map;
  }, [categories]);
  
  const handleOpenRecognition = async (recognition: EmotionalRecognition) => {
    setSelectedRecognition(recognition);
    
    // Mark as read if it's unread
    if (!recognition.is_read) {
      await markAsRead(recognition.id);
    }
  };

  const handleRefresh = () => {
    refreshRecognitions();
  };

  console.log('Recognition state:', { 
    receivedCount: receivedRecognitions?.length || 0,
    sentCount: sentRecognitions?.length || 0,
    isLoading,
    error
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span>Cargando reconocimientos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Frutos Emocionales</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleRefresh} title="Reintentar">
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
  
  const hasReceivedRecognitions = receivedRecognitions && receivedRecognitions.length > 0;
  const hasSentRecognitions = sentRecognitions && sentRecognitions.length > 0;
  const hasAnyRecognitions = hasReceivedRecognitions || hasSentRecognitions;
  
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
          <Button variant="ghost" size="sm" onClick={handleRefresh} title="Actualizar">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <>
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
              <Button variant="ghost" size="sm" onClick={handleRefresh} title="Actualizar">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Reconocimientos enviados y recibidos
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="received" onValueChange={(value) => setActiveTab(value as 'received' | 'sent')} className="w-full">
          <TabsList className="grid grid-cols-2 mb-2 w-full">
            <TabsTrigger value="received">
              Recibidos {unreadCount > 0 && <span className="ml-1 text-xs">({unreadCount})</span>}
            </TabsTrigger>
            <TabsTrigger value="sent">Enviados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="received" className="mt-0">
            <CardContent>
              <ScrollArea className="h-[150px] pr-4">
                {!hasReceivedRecognitions ? (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    No has recibido reconocimientos todavía
                  </div>
                ) : (
                  <div className="space-y-2">
                    {receivedRecognitions.map((recognition) => {
                      const category = recognition.category_id ? (recognition.category || categoryMap[recognition.category_id]) : null;
                      return (
                        <div 
                          key={recognition.id}
                          className={`p-3 rounded-md cursor-pointer transition-colors ${
                            recognition.is_read 
                              ? 'bg-muted hover:bg-muted/80' 
                              : 'bg-primary/10 hover:bg-primary/20 border-l-4 border-primary'
                          }`}
                          onClick={() => handleOpenRecognition(recognition)}
                        >
                          <div className="flex justify-between items-center gap-2">
                            <div className="flex items-center gap-2">
                              {category ? (
                                <span role="img" aria-label={category.name} className="text-lg">
                                  {category.emoji}
                                </span>
                              ) : (
                                <AppleIcon className="h-4 w-4 text-red-500" />
                              )}
                              <span className="font-medium text-sm truncate">
                                De: {recognition.sender_name}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(recognition.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs mt-1 line-clamp-1">{recognition.message}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="sent" className="mt-0">
            <CardContent>
              <ScrollArea className="h-[150px] pr-4">
                {!hasSentRecognitions ? (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    No has enviado reconocimientos todavía
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sentRecognitions.map((recognition) => {
                      const category = recognition.category_id ? (recognition.category || categoryMap[recognition.category_id]) : null;
                      return (
                        <div 
                          key={recognition.id}
                          className="bg-muted hover:bg-muted/80 p-3 rounded-md cursor-pointer transition-colors"
                          onClick={() => handleOpenRecognition(recognition)}
                        >
                          <div className="flex justify-between items-center gap-2">
                            <div className="flex items-center gap-2">
                              {category ? (
                                <span role="img" aria-label={category.name} className="text-lg">
                                  {category.emoji}
                                </span>
                              ) : (
                                <AppleIcon className="h-4 w-4 text-red-500" />
                              )}
                              <span className="font-medium text-sm truncate">
                                Para: {recognition.receiver_name}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(recognition.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs mt-1 line-clamp-1">{recognition.message}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
      
      {/* Recognition detail dialog */}
      {selectedRecognition && (
        <Dialog 
          open={!!selectedRecognition} 
          onOpenChange={(open) => !open && setSelectedRecognition(null)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              {selectedRecognition.category_id && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl" role="img" aria-label="Categoría">
                    {selectedRecognition.category?.emoji || 
                      (categoryMap[selectedRecognition.category_id]?.emoji || "🌱")}
                  </span>
                  <span className="font-medium text-primary">
                    {selectedRecognition.category?.name || 
                      (categoryMap[selectedRecognition.category_id]?.name || "Reconocimiento")}
                  </span>
                </div>
              )}
              <DialogTitle className="flex items-center gap-2">
                {activeTab === 'received' ? 'Reconocimiento recibido' : 'Reconocimiento enviado'}
              </DialogTitle>
              <DialogDescription>
                {activeTab === 'received' 
                  ? `De: ${selectedRecognition.sender_name}` 
                  : `Para: ${selectedRecognition.receiver_name}`} 
                • {new Date(selectedRecognition.created_at).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="bg-primary/5 p-4 rounded-md my-2">
              <p>{selectedRecognition.message}</p>
            </div>
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedRecognition(null)}
              >
                Cerrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RecognitionsReceived;
