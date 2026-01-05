import { Check, Lightbulb, Zap, HelpCircle, ArrowRight } from "lucide-react";
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
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 animate-pulse-soft">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-8 h-8 text-primary-foreground" />
        </div>
      </div>

      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
        Your thought is now organized.
      </h1>
      <p className="text-muted-foreground mb-10 max-w-sm mx-auto">
        Mental Tab automatically turns thoughts into actions, reflections, and questions.
      </p>

      {/* Category cards */}
      <div className="flex justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <div
            key={cat.label}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border min-w-[100px]"
          >
            <cat.icon className={`w-6 h-6 ${cat.color}`} />
            <span className="text-sm font-medium text-foreground">
              {cat.label}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Button
          onClick={onComplete}
          className="w-full h-14 text-base font-semibold"
        >
          Done
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          Send another thought
        </Button>
      </div>
    </div>
  );
};

export default SuccessScreen;
