import { MessageSquare, MessageCircle, Mail } from "lucide-react";
import type { InputSource } from "@/pages/Onboarding";

interface InputSourceScreenProps {
  onSelect: (source: InputSource) => void;
}

const inputOptions = [
  {
    id: "slack" as const,
    label: "Slack",
    icon: MessageSquare,
    description: "Quick messages to yourself",
  },
  {
    id: "whatsapp" as const,
    label: "WhatsApp",
    icon: MessageCircle,
    description: "Voice notes & quick texts",
  },
  {
    id: "email" as const,
    label: "Email",
    icon: Mail,
    description: "Send thoughts anytime",
  },
];

const InputSourceScreen = ({ onSelect }: InputSourceScreenProps) => {
  return (
    <div className="text-center">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
        Where do thoughts usually show up for you?
      </h1>
      <p className="text-muted-foreground mb-10">
        You only need to choose one for now. You can add others later.
      </p>

      <div className="space-y-3">
        {inputOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className="w-full p-5 rounded-2xl border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all duration-300 group text-left flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <option.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">
                {option.label}
              </h3>
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default InputSourceScreen;
