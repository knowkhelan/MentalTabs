import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, ExternalLink, Info, CheckCircle2 } from "lucide-react";
import { apiPost } from "@/lib/api";

interface SlackConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string | null;
  connectionUrl?: string | null;
  slackEmailAddress?: string | null;
  onConnect: (response: SlackConnectResponse, email: string) => void;
  isOnboarding?: boolean; // If true, stop after connection and show message instead of configuration
}

export interface SlackConnectResponse {
  domain: string;
  is_registered: boolean;
  workspace_id: string;
  connection_url?: string | null;
}

const SlackConnectDialog = ({
  open,
  onOpenChange,
  userEmail,
  connectionUrl,
  slackEmailAddress,
  onConnect,
  isOnboarding = false,
}: SlackConnectDialogProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slackResponse, setSlackResponse] = useState<SlackConnectResponse | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Pre-fill email when dialog opens with slackEmailAddress
  useEffect(() => {
    if (open && slackEmailAddress) {
      setEmail(slackEmailAddress);
    }
  }, [open, slackEmailAddress]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setEmail("");
      setError(null);
      setSlackResponse(null);
      setShowSuccessMessage(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!email.trim() || !userEmail) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSlackResponse(null);

    try {
      const data: SlackConnectResponse = await apiPost("/slack/connect", {
        slack_email_address: email.trim(),
      });
      setSlackResponse(data);

      // Update Dashboard state with connection response
      // is_registered: true = fully connected and configured
      // is_registered: false = connected but needs app installation (configuration step)
      onConnect(data, email.trim());

      // If onboarding, show success message (don't show configuration)
      if (isOnboarding) {
        setIsSubmitting(false);
        setShowSuccessMessage(true);
        return;
      }

      // If workspace is registered (fully configured), close dialog
      if (data.is_registered) {
        setIsSubmitting(false);
        setEmail("");
        onOpenChange(false);
      } else {
        setIsSubmitting(false);
        // Dialog stays open to show configuration UI (dashboard only)
      }
    } catch (err) {
      console.error("Error connecting Slack:", err);
      setError(err instanceof Error ? err.message : "Failed to connect Slack workspace");
      setIsSubmitting(false);
    }
  };

  const handleConnectApp = () => {
    // Use connection_url from API response or prop
    const slackAppUrl = slackResponse?.connection_url || connectionUrl || "https://slack.com/apps";
    window.location.href = slackAppUrl;
  };

  const handleClose = () => {
    setEmail("");
    setError(null);
    setSlackResponse(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <span>Connect Slack</span>
          </DialogTitle>
          <DialogDescription className="text-base">
            {
              showSuccessMessage ? 
              "" : 
              ((slackResponse && !slackResponse.is_registered && !isOnboarding) || (connectionUrl && !slackResponse && !isOnboarding)) ? 
              "Connect Slack App with Workspace": 
              "Enter the email address of your slack workspace."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {showSuccessMessage && slackResponse ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center">
                {slackResponse.is_registered
                  ? "All steps of Slack are completed for you"
                  : "Slack connected successfully"}
              </h3>
              {!slackResponse.is_registered && (
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  Configuration needs to be done after going on the dashboard.
                </p>
              )}
            </div>
          ) : (slackResponse && !slackResponse.is_registered && !isOnboarding) || (connectionUrl && !slackResponse && !isOnboarding) ? (
            <div className="space-y-4">
              <Label htmlFor="slack-email" className="text-sm">
                Workspace Email
              </Label>
              <Input
                id="slack-email"
                type="email"
                value={slackEmailAddress}
                className="h-11 text-base bg-gray-100"
                disabled={true}
              />
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-900 dark:text-blue-100">
                  Click "Connect App" below to install the MentalTabs app to your workspace
                </AlertDescription>
              </Alert>

              <div className="mt-4 p-3 bg-muted rounded-lg">
                <h4 className="font-semibold text-sm mb-2">How to Use After Installation:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-semibold text-foreground">Option 1:</span>
                    <span>Type <span className="font-mono text-xs bg-background px-1.5 py-0.5 rounded">/mentaltabs [your text]</span> in any channel or DM</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-foreground">Option 2:</span>
                    <span>Right-click any message → Apps → Send to MentalTabs</span>
                  </li>
                  <li className="flex gap-2 mt-2">
                    <span>•</span>
                    <span>All captured items will appear in your Notion database with a link back to the original Slack message</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Label htmlFor="slack-email" className="text-sm font-semibold">
                Workspace Email
              </Label>
              <Input
                id="slack-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="workspace@example.com"
                className="h-11 text-base"
                disabled={isSubmitting || !!slackEmailAddress}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && email.trim() && !isSubmitting) {
                    handleSubmit();
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Enter the email address associated with your Slack workspace
              </p>

              <div className="mt-4 p-3 bg-muted rounded-lg">
                <h4 className="font-semibold text-sm mb-2">What happens next:</h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-semibold text-foreground">1.</span>
                    <span>We'll verify if MentalTabs is installed in your workspace</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-foreground">2.</span>
                    <span>If not installed, you'll get a link to add it to your workspace</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-foreground">3.</span>
                    <span>Once connected, you can use <span className="font-mono text-xs bg-background px-1.5 py-0.5 rounded">/mentaltabs</span> or right-click messages to capture thoughts</span>
                  </li>
                </ol>
              </div>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4 mt-4">
          {showSuccessMessage ? (
            <Button onClick={handleClose} className="w-full">
              Got it
            </Button>
          ) : (slackResponse && !slackResponse.is_registered && !isOnboarding) || (connectionUrl && !slackResponse && !isOnboarding) ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleConnectApp}
              >
                Connect App
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!email.trim() || isSubmitting || !userEmail}
              >
                {isSubmitting ? "Connecting..." : "Connect"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SlackConnectDialog;
