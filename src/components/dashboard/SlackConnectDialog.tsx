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
import { MessageSquare, ExternalLink, Info } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";
import { apiPost } from "@/lib/api";

interface SlackConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string | null;
  connectionUrl?: string | null;
  slackEmailAddress?: string | null;
  onConnect: (response: SlackConnectResponse, email: string) => void;
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
}: SlackConnectDialogProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slackResponse, setSlackResponse] = useState<SlackConnectResponse | null>(null);

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

      // If workspace is registered (fully configured), close dialog
      if (data.is_registered) {
        setIsSubmitting(false);
        setEmail("");
        onOpenChange(false);
      } else {
        setIsSubmitting(false);
        // Dialog stays open to show configuration UI
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
              ((slackResponse && !slackResponse.is_registered) || (connectionUrl && !slackResponse)) ? 
              "Connect Slack App with Workspace": "Enter the email address of your slack workspace."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {(slackResponse && !slackResponse.is_registered) || (connectionUrl && !slackResponse) ? (
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
                  You need to connect the slack app to your workspace of above email address.
                </AlertDescription>
              </Alert>
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
                This email will be used to connect your Slack workspace.
              </p>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4 mt-4">
          {(slackResponse && !slackResponse.is_registered) || (connectionUrl && !slackResponse) ? (
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
