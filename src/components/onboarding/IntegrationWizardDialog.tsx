import { useState } from "react";
import { 
  MessageSquare, 
  MessageCircle, 
  Mail, 
  FileText,
  Table,
  Bot, 
  Smile, 
  Download, 
  Forward,
  Copy,
  Check,
  ExternalLink,
  Hash,
  AtSign,
  Database,
  Link,
  Send as SendIcon,
  LogIn,
  UserPlus
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { API_BASE_URL } from "@/lib/config";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export type IntegrationType = "slack" | "whatsapp" | "email" | "notion" | "google-sheets";

interface IntegrationWizardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integration: IntegrationType | null;
  onConnect: () => void;
}

interface StepItemProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  accentColor?: string;
}

const StepItem = ({ icon, title, description, accentColor = "bg-primary/10 text-primary" }: StepItemProps) => (
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

// Notion Action & Steps
const NotionContent = ({ onConnect, isConnecting }: { onConnect: () => void; isConnecting: boolean }) => {
  const handleNotionConnect = () => {
    // Get user email from localStorage
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      console.error("User email not found. Please login first.");
      return;
    }
    
    // Redirect to backend Notion OAuth endpoint with returnTo parameter
    const returnTo = window.location.pathname; // /onboarding
    window.location.href = `${API_BASE_URL}/connect/notion?user_email=${encodeURIComponent(userEmail)}&returnTo=${encodeURIComponent(returnTo)}`;
  };

  return (
    <>
      {/* Action Area */}
      <div className="p-6 bg-card">
        <Button
          onClick={handleNotionConnect}
          disabled={isConnecting}
          className="w-full h-12 font-semibold bg-foreground hover:bg-foreground/90 text-background"
        >
          {isConnecting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Connecting...
            </span>
          ) : (
            <>
              <Database className="w-5 h-5 mr-2" />
              Connect Notion
            </>
          )}
        </Button>
      </div>

    <Separator />

    {/* How to Setup & Use */}
    <div className="p-6 bg-muted/30">
      <h3 className="text-sm font-semibold text-foreground mb-4">Setup Steps</h3>
      <div className="space-y-4">
        <StepItem
          icon={<LogIn className="w-4 h-4" />}
          title="Login"
          description="Authorize your Notion account."
        />
        <StepItem
          icon={<Database className="w-4 h-4" />}
          title="Select Database"
          description="Choose the specific database where you want your thoughts to appear."
        />
        <StepItem
          icon={<UserPlus className="w-4 h-4" />}
          title="Add Connection"
          description={<>Click <span className="font-medium">"Add connections"</span> in the database settings to allow our integration to write to it.</>}
        />
      </div>
    </div>
  </>
  );
};

