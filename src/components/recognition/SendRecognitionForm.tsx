
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AppleIcon, Loader2 } from 'lucide-react';
import { useTeamMembers, TeamMember } from '@/hooks/useTeamMembers';
import { useEmotionalRecognitions } from '@/hooks/useEmotionalRecognitions';

const SendRecognitionForm = () => {
  const [open, setOpen] = useState(false);
  const [receiverId, setReceiverId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  
  const { teamMembers, isLoading: isLoadingMembers } = useTeamMembers();
  const { sendRecognition } = useEmotionalRecognitions();
  
  const handleSendRecognition = async () => {
    if (!receiverId || !message) return;
    
    setIsSending(true);
    
    try {
      const success = await sendRecognition(receiverId, message);
      if (success) {
        setOpen(false);
        setReceiverId('');
        setMessage('');
      }
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default"
          className="bg-garden-primary text-white hover:bg-garden-dark gap-2"
        >
          <AppleIcon className="h-4 w-4" />
          <span>Enviar Reconocimiento</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enviar Reconocimiento</DialogTitle>
          <DialogDescription>
            Envía un "fruto emocional" para reconocer el trabajo de un miembro del equipo
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recipient" className="text-right">
              Destinatario
            </Label>
            <div className="col-span-3">
              {isLoadingMembers ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Cargando equipo...</span>
                </div>
              ) : (
                <Select value={receiverId} onValueChange={setReceiverId}>
                  <SelectTrigger id="recipient">
                    <SelectValue placeholder="Selecciona una persona" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member: TeamMember) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name || 'Usuario'} {member.role === 'leader' ? '(Líder)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              Mensaje
            </Label>
            <Textarea
              id="message"
              placeholder="Escribe tu mensaje de reconocimiento..."
              className="col-span-3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSendRecognition}
            disabled={!receiverId || !message || isSending}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar Reconocimiento'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendRecognitionForm;
