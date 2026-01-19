import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FileText, Table, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";
import IntegrationWizardDialog, { type IntegrationType } from "./IntegrationWizardDialog";

interface OutputDestinationScreenProps {
  onContinue: () => void;
}

type DestinationType = "notion" | "google-sheets";

const outputOptions = [
  {
    id: "notion" as DestinationType,
    label: "Notion",
    icon: FileText,
    description: "Sync with your existing workspace",
    comingSoon: false,
  },
  {
    id: "google-sheets" as DestinationType,
    label: "Google Sheets",
    icon: Table,
    description: "Organize thoughts in spreadsheets",
    comingSoon: true,
  },
];

const OutputDestinationScreen = ({
  onContinue,
}: OutputDestinationScreenProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [connectedDestinations, setConnectedDestinations] = useState<DestinationType[]>([]);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [activeDestination, setActiveDestination] = useState<IntegrationType | null>(null);

  // Check backend connection status on mount and handle Notion OAuth callback
  useEffect(() => {
    const notionStatus = searchParams.get("notion");
    
    // Handle Notion OAuth callback first
    if (notionStatus === "connected" || notionStatus === "setup_needed") {
      setConnectedDestinations((prev) => {
        if (!prev.includes("notion")) {
          return [...prev, "notion"];
        }
        return prev;
      });
      // Close wizard if it's open
      setWizardOpen(false);
      
      // Clean up URL after processing
      navigate("/onboarding", { replace: true });
      
      return; // Don't check backend if we just got a callback
    }

    // Check backend connection status
    const checkConnectionStatus = async () => {
      try {
        const storedEmail = localStorage.getItem("userEmail");
        if (!storedEmail) return;

        const response = await fetch(
          `${API_BASE_URL}/notion/status?user_email=${encodeURIComponent(storedEmail)}`
        );
        const data = await response.json();
        
        // If Notion is connected, mark it as connected
        if (data.connected) {
          setConnectedDestinations((prev) => {
            if (!prev.includes("notion")) {
              return [...prev, "notion"];
            }
            return prev;
          });
        }
      } catch (error) {
        console.log("Could not check Notion connection status:", error);
      }
    };

    checkConnectionStatus();
  }, [searchParams]);

  const handleConnectClick = (id: DestinationType) => {
    if (connectedDestinations.includes(id)) return;
    const option = outputOptions.find(opt => opt.id === id);
    if (option?.comingSoon) return; // Don't open wizard for coming soon features
    setActiveDestination(id);
    setWizardOpen(true);
  };

  const handleWizardConnect = () => {
    if (activeDestination && (activeDestination === "notion" || activeDestination === "google-sheets")) {
      setConnectedDestinations((prev) => [...prev, activeDestination as DestinationType]);
    }
  };

  const handleCheckboxChange = (id: DestinationType, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connectedDestinations.includes(id)) {
      setConnectedDestinations((prev) => prev.filter((s) => s !== id));
    }
  };

  const isConnected = (id: DestinationType) => connectedDestinations.includes(id);
  const hasConnectedDestination = connectedDestinations.length > 0;

  return (
    <>
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-4">
          <span>Step 1</span>
          <span className="text-primary/60">•</span>
          <span>Choose your destination</span>
        </div>

        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
          Where should we keep things organized?
        </h1>
        <p className="text-muted-foreground mb-8">
          Connect your preferred destination to sync your structured thoughts.
        </p>

        <div className="space-y-3 mb-8">
          {outputOptions.map((option) => {
            const connected = isConnected(option.id);
            const isComingSoon = option.comingSoon;

            return (
              <div
                key={option.id}
                onClick={() => !isComingSoon && handleConnectClick(option.id)}
                className={cn(
                  "w-full p-5 rounded-2xl border-2 bg-card transition-all duration-300 text-left relative",
                  connected
                    ? "border-primary bg-primary/5 shadow-md cursor-pointer"
                    : isComingSoon
                    ? "border-border opacity-60 cursor-not-allowed"
                    : "border-border hover:border-primary/30 hover:bg-accent cursor-pointer"
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
                      connected ? "bg-primary/20" : "bg-primary/10"
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
                  ) : isComingSoon ? (
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <span>Coming soon</span>
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
          onClick={onContinue}
          disabled={!hasConnectedDestination}
          className="w-full h-14 text-lg font-semibold rounded-xl mb-4"
        >
          Continue
        </Button>

        <p className="text-sm text-muted-foreground">
          You can configure columns anytime from your dashboard.
        </p>
      </div>

      <IntegrationWizardDialog
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        integration={activeDestination}
        onConnect={handleWizardConnect}
      />
    </>
  );
};

export default OutputDestinationScreen;
