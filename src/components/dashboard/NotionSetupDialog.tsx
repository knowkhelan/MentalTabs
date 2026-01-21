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
import { API_BASE_URL } from "@/lib/config";
import { apiGet, apiPost } from "@/lib/api";
import { Database, Loader2, CheckCircle2, Info, ArrowRight, ArrowLeft, FileText } from "lucide-react";

interface NotionPage {
  id: string;
  properties?: {
    title?: {
      title?: Array<{
        plain_text?: string;
      }>;
    };
  };
  title?: Array<{
    plain_text?: string;
  }>;
}

interface NotionSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string | null;
  onComplete: () => void;
}

type Step = "check-existing" | "existing-database" | "select-page" | "configure-columns" | "creating" | "success";

const columnOptions = [
  {
    id: "title",
    label: "Title",
    description: "Main title of the entry (required)",
    required: true,
    icon: "📝",
  },
  {
    id: "status",
    label: "Status",
    description: "Task status (ToDo, In Progress, Done, On Hold)",
    required: false,
    icon: "📊",
  },
  {
    id: "type",
    label: "Type",
    description: "Entry type (Task, Thought, Idea, Q&A)",
    required: false,
    icon: "🏷️",
  },
  {
    id: "source",
    label: "Source",
    description: "Where the entry came from (Email, Slack, WhatsApp)",
    required: false,
    icon: "📥",
  },
  {
    id: "date_created",
    label: "Date Created",
    description: "When the entry was created",
    required: false,
    icon: "📅",
  },
  {
    id: "due_date",
    label: "Due Date",
    description: "When the task is due",
    required: false,
    icon: "⏰",
  },
  {
    id: "notes",
    label: "Notes",
    description: "Additional notes or content",
    required: false,
    icon: "📄",
  },
];

