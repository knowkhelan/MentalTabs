import { useState } from "react";
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

interface ColumnsConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destinationName: string;
  selectedColumns: string[];
  onSave: (columns: string[]) => void;
}

const columnOptions = [
  {
    id: "title",
    label: "Title",
    description: "What's on your mind? The main thought, task, or idea you want to capture.",
  },
  {
    id: "status",
    label: "Status",
    description: "Where is this in your workflow? Track if it's new, in progress, done, or on hold.",
  },
  {
    id: "type",
    label: "Type",
    description: "Is this a task to complete, an idea to explore, a thought to reflect on, or a question to answer?",
  },
  {
    id: "priority",
    label: "Priority",
    description: "How urgent or important is this? Helps you focus on what matters most.",
  },
  {
    id: "date-created",
    label: "Date Created",
    description: "When you captured this thought—automatically tracked so you never lose context.",
  },
  {
    id: "due-date",
    label: "Due Date",
    description: "Does this have a deadline? Set it if there's a specific time it needs attention.",
  },
  {
    id: "notes",
    label: "Notes",
    description: "Add extra details, context, or follow-up thoughts as they come to you.",
  },
  {
    id: "source",
    label: "Source",
    description: "Where did this come from? Automatically logs whether you sent it via WhatsApp, Email, Slack, or iMessage.",
  },
];

const ColumnsConfigDialog = ({
  open,
  onOpenChange,
  destinationName,
  selectedColumns,
  onSave,
}: ColumnsConfigDialogProps) => {
  const [columns, setColumns] = useState<string[]>(selectedColumns);

  const handleColumnToggle = (columnId: string) => {
    setColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((c) => c !== columnId)
        : [...prev, columnId]
    );
  };

  const handleSave = () => {
    onSave(columns);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Configure {destinationName} Columns</DialogTitle>
          <DialogDescription>
            Select which columns to enable in your storage.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
          {columnOptions.map((column) => (
            <div
              key={column.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <Checkbox
                id={column.id}
                checked={columns.includes(column.id)}
                onCheckedChange={() => handleColumnToggle(column.id)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label
                  htmlFor={column.id}
                  className="cursor-pointer text-sm font-medium leading-none"
                >
                  {column.label}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {column.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={columns.length === 0}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnsConfigDialog;
