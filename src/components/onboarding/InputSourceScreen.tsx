import { useState } from "react";
import { MessageSquare, MessageCircle, Mail, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import IntegrationWizardDialog from "./IntegrationWizardDialog";

type IntegrationType = "slack" | "whatsapp" | "email";

interface InputSourceScreenProps {
  onContinue: (sources: string[]) => void;
}

const inputOptions = [
  {
    id: "slack" as IntegrationType,
    label: "Slack",
    icon: MessageSquare,
    description: "Quick messages to yourself",
  },
  {
    id: "whatsapp" as IntegrationType,
    label: "WhatsApp",
    icon: MessageCircle,
    description: "Voice notes & quick texts",
  },
  {
    id: "email" as IntegrationType,
    label: "Email",
    icon: Mail,
    description: "Send thoughts anytime",
  },
];

const InputSourceScreen = ({ onContinue }: InputSourceScreenProps) => {
  const [selectedSources, setSelectedSources] = useState<IntegrationType[]>([]);
  const [connectedSources, setConnectedSources] = useState<IntegrationType[]>([]);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [activeIntegration, setActiveIntegration] = useState<IntegrationType | null>(null);

  const handleConnectClick = (id: IntegrationType) => {
    if (connectedSources.includes(id)) return;
    setActiveIntegration(id);
    setWizardOpen(true);
  };

  const handleWizardConnect = () => {
    if (activeIntegration) {
      setConnectedSources((prev) => [...prev, activeIntegration]);
      setSelectedSources((prev) => 
        prev.includes(activeIntegration) ? prev : [...prev, activeIntegration]
      );
    }
  };

  const handleCheckboxChange = (id: IntegrationType, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connectedSources.includes(id)) {
      setConnectedSources((prev) => prev.filter((s) => s !== id));
      setSelectedSources((prev) => prev.filter((s) => s !== id));
    }
  };

  const isConnected = (id: IntegrationType) => connectedSources.includes(id);
  const isSelected = (id: IntegrationType) => selectedSources.includes(id);
  const hasConnectedSource = connectedSources.length > 0;

  return (
    <>
      <div className="text-center">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
          Where do thoughts usually show up for you?
        </h1>
        <p className="text-muted-foreground mb-8">
          Select all that apply — we'll organize thoughts from each.
        </p>

        <div className="space-y-3 mb-8">
          {inputOptions.map((option) => {
            const connected = isConnected(option.id);
            const selected = isSelected(option.id);

            return (
              <div
                key={option.id}
                onClick={() => handleConnectClick(option.id)}
                className={cn(
                  "w-full p-5 rounded-2xl border-2 bg-card transition-all duration-300 cursor-pointer text-left relative",
                  connected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/30 hover:bg-accent"
                )}
              >
                {/* Checkbox indicator - click to disconnect */}
                <div className="absolute top-4 right-4" onClick={(e) => handleCheckboxChange(option.id, e)}>
                  <div
                    className={cn(
                      "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer",
                      connected
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/30 bg-background"
                    )}
                  >
                    {connected && <Check className="w-4 h-4 text-primary-foreground" />}
                  </div>
                </div>

                <div className="flex items-center gap-4 pr-8">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                      selected ? "bg-primary/20" : "bg-primary/10"
                    )}
                  >
                    <option.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">
                      {option.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>

                {/* Connect action at bottom of card */}
                <div className="mt-4 pt-3 border-t border-border/50" onClick={(e) => e.stopPropagation()}>
                  {connected ? (
                    <div className="flex items-center gap-2 text-green-600 animate-fade-in">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Connected</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleConnectClick(option.id)}
                      className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Button
          onClick={() => onContinue(connectedSources)}
          disabled={!hasConnectedSource}
          className="w-full h-14 text-lg font-semibold rounded-xl mb-4"
        >
          Continue
        </Button>

        <p className="text-sm text-muted-foreground">
          You can add or remove integrations later.
        </p>
      </div>

      <IntegrationWizardDialog
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        integration={activeIntegration}
        onConnect={handleWizardConnect}
      />
    </>
  );
};

export default InputSourceScreen;
