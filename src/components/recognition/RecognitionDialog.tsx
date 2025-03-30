
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EmotionalRecognition, RecognitionCategory } from '@/types/leader';

interface RecognitionDialogProps {
  recognition: EmotionalRecognition | null;
  categoryMap: Record<string, RecognitionCategory>;
  activeTab: 'received' | 'sent';
  onClose: () => void;
}

const RecognitionDialog = ({ 
  recognition, 
  categoryMap, 
  activeTab,
  onClose 
}: RecognitionDialogProps) => {
  if (!recognition) return null;

  const category = recognition.category_id 
    ? (recognition.category || categoryMap[recognition.category_id]) 
    : null;

  return (
    <Dialog 
      open={!!recognition} 
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {recognition.category_id && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl" role="img" aria-label="Categoría">
                {category?.emoji || "🌱"}
              </span>
              <span className="font-medium text-primary">
                {category?.name || "Reconocimiento"}
              </span>
            </div>
          )}
          <DialogTitle className="flex items-center gap-2">
            {activeTab === 'received' ? 'Reconocimiento recibido' : 'Reconocimiento enviado'}
          </DialogTitle>
          <DialogDescription>
            {activeTab === 'received' 
              ? `De: ${recognition.sender_name}` 
              : `Para: ${recognition.receiver_name}`} 
            • {new Date(recognition.created_at).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="bg-primary/5 p-4 rounded-md my-2">
          <p>{recognition.message}</p>
        </div>
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            onClick={onClose}
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecognitionDialog;
