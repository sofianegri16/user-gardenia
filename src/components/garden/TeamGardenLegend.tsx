
import React from 'react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Tree as TreeIcon, 
  Flower, 
  Cloud, 
  CloudRain, 
  Sun, 
  TreePine,
  Bulb,
  Heart
} from 'lucide-react';

interface TeamGardenLegendProps {
  className?: string;
}

const TeamGardenLegend: React.FC<TeamGardenLegendProps> = ({ className }) => {
  const legendItems = [
    {
      icon: <TreeIcon className="w-5 h-5 text-emerald-700" />,
      label: "Árbol Principal",
      description: "Representa la salud general del equipo. La forma y color reflejan el bienestar colectivo."
    },
    {
      icon: <TreePine className="w-5 h-5 text-emerald-600" />,
      label: "Árboles Pequeños",
      description: "Cada árbol pequeño representa a un miembro del equipo, sin mostrar datos individuales."
    },
    {
      icon: <Flower className="w-5 h-5 text-pink-500" />,
      label: "Flores",
      description: "Representan los logros colectivos del equipo. Más flores indican más logros."
    },
    {
      icon: <Bulb className="w-5 h-5 text-yellow-500" />,
      label: "Energía",
      description: "Indica el nivel de energía promedio del equipo. Afecta el brillo y vivacidad del jardín."
    },
    {
      icon: <Heart className="w-5 h-5 text-red-500" />,
      label: "Presión Mental",
      description: "Muestra el nivel de estrés o presión mental que experimenta el equipo."
    },
    {
      icon: <Sun className="w-5 h-5 text-yellow-400" />,
      label: "Clima Soleado",
      description: "Indica un estado emocional mayormente positivo y optimista en el equipo."
    },
    {
      icon: <Cloud className="w-5 h-5 text-blue-300" />,
      label: "Clima Nublado",
      description: "Refleja un estado emocional neutral o ligeramente preocupado del equipo."
    },
    {
      icon: <CloudRain className="w-5 h-5 text-blue-500" />,
      label: "Clima Lluvioso",
      description: "Muestra un estado emocional más desafiante o difícil en el equipo."
    }
  ];

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-medium mb-3 text-garden-primary">Leyenda del Jardín</h3>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <TooltipProvider>
          {legendItems.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded cursor-help">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p>{item.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TeamGardenLegend;