// Google Sheets Action & Steps
const GoogleSheetsContent = ({ onConnect, isConnecting }: { onConnect: () => void; isConnecting: boolean }) => {
  const handleGSheetConnect = () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      console.error("User email not found. Please login first.");
      return;
    }
    const returnTo = window.location.pathname;
    window.location.href = `${API_BASE_URL}/gsheets/connect?user_email=${encodeURIComponent(userEmail)}&returnTo=${encodeURIComponent(returnTo)}`;
  };

  return (
    <>
      {/* Action Area */}
      <div className="p-6 bg-card">
        <Button
          onClick={handleGSheetConnect}
          disabled={isConnecting}
          className="w-full h-12 font-semibold bg-[#0F9D58] hover:bg-[#0F9D58]/90 text-white"
        >
          {isConnecting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Connecting...
            </span>
          ) : (
            <>
              <Table className="w-5 h-5 mr-2" />
              Connect Google Sheets
            </>
          )}
        </Button>
      </div>

      <Separator />

      {/* How to Setup & Use */}
      <div className="p-6 bg-muted/30">
        <h3 className="text-sm font-semibold text-foreground mb-4">Setup Steps</h3>
        <div className="space-y-4">
          <StepItem
            icon={<LogIn className="w-4 h-4" />}
            title="Sign In"
            description="Authorize with your Google account for Sheets access."
            accentColor="bg-[#0F9D58]/10 text-[#0F9D58]"
          />
          <StepItem
            icon={<Table className="w-4 h-4" />}
            title="Configure Later"
            description="After connecting, configure your spreadsheet and columns from the dashboard."
            accentColor="bg-[#0F9D58]/10 text-[#0F9D58]"
          />
        </div>
      </div>
    </>
  );
};

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
            Installing...
          </span>
        ) : (
          <>
            <Download className="w-5 h-5 mr-2" />
            Install App
          </>
        )}
      </Button>
    </div>

    <Separator />

    {/* How to Setup & Use */}
    <div className="p-6 bg-muted/30">
      <h3 className="text-sm font-semibold text-foreground mb-4">How it Works</h3>
      <div className="space-y-4">
        <StepItem
          icon={<Download className="w-4 h-4" />}
          title="Install"
          description={<>Click on <span className="font-medium">"Install"</span> above to add our app to your workspace.</>}
          accentColor="bg-[#4A154B]/10 text-[#4A154B]"
        />
        <StepItem
          icon={<Bot className="w-4 h-4" />}
          title="Direct Message"
          description="DM the bot to save private thoughts."
          accentColor="bg-[#4A154B]/10 text-[#4A154B]"
        />
        <StepItem
          icon={<Smile className="w-4 h-4" />}
          title="Emoji Trigger"
          description={<>React with a saved emoji (e.g., 💾) to save any message.</>}
          accentColor="bg-[#4A154B]/10 text-[#4A154B]"
        />
        <StepItem
          icon={<AtSign className="w-4 h-4" />}
          title="Tagging"
          description="Mention the bot in a channel to save that specific conversation."
          accentColor="bg-[#4A154B]/10 text-[#4A154B]"
        />
      </div>
    </div>
  </>
);

// Email Action & Steps (Gmail OAuth)
const EmailContent = ({ onConnect, isConnecting }: { onConnect: () => void; isConnecting: boolean }) => {
  const handleGmailConnect = () => {
    // Check if user email exists in localStorage (returning user)
    const storedEmail = localStorage.getItem("userEmail");
    // Redirect to backend OAuth endpoint with returnTo parameter
    // This ensures we return to onboarding after OAuth completes
    const returnTo = window.location.pathname; // e.g., /onboarding
    const url = storedEmail
      ? `${API_BASE_URL}/auth/google?returnTo=${encodeURIComponent(returnTo)}&user_email=${encodeURIComponent(storedEmail)}`
      : `${API_BASE_URL}/auth/google?returnTo=${encodeURIComponent(returnTo)}`;
    window.location.href = url;
    // Note: onConnect will be called after OAuth callback redirects back
  };

  return (
    <>
      {/* Action Area */}
      <div className="p-6 bg-card">
        <Button
          onClick={handleGmailConnect}
          disabled={isConnecting}
          className="w-full h-12 font-semibold bg-[#EA4335] hover:bg-[#d33b2c] text-white"
        >
          {isConnecting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Connecting...
            </span>
          ) : (
            <>
              <Mail className="w-5 h-5 mr-2" />
              Connect Gmail
            </>
          )}
        </Button>
      </div>

      <Separator />

      {/* How to Setup & Use */}
      <div className="p-6 bg-muted/30">
        <h3 className="text-sm font-semibold text-foreground mb-4">Setup Steps</h3>
        <div className="space-y-4">
          <StepItem
            icon={<LogIn className="w-4 h-4" />}
            title="Sign In"
            description="Click 'Connect Gmail' to sign in with your Google account."
            accentColor="bg-[#EA4335]/10 text-[#EA4335]"
          />
          <StepItem
            icon={<Mail className="w-4 h-4" />}
            title="Authorize Access"
            description="Grant permission to read your Gmail inbox (read-only access)."
            accentColor="bg-[#EA4335]/10 text-[#EA4335]"
          />
          <StepItem
            icon={<Hash className="w-4 h-4" />}
            title="Apply Label"
            description={<>Apply the label <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">mentaltabs</span> to any email you want synced to Notion.</>}
            accentColor="bg-[#EA4335]/10 text-[#EA4335]"
          />
        </div>
      </div>
    </>
  );
};

