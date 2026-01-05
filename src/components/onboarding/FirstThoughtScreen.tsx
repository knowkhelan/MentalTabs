import { ArrowLeft, Send, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InputSource } from "@/pages/Onboarding";

interface FirstThoughtScreenProps {
  inputSource: InputSource;
  onComplete: () => void;
  onBack: () => void;
}

const examples: Record<NonNullable<InputSource>, { text: string; context: string }> = {
  slack: {
    text: '"Call investor tomorrow"',
    context: "Send a quick DM to Mental Tab",
  },
  whatsapp: {
    text: '"Why do I keep postponing this?"',
    context: "Text or voice note to Mental Tab",
  },
  email: {
    text: '"Need to research that startup idea"',
    context: "Send an email to thoughts@mentaltab.com",
  },
};

const FirstThoughtScreen = ({
  inputSource,
  onComplete,
  onBack,
}: FirstThoughtScreenProps) => {
  const example = inputSource ? examples[inputSource] : examples.slack;
  const sourceName =
    inputSource === "slack"
      ? "Slack"
      : inputSource === "whatsapp"
      ? "WhatsApp"
      : "Email";

  return (
    <div className="text-center">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
        <Send className="w-8 h-8 text-primary" />
      </div>

      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
        Send your first thought
      </h1>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Send a message to Mental Tab from {sourceName} — just like you normally would.
      </p>

      <Button
        variant="ghost"
        className="text-muted-foreground hover:text-foreground mb-8"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Open {sourceName}
      </Button>

      {/* Example card */}
      <div className="bg-accent/50 border border-border rounded-2xl p-6 mb-8">
        <p className="text-sm text-muted-foreground mb-2">{example.context}</p>
        <p className="text-xl font-display font-semibold text-foreground">
          {example.text}
        </p>
      </div>

      <p className="text-sm text-muted-foreground mb-8 italic">
        "If it's in your head, it belongs here."
      </p>

      <Button
        onClick={onComplete}
        className="w-full h-14 text-base font-semibold"
      >
        I've sent my first thought
      </Button>
    </div>
  );
};

export default FirstThoughtScreen;
