import { useState } from "react";
import { FileText, ArrowLeft, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OutputDestinationScreenProps {
  onContinue: () => void;
  onBack: () => void;
}

const OutputDestinationScreen = ({
  onContinue,
  onBack,
}: OutputDestinationScreenProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsConnected(true);
    setIsConnecting(false);
  };

  return (
    <div className="text-center">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 mx-auto"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>

      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
        Where should we keep things organized?
      </h1>
      <p className="text-muted-foreground mb-10">
        Connect Notion to sync your structured thoughts.
      </p>

      <div className="p-6 rounded-2xl border-2 border-primary bg-primary/5 text-left mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
            <FileText className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-xl">Notion</h3>
            <p className="text-sm text-muted-foreground">
              Sync with your existing workspace
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          {isConnected ? (
            <div className="flex items-center gap-2 text-green-600 animate-fade-in">
              <Check className="w-5 h-5" />
              <span className="font-medium">Connected to Notion</span>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Notion...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Connect Notion</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <Button
        onClick={onContinue}
        disabled={!isConnected}
        className="w-full h-14 text-lg font-semibold rounded-xl mb-4"
      >
        Continue
      </Button>

      <p className="text-sm text-muted-foreground">
        You can change this anytime in settings.
      </p>
    </div>
  );
};

export default OutputDestinationScreen;
