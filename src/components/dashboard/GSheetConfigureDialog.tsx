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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiGet, apiPost } from "@/lib/api";
import { FileSpreadsheet, Loader2, CheckCircle2, ExternalLink } from "lucide-react";

interface GSheetConfigureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

const columnOptions = [
  { id: "title", label: "Title", description: "Main title of the entry (required)", required: true, icon: "📝" },
  { id: "status", label: "Status", description: "Task status (ToDo, In Progress, Done, On Hold)", required: false, icon: "📊" },
  { id: "type", label: "Type", description: "Entry type (Task, Thought, Idea, Q&A)", required: false, icon: "🏷️" },
  { id: "source", label: "Source", description: "Where the entry came from (Email, Slack, WhatsApp)", required: false, icon: "📥" },
  { id: "date_created", label: "Date Created", description: "When the entry was created", required: false, icon: "📅" },
  { id: "due_date", label: "Due Date", description: "When the task is due", required: false, icon: "⏰" },
  { id: "notes", label: "Notes", description: "Additional notes or content", required: false, icon: "📄" },
];

const GSheetConfigureDialog = ({
  open,
  onOpenChange,
  onComplete,
}: GSheetConfigureDialogProps) => {
  const [spreadsheetTitle, setSpreadsheetTitle] = useState("MentalTabs Sheet");
  const [sheetName, setSheetName] = useState("Data");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "title",
    "source",
    "date_created",
    "notes",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [configuredData, setConfiguredData] = useState<{
    spreadsheet_name: string;
    sheet_name: string;
    spreadsheet_url: string;
  } | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  useEffect(() => {
    if (!open) {
      setSpreadsheetTitle("MentalTabs Sheet");
      setSheetName("Data");
      setSelectedColumns(["title", "source", "date_created", "notes"]);
      setSuccess(false);
      setError(null);
      setIsConfigured(false);
      setConfiguredData(null);
      return;
    }

    const fetchStatus = async () => {
      setIsLoadingStatus(true);
      try {
        const data = await apiGet<{
          configured: boolean;
          spreadsheet_name: string | null;
          sheet_name?: string;
          spreadsheet_url: string | null;
        }>("/gsheets/status");
        if (data.configured && data.spreadsheet_name && data.spreadsheet_url) {
          setIsConfigured(true);
          setConfiguredData({
            spreadsheet_name: data.spreadsheet_name,
            sheet_name: data.sheet_name || "Data",
            spreadsheet_url: data.spreadsheet_url,
          });
        } else {
          setIsConfigured(false);
          setConfiguredData(null);
        }
      } catch {
        setIsConfigured(false);
        setConfiguredData(null);
      } finally {
        setIsLoadingStatus(false);
      }
    };

    fetchStatus();
  }, [open]);

  const handleColumnToggle = (columnId: string) => {
    if (columnId === "title") return;
    setSelectedColumns((prev) =>
      prev.includes(columnId) ? prev.filter((c) => c !== columnId) : [...prev, columnId]
    );
  };

  const handleConfigure = async () => {
    if (!spreadsheetTitle.trim()) {
      setError("Spreadsheet title is required");
      return;
    }
    if (!sheetName.trim()) {
      setError("Sheet name is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const data = await apiPost("/gsheets/configure", {
        title: spreadsheetTitle.trim(),
        sheet_name: sheetName.trim(),
        columns: selectedColumns,
      });

      if (data.status === "ok") {
        setSuccess(true);
        setConfiguredData({
          spreadsheet_name: data.spreadsheet_title || spreadsheetTitle,
          sheet_name: data.sheet_name || sheetName,
          spreadsheet_url: data.spreadsheet_url,
        });
        setTimeout(() => {
          onComplete?.();
          onOpenChange(false);
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to configure");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to configure Google Sheet");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-3 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
            </div>
            <span>Configure Google Sheets</span>
          </DialogTitle>
          <DialogDescription className="text-base">
            {success
              ? "Spreadsheet created successfully!"
              : isConfigured
              ? "Your Google Sheet is configured. View details below."
              : "Create a new Google Sheet with your preferred title, sheet tab name, and columns."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {isLoadingStatus ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-16 h-16 animate-spin text-primary" />
              <p className="text-base font-medium mt-6 mb-2">Loading...</p>
            </div>
          ) : isSubmitting && !success ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-16 h-16 animate-spin text-primary" />
              <p className="text-base font-medium mt-6 mb-2">Creating your spreadsheet...</p>
              <p className="text-sm text-muted-foreground">This may take a few seconds</p>
            </div>
          ) : (success || isConfigured) && configuredData ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-muted-foreground">
                  Spreadsheet Title
                </Label>
                <p className="text-base font-medium">{configuredData.spreadsheet_name}</p>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-muted-foreground">
                  Sheet Name
                </Label>
                <p className="text-base font-medium">{configuredData.sheet_name}</p>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-muted-foreground">
                  Spreadsheet URL
                </Label>
                <a
                  href={configuredData.spreadsheet_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline text-sm break-all"
                >
                  {configuredData.spreadsheet_url}
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                </a>
                <p className="text-xs text-muted-foreground">
                  Click to open in a new tab
                </p>
              </div>
              {success && (
                <div className="flex flex-col items-center pt-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Spreadsheet created successfully!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="spreadsheet-title" className="text-sm font-semibold">
                  Spreadsheet Title
                </Label>
                <Input
                  id="spreadsheet-title"
                  value={spreadsheetTitle}
                  onChange={(e) => setSpreadsheetTitle(e.target.value)}
                  placeholder="MentalTabs Sheet"
                  className="h-11 text-base focus-visible:ring-inset"
                />
                <p className="text-xs text-muted-foreground">
                  This will be the name of your spreadsheet in Google Drive
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="sheet-name" className="text-sm font-semibold">
                  Sheet Name
                </Label>
                <Input
                  id="sheet-name"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  placeholder="Data"
                  className="h-11 text-base focus-visible:ring-inset"
                />
                <p className="text-xs text-muted-foreground">
                  Name of the first sheet tab in your spreadsheet
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Columns</Label>
                <p className="text-xs text-muted-foreground">
                  Select the columns you want in your sheet. Title is always included.
                </p>
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2">
                  {columnOptions.map((column) => (
                    <Card
                      key={column.id}
                      className={`transition-all duration-200 cursor-pointer ${
                        selectedColumns.includes(column.id)
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      } ${column.required ? "opacity-75" : ""}`}
                      onClick={() => !column.required && handleColumnToggle(column.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            id={column.id}
                            checked={selectedColumns.includes(column.id)}
                            onCheckedChange={() => handleColumnToggle(column.id)}
                            disabled={column.required}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{column.icon}</span>
                              <Label
                                htmlFor={column.id}
                                className={`cursor-pointer text-sm font-semibold ${
                                  column.required ? "text-muted-foreground" : ""
                                }`}
                              >
                                {column.label}
                                {column.required && (
                                  <span className="ml-1.5 text-xs text-primary font-normal">
                                    (required)
                                  </span>
                                )}
                              </Label>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {column.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        {!success && !isSubmitting && !isConfigured && (
          <DialogFooter className="border-t pt-4 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfigure}
              disabled={
                !spreadsheetTitle.trim() || !sheetName.trim() || selectedColumns.length === 0
              }
              className="min-w-[140px]"
            >
              Create Spreadsheet
            </Button>
          </DialogFooter>
        )}
        {(isConfigured || success) && (
          <DialogFooter className="border-t pt-4 mt-4">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GSheetConfigureDialog;
