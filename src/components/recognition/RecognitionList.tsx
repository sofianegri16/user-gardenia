
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppleIcon } from 'lucide-react';
import { EmotionalRecognition, RecognitionCategory } from '@/types/leader';

interface RecognitionListProps {
  recognitions: EmotionalRecognition[];
  categories: Record<string, RecognitionCategory>;
  onOpenRecognition: (recognition: EmotionalRecognition) => void;
  type: 'received' | 'sent';
}

const RecognitionList = ({ 
  recognitions, 
  categories, 
  onOpenRecognition, 
  type 
}: RecognitionListProps) => {
  if (!recognitions || recognitions.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm py-4">
        {type === 'received' 
          ? 'No has recibido reconocimientos todavía' 
          : 'No has enviado reconocimientos todavía'
        }
      </div>
    );
  }

  return (
    <ScrollArea className="h-[150px] pr-4">
      <div className="space-y-2">
        {recognitions.map((recognition) => {
          const category = recognition.category_id ? (recognition.category || categories[recognition.category_id]) : null;
          return (
            <div 
              key={recognition.id}
              className={`p-3 rounded-md cursor-pointer transition-colors ${
                type === 'received'
                  ? recognition.is_read 
                    ? 'bg-muted hover:bg-muted/80' 
                    : 'bg-primary/10 hover:bg-primary/20 border-l-4 border-primary'
                  : 'bg-muted hover:bg-muted/80'
              }`}
              onClick={() => onOpenRecognition(recognition)}
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
                    {type === 'received' 
                      ? `De: ${recognition.sender_name}` 
                      : `Para: ${recognition.receiver_name}`}
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
  );
};

export default RecognitionList;
