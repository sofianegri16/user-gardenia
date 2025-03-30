
import React, { useState, useMemo } from 'react';
import { useEmotionalRecognitions } from '@/hooks/useEmotionalRecognitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, AppleIcon } from 'lucide-react';
import { EmotionalRecognition, RecognitionCategory } from '@/types/leader';

const RecognitionsReceived = () => {
  const { receivedRecognitions, categories, unreadCount, isLoading, markAsRead } = useEmotionalRecognitions();
  const [selectedRecognition, setSelectedRecognition] = useState<EmotionalRecognition | null>(null);
  
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
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span>Cargando reconocimientos...</span>
      </div>
    );
  }
  
  if (receivedRecognitions.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-muted-foreground">Frutos Emocionales</CardTitle>
          <CardDescription>
            No has recibido reconocimientos todavía
          </CardDescription>
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
            {unreadCount > 0 && (
              <div className="bg-primary text-primary-foreground rounded-full h-6 min-w-6 flex items-center justify-center px-2 text-xs font-medium">
                {unreadCount} nuevo{unreadCount > 1 ? 's' : ''}
              </div>
            )}
          </div>
          <CardDescription>
            Reconocimientos enviados por tus compañeros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[150px] pr-4">
            <div className="space-y-2">
              {receivedRecognitions.map((recognition) => {
                const category = recognition.category_id ? categoryMap[recognition.category_id] : null;
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
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Recognition detail dialog */}
      {selectedRecognition && (
        <Dialog 
          open={!!selectedRecognition} 
          onOpenChange={(open) => !open && setSelectedRecognition(null)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              {selectedRecognition.category_id && categoryMap[selectedRecognition.category_id] && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl" role="img" aria-label="Categoría">
                    {categoryMap[selectedRecognition.category_id].emoji}
                  </span>
                  <span className="font-medium text-primary">
                    {categoryMap[selectedRecognition.category_id].name}
                  </span>
                </div>
              )}
              <DialogTitle className="flex items-center gap-2">
                Reconocimiento recibido
              </DialogTitle>
              <DialogDescription>
                De: {selectedRecognition.sender_name} • {new Date(selectedRecognition.created_at).toLocaleDateString()}
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
