import { useState } from "react";
import { 
  MessageSquare, 
  MessageCircle, 
  Mail, 
  QrCode, 
  Bot, 
  Smile, 
  Download, 
  Send as SendIcon, 
  Hash, 
  ScanLine, 
  ShieldCheck, 
  Forward,
  Copy,
  Check,
  ExternalLink
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type IntegrationType = "slack" | "whatsapp" | "email";

interface IntegrationWizardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integration: IntegrationType | null;
  onConnect: () => void;
}

interface StepItemProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  accentColor?: string;
}

const StepItem = ({ number, icon, title, description, accentColor = "bg-primary/10 text-primary" }: StepItemProps) => (
  <div className="flex gap-3">
    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", accentColor)}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-foreground text-sm">{title}</h4>
      <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
    </div>
  </div>
);

// Slack Action & Steps
const SlackContent = ({ onConnect, isConnecting }: { onConnect: () => void; isConnecting: boolean }) => (
  <>
    {/* Action Area */}
    <div className="p-6 bg-card">
      <Button
        onClick={onConnect}
        disabled={isConnecting}
        className="w-full h-12 font-semibold bg-[#4A154B] hover:bg-[#3a1139] text-white"
      >
        {isConnecting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Authorizing...
          </span>
        ) : (
          <>
            <MessageSquare className="w-5 h-5 mr-2" />
            Authorize Slack Bot
          </>
        )}
      </Button>
    </div>

    <Separator />

    {/* How to Setup & Use */}
    <div className="p-6 bg-muted/30">
      <h3 className="text-sm font-semibold text-foreground mb-4">How to Setup & Use</h3>
      <div className="space-y-4">
        <StepItem
          number={1}
          icon={<Download className="w-4 h-4" />}
          title="Install"
          description="Click the button above to add our bot to your workspace."
          accentColor="bg-[#4A154B]/10 text-[#4A154B]"
        />
        <StepItem
          number={2}
          icon={<Bot className="w-4 h-4" />}
          title="Direct Save"
          description={<>Simply send a DM to <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">@NotionBot</span> to save thoughts privately.</>}
          accentColor="bg-[#4A154B]/10 text-[#4A154B]"
        />
        <StepItem
          number={3}
          icon={<Smile className="w-4 h-4" />}
          title="Emoji Trigger"
          description={<>React to <em>any</em> message in your channels with the 💾 emoji (or a custom one you choose) to instantly save it to your database.</>}
          accentColor="bg-[#4A154B]/10 text-[#4A154B]"
        />
      </div>
    </div>
  </>
);

// Email Action & Steps
const EmailContent = ({ onConnect, isConnecting }: { onConnect: () => void; isConnecting: boolean }) => {
  const [copied, setCopied] = useState(false);
  const generatedEmail = "save+user123@mentaltabs.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    toast({ title: "Email copied!", description: "Address copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Action Area */}
      <div className="p-6 bg-card">
        <p className="text-sm text-muted-foreground mb-3 text-center">Your unique capture address:</p>
        <div className="flex items-center gap-2 bg-muted rounded-lg p-3 border">
          <Mail className="w-5 h-5 text-primary flex-shrink-0" />
          <span className="font-mono text-sm text-foreground flex-1 truncate">{generatedEmail}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="flex-shrink-0 h-8 px-3"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
        <Button
          onClick={onConnect}
          disabled={isConnecting}
          className="w-full h-10 mt-3 font-medium"
        >
          {isConnecting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Activating...
            </span>
          ) : (
            "Activate Email Capture"
          )}
        </Button>
      </div>

      <Separator />

      {/* How to Setup & Use */}
      <div className="p-6 bg-muted/30">
        <h3 className="text-sm font-semibold text-foreground mb-4">How to Setup & Use</h3>
        <div className="space-y-4">
          <StepItem
            number={1}
            icon={<Download className="w-4 h-4" />}
            title="Save Contact"
            description={<>Add the address above to your contacts as <span className="font-medium">"My Notion Brain"</span>.</>}
          />
          <StepItem
            number={2}
            icon={<SendIcon className="w-4 h-4" />}
            title="Direct Note"
            description="Send a new email to this address to create a new entry."
          />
          <StepItem
            number={3}
            icon={<Hash className="w-4 h-4" />}
            title="Smart Tagging"
            description={<>Forward any email to us. If you add the tag <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">#save</span> in the subject line or body, we will strip the rest and only save the tagged content.</>}
          />
        </div>
      </div>
    </>
  );
};

// WhatsApp Action & Steps
const WhatsAppContent = ({ onConnect, isConnecting }: { onConnect: () => void; isConnecting: boolean }) => (
  <>
    {/* Action Area */}
    <div className="p-6 bg-card">
      <div className="flex flex-col items-center gap-4">
        {/* QR Code */}
        <div className="w-36 h-36 bg-white rounded-xl flex items-center justify-center border-2 border-[#25D366]/20 shadow-sm">
          <QrCode className="w-24 h-24 text-[#25D366]" />
        </div>
        
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>or</span>
        </div>

        <Button
          onClick={onConnect}
          disabled={isConnecting}
          className="w-full h-11 font-semibold bg-[#25D366] hover:bg-[#1da851] text-white"
        >
          {isConnecting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Connecting...
            </span>
          ) : (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Click to Chat
            </>
          )}
        </Button>
      </div>
    </div>

    <Separator />

    {/* How to Setup & Use */}
    <div className="p-6 bg-muted/30">
      <h3 className="text-sm font-semibold text-foreground mb-4">How to Setup & Use</h3>
      <div className="space-y-4">
        <StepItem
          number={1}
          icon={<ScanLine className="w-4 h-4" />}
          title="Connect"
          description="Scan the QR code or click the link to open our chat."
          accentColor="bg-[#25D366]/10 text-[#25D366]"
        />
        <StepItem
          number={2}
          icon={<ShieldCheck className="w-4 h-4" />}
          title="Verify"
          description={<>Send the code <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">START</span> to confirm your number.</>}
          accentColor="bg-[#25D366]/10 text-[#25D366]"
        />
        <StepItem
          number={3}
          icon={<Forward className="w-4 h-4" />}
          title="Capture"
          description={<>Type a message, send a voice note, or <strong>Forward</strong> any message from another chat to us to save it instantly.</>}
          accentColor="bg-[#25D366]/10 text-[#25D366]"
        />
      </div>
    </div>
  </>
);

const integrationConfigs = {
  slack: {
    icon: MessageSquare,
    title: "Connect Slack Workspace",
    iconBg: "bg-[#4A154B]/10",
    iconColor: "text-[#4A154B]",
  },
  whatsapp: {
    icon: MessageCircle,
    title: "Connect WhatsApp",
    iconBg: "bg-[#25D366]/10",
    iconColor: "text-[#25D366]",
  },
  email: {
    icon: Mail,
    title: "Connect Email",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
};

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
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", config.iconBg)}>
              <IconComponent className={cn("w-6 h-6", config.iconColor)} />
            </div>
            <DialogTitle className="text-xl font-display">
              {config.title}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Content based on integration type */}
        {integration === "slack" && <SlackContent onConnect={handleConnect} isConnecting={isConnecting} />}
        {integration === "whatsapp" && <WhatsAppContent onConnect={handleConnect} isConnecting={isConnecting} />}
        {integration === "email" && <EmailContent onConnect={handleConnect} isConnecting={isConnecting} />}
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationWizardDialog;