const NotionSetupDialog = ({
  open,
  onOpenChange,
  userEmail,
  onComplete,
}: NotionSetupDialogProps) => {
  const [step, setStep] = useState<Step>("check-existing");
  const [hasExistingDatabase, setHasExistingDatabase] = useState(false);
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [databaseTitle, setDatabaseTitle] = useState<string>("MentalTabs Database");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "title",
    "status",
    "source",
    "date_created",
    "notes",
  ]);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing database when dialog opens
  useEffect(() => {
    if (open && userEmail) {
      checkExistingDatabase();
    }
  }, [open, userEmail]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setStep("check-existing");
      setHasExistingDatabase(false);
      setSelectedPageId("");
      setDatabaseTitle("MentalTabs Database");
      setSelectedColumns(["title", "status", "source", "date_created", "notes"]);
      setError(null);
    }
  }, [open]);

  const checkExistingDatabase = async () => {
    setCheckingStatus(true);
    setError(null);
    setStep("check-existing");

    try {
      const data = await apiGet("/notion/status");
      
      if (data.status === "ok" && data.configured && data.database_id) {
        setHasExistingDatabase(true);
        setStep("existing-database");
      } else {
        setHasExistingDatabase(false);
        setStep("select-page");
        fetchNotionPages();
      }
    } catch (err) {
      console.error("Error checking database status:", err);
      // If check fails, proceed to setup flow
      setHasExistingDatabase(false);
      setStep("select-page");
      fetchNotionPages();
    } finally {
      setCheckingStatus(false);
    }
  };

  const fetchNotionPages = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiGet("/get-notion-pages");
      
      if (data.status === "ok" && data.data?.results) {
        setPages(data.data.results);
      } else {
        throw new Error("No pages found");
      }
    } catch (err) {
      console.error("Error fetching Notion pages:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch Notion pages");
    } finally {
      setLoading(false);
    }
  };

  const getPageTitle = (page: NotionPage): string => {
    if (page.properties?.title?.title?.[0]?.plain_text) {
      return page.properties.title.title[0].plain_text;
    }
    if (page.title?.[0]?.plain_text) {
      return page.title[0].plain_text;
    }
    return "Untitled Page";
  };

  const handleColumnToggle = (columnId: string) => {
    if (columnId === "title") return; // Title is always required

    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((c) => c !== columnId)
        : [...prev, columnId]
    );
  };

  const handleCreateDatabase = async () => {
    if (!selectedPageId) {
      setError("Please select a page");
      return;
    }

    setStep("creating");
    setError(null);

    try {
      const data = await apiPost("/create-notion-database", {
        page_id: selectedPageId,
        title: databaseTitle,
        description: "Database for MentalTabs to store your thoughts, tasks, and ideas",
        columns: selectedColumns,
      });

      if (data.status === "ok") {
        setStep("success");
        setTimeout(() => {
          onComplete();
          onOpenChange(false);
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to create database");
      }
    } catch (err) {
      console.error("Error creating database:", err);
      setError(err instanceof Error ? err.message : "Failed to create database");
      setStep("configure-columns");
    }
  };

  const handleCreateNew = () => {
    setHasExistingDatabase(false);
    setStep("select-page");
    fetchNotionPages();
  };

  const handleNext = () => {
    if (step === "select-page") {
      if (!selectedPageId) {
        setError("Please select a page");
        return;
      }
      setStep("configure-columns");
      setError(null);
    } else if (step === "configure-columns") {
      handleCreateDatabase();
    }
  };

  const handleBack = () => {
    if (step === "configure-columns") {
      setStep("select-page");
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-3 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <span>Setup Notion Database</span>
          </DialogTitle>
          <DialogDescription className="text-base">
            {step === "check-existing" && "Checking your Notion configuration..."}
            {step === "existing-database" && "You already have a database configured"}
            {step === "select-page" && "Choose where to create your new database"}
            {step === "configure-columns" && "Customize your database columns"}
            {step === "creating" && "Creating your database..."}
            {step === "success" && "Database created successfully!"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {step === "check-existing" && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Checking your Notion setup...</p>
            </div>
          )}

          {step === "existing-database" && (
            <div className="space-y-6">
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-900 dark:text-blue-100">
                  You already have a Notion database configured. Creating a new database will replace your current configuration.
                </AlertDescription>
              </Alert>

              <Card className="border-2 border-dashed">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Database className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base mb-1">Existing Database</h3>
                      <p className="text-sm text-muted-foreground">
                        Your current database is active and ready to use. You can continue using it or create a new one with different settings.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleCreateNew}
                  className="w-full h-12 text-base font-medium"
                  variant="default"
                >
                  Create New Database
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={() => onOpenChange(false)}
                  className="w-full"
                  variant="outline"
                >
                  Keep Current Database
                </Button>
              </div>
            </div>
          )}

          {step === "select-page" && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="database-title" className="text-sm font-semibold">
                  Database Name
                </Label>
                <Input
                  id="database-title"
                  value={databaseTitle}
                  onChange={(e) => setDatabaseTitle(e.target.value)}
                  placeholder="MentalTabs Database"
                  className="h-11 text-base"
                />
                <p className="text-xs text-muted-foreground">
                  This will be the name of your database in Notion
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Select a Notion Page</Label>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : pages.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="pt-6 text-center">
                      <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        No pages found. Please create a page in Notion first.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="max-h-[320px] overflow-y-auto space-y-2 border rounded-xl p-3 bg-muted/30">
                    {pages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => {
                          setSelectedPageId(page.id);
                          setError(null);
                        }}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                          selectedPageId === page.id
                            ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                            : "bg-background hover:bg-accent border border-transparent hover:border-border"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            selectedPageId === page.id ? "bg-primary-foreground" : "bg-primary"
                          }`} />
                          <span className="font-medium">{getPageTitle(page)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === "configure-columns" && (
            <div className="space-y-4">
              <div className="mb-2">
                <p className="text-sm text-muted-foreground">
                  Select the columns you want in your database. Title is always included.
                </p>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
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
                                <span className="ml-1.5 text-xs text-primary font-normal">(required)</span>
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
          )}

          {step === "creating" && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <Loader2 className="w-16 h-16 animate-spin text-primary" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Database className="w-6 h-6 text-primary/50" />
                </div>
              </div>
              <p className="text-base font-medium mt-6 mb-2">Creating your database...</p>
              <p className="text-sm text-muted-foreground">This may take a few seconds</p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-lg font-semibold mb-2">Database created successfully!</p>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Your Notion database is ready to receive your thoughts, tasks, and ideas.
              </p>
            </div>
          )}

          {error && step !== "creating" && step !== "success" && step !== "check-existing" && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="border-t pt-4 mt-4">
          {step === "existing-database" && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Keep Current
              </Button>
              <Button onClick={handleCreateNew} className="flex-1">
                Create New
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
          {step === "select-page" && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleNext} disabled={!selectedPageId || loading} className="min-w-[100px]">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
          {step === "configure-columns" && (
            <>
              <Button variant="outline" onClick={handleBack} className="min-w-[100px]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={selectedColumns.length === 0} className="min-w-[140px]">
                Create Database
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
          {(step === "creating" || step === "success" || step === "check-existing") && (
            <div className="w-full flex justify-end">
              <Button variant="outline" disabled>
                {step === "check-existing" && "Checking..."}
                {step === "creating" && "Creating..."}
                {step === "success" && "Done"}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotionSetupDialog;
