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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { apiPost } from "@/lib/api";

interface GmailLabelVerifyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerifySuccess: () => void;
}

interface VerifyLabelResponse {
  is_label_created: boolean;
}

const GmailLabelVerifyDialog = ({
  open,
  onOpenChange,
  onVerifySuccess,
}: GmailLabelVerifyDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setError(null);
      setShowSuccess(false);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleVerifyLabel = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const data: VerifyLabelResponse = await apiPost("/auth/gmail/verify-label/");
      
      if (data.is_label_created) {
        setShowSuccess(true);
        // Call success callback after a brief delay to show success message
        setTimeout(() => {
          onVerifySuccess();
          onOpenChange(false);
        }, 1500);
      } else {
        setError("Label is not yet created. Please create the label and then verify again.");
      }
    } catch (err) {
      console.error("Error verifying label:", err);
      setError(err instanceof Error ? err.message : "Failed to verify label. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setShowSuccess(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <span>Gmail Label Setup</span>
          </DialogTitle>
          <DialogDescription className="text-base">
            {showSuccess ? "Label verified successfully!" : "Configure your Gmail account"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center">
                Label Verified Successfully
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Your Gmail account is now fully configured.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-900 dark:text-blue-100">
                  You need to create a label with the name <strong>"mentaltabs"</strong> on your Gmail account.
                </AlertDescription>
              </Alert>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4 mt-4">
          {showSuccess ? (
            <Button onClick={handleClose} className="w-full">
              Got it
            </Button>
          ) : (
            <div className="flex justify-end w-full">
              <Button
                onClick={handleVerifyLabel}
                disabled={isSubmitting}
                className="ml-auto"
              >
                {isSubmitting ? "Verifying..." : "Label Created"}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GmailLabelVerifyDialog;
