
import React, { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { askAI, prepareTeamStateForAI, AskAIResponse } from '@/lib/askAI';
import { useTeamData } from '@/hooks/useTeamData';
import { toast } from '@/hooks/use-toast';

interface AIMessage {
  question: string;
  answer: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { teamData, isLoading: isTeamDataLoading } = useTeamData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast({
        title: "Consulta vacía",
        description: "Por favor, escribe una pregunta para el asistente",
        variant: "destructive",
      });
      return;
    }

    if (!teamData || teamData.length === 0) {
      toast({
        title: "Datos no disponibles",
        description: "No hay datos del equipo para proporcionar contexto al asistente",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Prepare team state for AI from the most recent data
      const teamState = prepareTeamStateForAI(teamData[0]);
      
      // Call the askAI function
      const response: AskAIResponse = await askAI({
        user_role: "Líder",
        team_state: teamState,
        question: question.trim(),
      });

      // Add the new message to the history
      setMessages(prev => [
        {
          question: question.trim(),
          answer: response.answer,
          timestamp: new Date(),
        },
        ...prev
      ]);
      
      // Clear the input
      setQuestion('');
    } catch (error) {
      console.error('Error communicating with AI Assistant:', error);
      toast({
        title: "Error",
        description: "No se pudo obtener una respuesta del asistente. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Mobile Version - Sheet/Drawer */}
      <div className="md:hidden fixed bottom-6 right-6 z-10">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="rounded-full h-14 w-14 shadow-lg" variant="default">
              <Bot size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col h-[80vh]">
            <SheetHeader>
              <SheetTitle>Asistente Virtual</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground p-4">
                  <Bot className="mx-auto h-12 w-12 text-muted-foreground/60 mb-2" />
                  <p>Pregunta cualquier cosa sobre tu equipo</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className="space-y-2">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm font-medium">Tú: {message.question}</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <p className="text-sm">{message.answer}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleSubmit} className="sticky bottom-0 bg-background pt-2">
              <div className="flex items-center space-x-2">
                <Textarea 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="¿Cómo puedo ayudar a mi equipo?"
                  className="min-h-[60px] resize-none"
                  disabled={isLoading || isTeamDataLoading}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={isLoading || isTeamDataLoading}
                  className="shrink-0"
                >
                  {isLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Version - Card */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            Asistente Virtual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground p-4">
                  <Bot className="mx-auto h-12 w-12 text-muted-foreground/60 mb-2" />
                  <p>Pregunta cualquier cosa sobre tu equipo</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className="space-y-2">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm font-medium">Tú: {message.question}</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <p className="text-sm">{message.answer}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleSubmit} className="sticky bottom-0 bg-background pt-2">
              <div className="flex items-center space-x-2">
                <Textarea 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="¿Cómo puedo ayudar a mi equipo?"
                  className="min-h-[60px] resize-none"
                  disabled={isLoading || isTeamDataLoading}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={isLoading || isTeamDataLoading}
                  className="shrink-0"
                >
                  {isLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AIAssistant;
