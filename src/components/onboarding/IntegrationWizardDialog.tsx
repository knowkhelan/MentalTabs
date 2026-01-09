import { useState } from "react";
import { MessageSquare, MessageCircle, Mail, QrCode, Database, Send, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IntegrationType = "slack" | "whatsapp" | "email";

interface IntegrationWizardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integration: IntegrationType | null;
  onConnect: () => void;
}

const integrationConfigs = {
  slack: {
    icon: MessageSquare,
    title: "Connect Slack Workspace",
    description: "Capture thoughts without leaving your chats. Just DM our bot to save directly to Notion.",
    buttonText: "Authorize with Slack",
    buttonClassName: "bg-[#4A154B] hover:bg-[#3a1139] text-white",
  },
  whatsapp: {
    icon: MessageCircle,
    title: "Connect WhatsApp",
    description: "Send voice notes or text on the go. We'll automatically transcribe audio and sync it.",
    buttonText: "Generate Pairing Code",
    buttonClassName: "bg-[#25D366] hover:bg-[#1da851] text-white",
  },
  email: {
    icon: Mail,
    title: "Specific Email Setup",
    description: "Forward newsletters or simple notes to your dedicated capture address.",
    buttonText: "Create My Private Email",
    buttonClassName: "bg-primary hover:bg-primary/90 text-primary-foreground",
  },
};

const SlackVisual = () => (
  <div className="bg-muted/50 rounded-xl p-6 space-y-4">
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <span className="font-medium">How it works</span>
    </div>
    
    {/* Mock Slack UI */}
    <div className="bg-card rounded-lg border shadow-sm p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <div className="w-8 h-8 rounded-full bg-[#4A154B]/10 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-[#4A154B]" />
        </div>
        <span className="font-medium text-foreground">Mental Tabs Bot</span>
      </div>
      
      <div className="bg-muted/30 rounded-lg p-3 ml-10">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-background rounded border px-3 py-2 text-sm text-muted-foreground">
            Remember to call mom tomorrow...
          </div>
          <Button size="sm" className="bg-[#4A154B] hover:bg-[#3a1139] text-white h-8 px-3">
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground pt-2">
      <div className="flex items-center gap-2 bg-background rounded-full px-3 py-1.5 border">
        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">1</span>
        <span>Click Authorize</span>
      </div>
      <ArrowRight className="w-4 h-4" />
      <div className="flex items-center gap-2 bg-background rounded-full px-3 py-1.5 border">
        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">2</span>
        <span>DM our bot</span>
      </div>
    </div>
  </div>
);

const WhatsAppVisual = () => (
  <div className="bg-muted/50 rounded-xl p-6 space-y-4">
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <span className="font-medium">How it works</span>
    </div>

    {/* Mock QR Code UI */}
    <div className="bg-card rounded-lg border shadow-sm p-6 flex flex-col items-center gap-4">
      <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-[#25D366]/30">
        <QrCode className="w-16 h-16 text-[#25D366]/60" />
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Scan with WhatsApp to connect
      </p>
    </div>

    <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground pt-2">
      <div className="flex items-center gap-2 bg-background rounded-full px-3 py-1.5 border">
        <span className="w-5 h-5 rounded-full bg-[#25D366]/10 text-[#25D366] text-xs flex items-center justify-center font-medium">1</span>
        <span>Generate Code</span>
      </div>
      <ArrowRight className="w-4 h-4" />
      <div className="flex items-center gap-2 bg-background rounded-full px-3 py-1.5 border">
        <span className="w-5 h-5 rounded-full bg-[#25D366]/10 text-[#25D366] text-xs flex items-center justify-center font-medium">2</span>
        <span>Scan QR</span>
      </div>
    </div>
  </div>
);

const EmailVisual = () => (
  <div className="bg-muted/50 rounded-xl p-6 space-y-4">
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <span className="font-medium">How it works</span>
    </div>

    {/* Email to Database Flow */}
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground">Your Email</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-border" />
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
          <div className="w-8 h-0.5 bg-border" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-xl bg-secondary/30 flex items-center justify-center">
            <Database className="w-8 h-8 text-secondary-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">Your Notion</span>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground pt-2">
      <div className="flex items-center gap-2 bg-background rounded-full px-3 py-1.5 border">
        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">1</span>
        <span>Get Address</span>
      </div>
      <ArrowRight className="w-4 h-4" />
      <div className="flex items-center gap-2 bg-background rounded-full px-3 py-1.5 border">
        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">2</span>
        <span>Forward Emails</span>
      </div>
    </div>
  </div>
);

const IntegrationWizardDialog = ({
  open,
  onOpenChange,
  integration,
  onConnect,
}: IntegrationWizardDialogProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

  if (!integration) return null;

  const config = integrationConfigs[integration];
  const IconComponent = config.icon;

  const handleConnect = async () => {
    setIsConnecting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsConnecting(false);
    onConnect();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <div className="p-6 pb-4">
          <DialogHeader className="flex flex-col items-center text-center space-y-4">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center",
              integration === "slack" && "bg-[#4A154B]/10",
              integration === "whatsapp" && "bg-[#25D366]/10",
              integration === "email" && "bg-primary/10"
            )}>
              <IconComponent className={cn(
                "w-8 h-8",
                integration === "slack" && "text-[#4A154B]",
                integration === "whatsapp" && "text-[#25D366]",
                integration === "email" && "text-primary"
              )} />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-xl font-display">
                {config.title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {config.description}
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 pb-4">
          {integration === "slack" && <SlackVisual />}
          {integration === "whatsapp" && <WhatsAppVisual />}
          {integration === "email" && <EmailVisual />}
        </div>

        <div className="p-6 pt-2 border-t bg-muted/30">
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className={cn("w-full h-12 font-semibold", config.buttonClassName)}
          >
            {isConnecting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Connecting...
              </span>
            ) : (
              config.buttonText
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationWizardDialog;
