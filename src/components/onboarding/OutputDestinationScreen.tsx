import { FileText, Brain, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OutputDestination } from "@/pages/Onboarding";

interface OutputDestinationScreenProps {
  onSelect: (destination: OutputDestination) => void;
  onBack: () => void;
}

const outputOptions = [
  {
    id: "notion" as const,
    label: "Notion",
    icon: FileText,
    description: "Sync with your existing workspace",
    recommended: true,
  },
  {
    id: "mental-tab" as const,
    label: "Keep it inside Mental Tab",
    icon: Brain,
    description: "Simple and organized",
    recommended: false,
  },
];

const OutputDestinationScreen = ({
  onSelect,
  onBack,
}: OutputDestinationScreenProps) => {
  return (
    <div className="text-center">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
        Where should we keep things organized for you?
      </h1>
      <p className="text-muted-foreground mb-10">You can change this anytime.</p>

      <div className="space-y-3">
        {outputOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className="w-full p-5 rounded-2xl border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all duration-300 group text-left flex items-center gap-4 relative"
          >
            {option.recommended && (
              <span className="absolute top-3 right-3 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                Recommended
              </span>
            )}
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

export default OutputDestinationScreen;
