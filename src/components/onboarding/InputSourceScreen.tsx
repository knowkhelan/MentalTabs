import { useState } from "react";
import { MessageSquare, MessageCircle, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InputSourceScreenProps {
  onContinue: (sources: string[]) => void;
}

const inputOptions = [
  {
    id: "slack",
    label: "Slack",
    icon: MessageSquare,
    description: "Quick messages to yourself",
    connectLabel: "Connect Slack",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    description: "Voice notes & quick texts",
    connectLabel: "Connect WhatsApp",
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    description: "Send thoughts anytime",
    connectLabel: "Connect Email",
  },
];

const InputSourceScreen = ({ onContinue }: InputSourceScreenProps) => {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [connectedSources, setConnectedSources] = useState<string[]>([]);
  const [connectingSource, setConnectingSource] = useState<string | null>(null);

  const toggleSelection = (id: string) => {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleConnect = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConnectingSource(id);
    
    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setConnectedSources((prev) => [...prev, id]);
    setSelectedSources((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setConnectingSource(null);
  };

  const isConnected = (id: string) => connectedSources.includes(id);
  const isSelected = (id: string) => selectedSources.includes(id);
  const hasConnectedSource = connectedSources.length > 0;

  return (
    <div className="text-center">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
        Where do thoughts usually show up for you?
      </h1>
      <p className="text-muted-foreground mb-10">
        You can connect more than one. We'll start organizing thoughts from all of them.
      </p>

      <div className="space-y-3 mb-8">
        {inputOptions.map((option) => {
          const connected = isConnected(option.id);
          const selected = isSelected(option.id);
          const connecting = connectingSource === option.id;

          return (
            <button
              key={option.id}
              onClick={() => toggleSelection(option.id)}
              className={cn(
                "w-full p-5 rounded-2xl border-2 bg-card transition-all duration-300 group text-left",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30 hover:bg-accent"
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    selected ? "bg-primary/20" : "bg-primary/10 group-hover:bg-primary/20"
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
                <div onClick={(e) => e.stopPropagation()}>
                  {connected ? (
                    <div className="flex items-center gap-2 text-green-600 animate-fade-in">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">Connected</span>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handleConnect(option.id, e)}
                      disabled={connecting}
                      className="text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                    >
                      {connecting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Connecting...
                        </span>
                      ) : (
                        option.connectLabel
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </button>
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
  );
};

export default InputSourceScreen;
