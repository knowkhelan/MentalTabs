import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/config";
import { cn } from "@/lib/utils";

interface ImageTextUploadProps {
  userEmail?: string;
  userId?: string;
  onSuccess?: () => void;
}

const ImageTextUpload = ({ userEmail, userId, onSuccess }: ImageTextUploadProps) => {
  const { toast } = useToast();
  const [mode, setMode] = useState<"upload" | "paste">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleSubmit = async () => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      const queryParams = new URLSearchParams();

      if (userEmail) {
        queryParams.append("user_email", userEmail);
      }
      if (userId) {
        queryParams.append("user_id", userId);
      }

      if (mode === "upload" && uploadedImage && uploadedFile) {
        formData.append("image", uploadedFile);
      } else if (mode === "paste" && pastedText.trim()) {
        formData.append("text", pastedText);
      } else {
        toast({
          title: "Missing content",
          description: "Please upload an image or paste some text.",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      const url = `${API_BASE_URL}/ocr/extract?${queryParams.toString()}`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to process image/text");
      }

      const result = await response.json();

      toast({
        title: "Success!",
        description: result.message || "Text extracted and synced to Notion successfully.",
      });

      // Reset form
      setUploadedImage(null);
      setUploadedFile(null);
      setPastedText("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process image/text",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <button
          onClick={() => {
            setMode("upload");
            setUploadedImage(null);
            setUploadedFile(null);
            setPastedText("");
          }}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors",
            mode === "upload"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Upload Image
        </button>
        <button
          onClick={() => {
            setMode("paste");
            setUploadedImage(null);
            setUploadedFile(null);
            setPastedText("");
          }}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors",
            mode === "paste"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Paste Text
        </button>
      </div>

      {/* Upload Mode */}
      {mode === "upload" && (
        <Card>
          <CardContent className="pt-6">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                isDragging
                  ? "border-primary bg-primary/5"
                  : uploadedImage
                  ? "border-primary/50"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {uploadedImage ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="max-h-64 rounded-lg shadow-md"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedImage(null);
                        setUploadedFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full shadow-md hover:bg-destructive/90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click to change image
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Drop an image here or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports JPG, PNG, GIF, and other image formats
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paste Mode */}
      {mode === "paste" && (
        <Card>
          <CardContent className="pt-6">
            <Textarea
              placeholder="Paste your text here..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Paste any text you want to sync to Notion
            </p>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isUploading || (mode === "upload" && !uploadedImage) || (mode === "paste" && !pastedText.trim())}
        className="w-full h-12 text-lg font-semibold"
        size="lg"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Check className="w-5 h-5 mr-2" />
            Extract & Sync to Notion
          </>
        )}
      </Button>
    </div>
  );
};

export default ImageTextUpload;

