import { useState } from "react";
import { FileText, Table, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

interface OutputDestinationScreenProps {
  onContinue: () => void;
}

const outputOptions = [
  {
    id: "notion",
    label: "Notion",
    icon: FileText,
    description: "Sync with your existing workspace",
  },
  {
    id: "google-sheets",
    label: "Google Sheets",
    icon: Table,
    description: "Organize thoughts in spreadsheets",
  },
];

const columnOptions = [
  { id: "title", label: "Title" },
  { id: "status", label: "Status" },
  { id: "type", label: "Type" },
  { id: "priority", label: "Priority" },
  { id: "date-created", label: "Date Created" },
  { id: "due-date", label: "Due Date (Date)" },
  { id: "context", label: "Context" },
  { id: "description", label: "Description field" },
  { id: "source", label: "Source" },
];

const OutputDestinationScreen = ({
  onContinue,
}: OutputDestinationScreenProps) => {
  const [connectedDestinations, setConnectedDestinations] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "title",
    "status",
    "date-created",
  ]);

  const handleCardClick = (id: string) => {
    if (connectedDestinations.includes(id)) return;
    setSelectedDestination(id);
    setDialogOpen(true);
  };

  const handleCheckboxChange = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connectedDestinations.includes(id)) {
      setConnectedDestinations((prev) => prev.filter((s) => s !== id));
    }
  };

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((c) => c !== columnId)
        : [...prev, columnId]
    );
  };

  const handleConfirmColumns = () => {
    if (selectedDestination) {
      setConnectedDestinations((prev) => [...prev, selectedDestination]);
    }
    setDialogOpen(false);
    setSelectedDestination(null);
  };

  const getDestinationName = (id: string | null) => {
    return outputOptions.find((d) => d.id === id)?.label || "";
  };

  const isConnected = (id: string) => connectedDestinations.includes(id);
  const hasConnectedDestination = connectedDestinations.length > 0;

  return (
    <div className="text-center">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
        Where should we keep things organized?
      </h1>
      <p className="text-muted-foreground mb-8">
        Connect your preferred destination to sync your structured thoughts.
      </p>

      <div className="space-y-3 mb-8">
        {outputOptions.map((option) => {
          const connected = isConnected(option.id);

          return (
            <div
              key={option.id}
              onClick={() => handleCardClick(option.id)}
              className={cn(
                "w-full p-5 rounded-2xl border-2 bg-card transition-all duration-300 cursor-pointer text-left relative",
                connected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/30 hover:bg-accent"
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
                ) : (
                  <button
                    onClick={() => handleCardClick(option.id)}
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
        You can change this anytime in settings.
      </p>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configure {getDestinationName(selectedDestination)} Columns</DialogTitle>
            <DialogDescription>
              Select which columns to enable in your storage.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4 max-h-[300px] overflow-y-auto">
            {columnOptions.map((column) => (
              <div
                key={column.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={column.id}
                  checked={selectedColumns.includes(column.id)}
                  onCheckedChange={() => handleColumnToggle(column.id)}
                />
                <Label
                  htmlFor={column.id}
                  className="flex-1 cursor-pointer text-sm font-medium"
                >
                  {column.label}
                </Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmColumns} disabled={selectedColumns.length === 0}>
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OutputDestinationScreen;
