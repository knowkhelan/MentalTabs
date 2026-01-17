import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/config";
import { Loader2, Database, CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NotionSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail?: string;
  onComplete?: () => void;
}

interface NotionPage {
  id: string;
  object: string;
  properties: Record<string, any>;
  title?: Array<{ plain_text: string }>;
}

// Available column types
const AVAILABLE_COLUMNS = [
  { id: "title", name: "Title", required: true, description: "Main title of the entry" },
  { id: "status", name: "Status", required: false, description: "Task status (ToDo, In Progress, Done, On Hold)" },
  { id: "type", name: "Type", required: false, description: "Entry type (Task, Thought, Idea, Q&A)" },
  { id: "source", name: "Source", required: false, description: "Where the entry came from (Email, Slack, WhatsApp)" },
  { id: "date_created", name: "Date Created", required: false, description: "When the entry was created" },
  { id: "due_date", name: "Due Date", required: false, description: "When the task is due" },
  { id: "notes", name: "Notes", required: false, description: "Additional notes or content" },
];

export default function NotionSetupDialog({
  open,
  onOpenChange,
  userEmail,
  onComplete,
}: NotionSetupDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<"select_page" | "configure_columns" | "creating">("select_page");
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [databaseTitle, setDatabaseTitle] = useState("MentalTabs Database");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["title", "status", "source", "date_created", "notes"]);
  const [creating, setCreating] = useState(false);

  // Fetch Notion pages on mount
  useEffect(() => {
    if (open && step === "select_page") {
      fetchPages();
    }
  }, [open, step]);

  const fetchPages = async () => {
    if (!userEmail) {
      toast({
        title: "Error",
        description: "User email not found. Please login again.",
        variant: "destructive",
      });
      return;
    }

    setLoadingPages(true);
    try {
      const params = new URLSearchParams();
      params.append("user_email", userEmail);

      const response = await fetch(
        `${API_BASE_URL}/get-notion-pages?${params.toString()}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch Notion pages");
      }

      const pagesData = result.data?.results || [];
      setPages(pagesData);

      if (pagesData.length === 0) {
        toast({
          title: "No pages found",
          description: "Please create a page in Notion first where the database will be created.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error fetching pages:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch Notion pages",
        variant: "destructive",
      });
    } finally {
      setLoadingPages(false);
    }
  };

  const handleColumnToggle = (columnId: string) => {
    const column = AVAILABLE_COLUMNS.find((c) => c.id === columnId);
    if (column?.required) return; // Can't toggle required columns

    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleCreateDatabase = async () => {
    if (!selectedPageId) {
      toast({
        title: "Error",
        description: "Please select a page where the database will be created.",
        variant: "destructive",
      });
      return;
    }

    if (!userEmail) {
      toast({
        title: "Error",
        description: "User email not found. Please login again.",
        variant: "destructive",
      });
      return;
    }

    setStep("creating");
    setCreating(true);

    try {
      const params = new URLSearchParams();
      params.append("user_email", userEmail);

      const response = await fetch(
        `${API_BASE_URL}/create-notion-database?${params.toString()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page_id: selectedPageId,
            title: databaseTitle,
            description: "Database for MentalTabs - capturing thoughts, tasks, and ideas from various sources",
            columns: selectedColumns,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create database");
      }

      toast({
        title: "Success!",
        description: "Your Notion database has been created and configured.",
      });

      // Call onComplete callback
      if (onComplete) {
        onComplete();
      }

      // Close dialog after a short delay
      setTimeout(() => {
        onOpenChange(false);
        setStep("select_page");
        setSelectedPageId("");
        setSelectedColumns(["title", "status", "source", "date_created", "notes"]);
      }, 1500);
    } catch (error: any) {
      console.error("Error creating database:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create database",
        variant: "destructive",
      });
      setStep("configure_columns");
    } finally {
      setCreating(false);
    }
  };

  const getPageTitle = (page: NotionPage) => {
    // Try to get title from properties
    const titleProp = Object.values(page.properties || {}).find(
      (prop: any) => prop.type === "title"
    );
    if (titleProp && titleProp.title && titleProp.title[0]) {
      return titleProp.title[0].plain_text || "Untitled";
    }
    return "Untitled";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        {step === "select_page" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Setup Notion Database
              </DialogTitle>
              <DialogDescription>
                Select a page in your Notion workspace where the database will be created.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="page">Select Notion Page</Label>
                {loadingPages ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <Select value={selectedPageId} onValueChange={setSelectedPageId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a page..." />
                    </SelectTrigger>
                    <SelectContent>
                      {pages.map((page) => (
                        <SelectItem key={page.id} value={page.id}>
                          📄 {getPageTitle(page)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Database Name</Label>
                <Input
                  id="title"
                  value={databaseTitle}
                  onChange={(e) => setDatabaseTitle(e.target.value)}
                  placeholder="MentalTabs Database"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => setStep("configure_columns")}
                disabled={!selectedPageId || !databaseTitle}
              >
                Next: Configure Columns
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "configure_columns" && (
          <>
            <DialogHeader>
              <DialogTitle>Configure Database Columns</DialogTitle>
              <DialogDescription>
                Select which columns you want in your Notion database. Title is required.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto">
              {AVAILABLE_COLUMNS.map((column) => (
                <div
                  key={column.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border"
                >
                  <Checkbox
                    id={column.id}
                    checked={selectedColumns.includes(column.id)}
                    onCheckedChange={() => handleColumnToggle(column.id)}
                    disabled={column.required}
                  />
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor={column.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {column.name}
                      {column.required && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (Required)
                        </span>
                      )}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {column.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("select_page")}>
                Back
              </Button>
              <Button onClick={handleCreateDatabase} disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Database"
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "creating" && (
          <>
            <DialogHeader>
              <DialogTitle>Creating Your Database</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              {creating ? (
                <>
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Setting up your Notion database...
                  </p>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                  <p className="text-sm font-medium">Database created successfully!</p>
                </>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

