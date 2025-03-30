
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, Loader2 } from 'lucide-react';
import { askGemini } from '@/lib/askGemini';
import { toast } from '@/hooks/use-toast';
import { useTeamData } from '@/hooks/useTeamData';

const AIAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { teamData } = useTeamData();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    try {
      setIsLoading(true);
      setResponse('');
      
      // Pass team emotional data for context if available
      const aiResponse = await askGemini(prompt, teamData);
      
      // Make sure we're handling the response correctly
      setResponse(aiResponse);
      
    } catch (error: any) {
      console.error('Error communicating with AI Assistant:', error);
      toast({
        title: 'Error',
        description: 'No se pudo conectar con el asistente IA. Por favor, inténtalo de nuevo más tarde.',
        variant: 'destructive',
      });
      setResponse('Error: No se pudo conectar con el asistente IA.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-garden-primary" />
          Asistente IA
        </CardTitle>
        <CardDescription>
          Consulta información sobre tu equipo y recibe recomendaciones
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {response && (
          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="whitespace-pre-line">{response}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea 
            placeholder="Pregunta algo sobre tu equipo..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={isLoading}
          />
        </form>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSubmit}
          disabled={!prompt.trim() || isLoading}
          className="ml-auto flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Enviar
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIAssistant;
