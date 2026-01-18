import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageTextUpload from "@/components/ImageTextUpload";

const Upload = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Get user email from URL params (from OAuth redirect), localStorage, or fetch from backend
  useEffect(() => {
    const fetchUserEmail = async () => {
      // First, check URL params from OAuth redirect
      const emailFromParams = searchParams.get("email");
      if (emailFromParams) {
        // Store in localStorage for future use
        localStorage.setItem("userEmail", emailFromParams);
        setUserEmail(emailFromParams);
        setIsLoading(false);
        return;
      }

      // Check localStorage for stored email
      const storedEmail = localStorage.getItem("userEmail");
      if (storedEmail) {
        setUserEmail(storedEmail);
        setIsLoading(false);
        return;
      }

      // If not found, user needs to connect Gmail account first
      // Show a message or redirect to connect
      setIsLoading(false);
    };

    fetchUserEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent mr-4"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display text-xl font-bold text-foreground">
              Upload Image or Paste Text
            </h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
            Extract Text & Sync to Notion
          </h2>
          <p className="text-muted-foreground">
            Upload an image to extract text using OCR, or paste text directly
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : !userEmail ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Please connect your Gmail account first to use this feature.
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <ImageTextUpload
            userEmail={userEmail}
            onSuccess={() => {
              // Optionally navigate back or show success
              setTimeout(() => {
                navigate("/dashboard");
              }, 2000);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default Upload;