// WhatsApp Action & Steps
const WhatsAppContent = ({ onConnect, isConnecting }: { onConnect: () => void; isConnecting: boolean }) => {
  const whatsappNumber = "+15550199";
  const prefilledMessage = "Hi! I want to connect my account to Mental Tabs.";
  const waLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(prefilledMessage)}`;

  const handleSendMessage = () => {
    window.open(waLink, "_blank");
    onConnect();
  };

  return (
    <>
      {/* Action Area */}
      <div className="p-6 bg-card">
        <Button
          onClick={handleSendMessage}
          disabled={isConnecting}
          className="w-full h-12 font-semibold bg-[#25D366] hover:bg-[#1da851] text-white"
        >
          {isConnecting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Connecting...
            </span>
          ) : (
            <>
              <ExternalLink className="w-5 h-5 mr-2" />
              Send Connection Message
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Opens WhatsApp with a pre-filled message
        </p>
      </div>

      <Separator />

      {/* How to Setup & Use */}
      <div className="p-6 bg-muted/30">
        <h3 className="text-sm font-semibold text-foreground mb-4">How it Works</h3>
        <div className="space-y-4">
          <StepItem
            icon={<SendIcon className="w-4 h-4" />}
            title="Initiate"
            description="Click the button above. It will open WhatsApp with a pre-filled message."
            accentColor="bg-[#25D366]/10 text-[#25D366]"
          />
          <StepItem
            icon={<MessageCircle className="w-4 h-4" />}
            title="Send"
            description={<>Send that message to the number <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">+1 555-0199</span>.</>}
            accentColor="bg-[#25D366]/10 text-[#25D366]"
          />
          <StepItem
            icon={<Forward className="w-4 h-4" />}
            title="Save"
            description="Once verified, you can text, voice note, or forward messages to this chat to save them."
            accentColor="bg-[#25D366]/10 text-[#25D366]"
          />
        </div>
      </div>
    </>
  );
};

const integrationConfigs = {
  notion: {
    icon: FileText,
    title: "Connect Your Notion",
    iconBg: "bg-foreground/10",
    iconColor: "text-foreground",
    isDestination: true,
  },
  "google-sheets": {
    icon: Table,
    title: "Connect Google Sheets",
    iconBg: "bg-[#0F9D58]/10",
    iconColor: "text-[#0F9D58]",
    isDestination: true,
  },
  slack: {
    icon: MessageSquare,
    title: "Connect Slack",
    iconBg: "bg-[#4A154B]/10",
    iconColor: "text-[#4A154B]",
    isDestination: false,
  },
  whatsapp: {
    icon: MessageCircle,
    title: "Connect WhatsApp",
    iconBg: "bg-[#25D366]/10",
    iconColor: "text-[#25D366]",
    isDestination: false,
  },
  email: {
    icon: Mail,
    title: "Connect Email",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    isDestination: false,
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
            <div>
              <DialogTitle className="text-xl font-display">
                {config.title}
              </DialogTitle>
              {config.isDestination && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full mt-1 inline-block">
                  Destination
                </span>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Content based on integration type */}
        {integration === "notion" && <NotionContent onConnect={handleConnect} isConnecting={isConnecting} />}
        {integration === "google-sheets" && <GoogleSheetsContent onConnect={handleConnect} isConnecting={isConnecting} />}
        {integration === "slack" && <SlackContent onConnect={handleConnect} isConnecting={isConnecting} />}
        {integration === "whatsapp" && <WhatsAppContent onConnect={handleConnect} isConnecting={isConnecting} />}
        {integration === "email" && <EmailContent onConnect={handleConnect} isConnecting={isConnecting} />}
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationWizardDialog;
