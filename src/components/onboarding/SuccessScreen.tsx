import { Check, Lightbulb, Zap, HelpCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessScreenProps {
  onComplete: () => void;
}

const categories = [
  { label: "Thought", icon: Lightbulb, color: "text-yellow-500" },
  { label: "Action", icon: Zap, color: "text-primary" },
  { label: "Curiosity", icon: HelpCircle, color: "text-secondary" },
];

const SuccessScreen = ({ onComplete }: SuccessScreenProps) => {
  return (
    <div className="text-center">
      {/* Success checkmark */}
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8 animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="w-8 h-8 text-white" />
        </div>
      </div>

      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
        Your Notion dashboard is ready
      </h1>
      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
        We've created a Mental Tab workspace in your Notion where all your thoughts will be organized automatically.
      </p>

      {/* Category preview */}
      <div className="p-5 rounded-2xl bg-card border border-border mb-8">
        <p className="text-sm text-muted-foreground mb-4">
          Your thoughts will be sorted into:
        </p>
        <div className="flex justify-center gap-3">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-accent/50 min-w-[90px]"
            >
              <cat.icon className={`w-5 h-5 ${cat.color}`} />
              <span className="text-xs font-medium text-foreground">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={onComplete}
          className="w-full h-14 text-base font-semibold"
        >
          Open Notion Dashboard
          <ExternalLink className="ml-2 w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={onComplete}
          className="text-muted-foreground hover:text-foreground"
        >
          I'll check it later
        </Button>
      </div>
    </div>
  );
};

export default SuccessScreen;
