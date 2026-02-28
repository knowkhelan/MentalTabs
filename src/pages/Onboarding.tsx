import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import InputSourceScreen from "@/components/onboarding/InputSourceScreen";
import OutputDestinationScreen from "@/components/onboarding/OutputDestinationScreen";
import FirstThoughtScreen from "@/components/onboarding/FirstThoughtScreen";
import SuccessScreen from "@/components/onboarding/SuccessScreen";
import { setToken, apiGet, apiPost, getToken } from "@/lib/api";

export type InputSource = "slack" | "whatsapp" | "email";
export type OutputDestination = "notion" | "mental-tab" | null;

const Onboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [inputSources, setInputSources] = useState<InputSource[]>([]);
  const [outputDestination, setOutputDestination] = useState<OutputDestination>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Handle OAuth callbacks (Gmail, Notion, GSheet) - MUST RUN FIRST to extract token
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const oauthStatus = searchParams.get("oauth");
      const notionStatus = searchParams.get("notion");
      const gsheetStatus = searchParams.get("gsheet");
      const oauthError = searchParams.get("error");

      if (oauthStatus === "success") {
        // Gmail OAuth successful - email source should be marked as connected
        // The InputSourceScreen component will handle updating its state
        // Store user info if available
        const emailFromParams = searchParams.get("email");
        const nameFromParams = searchParams.get("name");
        const pictureFromParams = searchParams.get("picture");
        const tokenFromParams = searchParams.get("token");
        
        // Store JWT token FIRST - this is critical!
        if (tokenFromParams) {
          setToken(tokenFromParams);
        }
        
        if (emailFromParams) {
          localStorage.setItem("userEmail", emailFromParams);
          localStorage.setItem("isLoggedIn", "true");
          if (nameFromParams) {
            localStorage.setItem("userName", nameFromParams);
          }
          if (pictureFromParams) {
            localStorage.setItem("userPicture", pictureFromParams);
          }
        }
        
        // Check backend for onboarding status after OAuth (token is now stored)
        setIsCheckingStatus(true);
        try {
          const authStatus = await apiGet("/auth/status");
          setIsCheckingStatus(false);
          if (authStatus.onboarding_complete) {
            navigate("/dashboard", { replace: true });
          } else {
            // Clean up URL but stay on onboarding
            navigate("/onboarding", { replace: true });
          }
        } catch (error) {
          // If API call fails, stay on onboarding
          setIsCheckingStatus(false);
          console.log("Could not check onboarding status:", error);
          navigate("/onboarding", { replace: true });
        }
      } else if (notionStatus === "connected" || notionStatus === "setup_needed" || gsheetStatus === "connected") {
        // Notion or GSheet OAuth successful - OutputDestinationScreen will handle updating its state
        setIsCheckingStatus(false);
        if (step !== 2) {
          setStep(2);
        }
      } else if (oauthError) {
        setIsCheckingStatus(false);
        console.error("OAuth error:", oauthError);
        // Clean up URL but stay on onboarding
        navigate("/onboarding", { replace: true });
      }
      // If no OAuth callback, let the second useEffect handle the status check
    };

    handleOAuthCallback();
  }, [searchParams, navigate, step]);

  // Check if onboarding is already complete - redirect to dashboard if so
  // This runs AFTER OAuth callback to ensure token is available
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const token = getToken();
      
      // If user is not logged in, redirect to auth
      if (isLoggedIn !== "true") {
        setIsCheckingStatus(false);
        navigate("/auth", { replace: true });
        return;
      }

      // If no token available, wait for OAuth callback to process
      if (!token) {
        // Check if we're in the middle of OAuth callback
        const oauthStatus = searchParams.get("oauth");
        if (oauthStatus !== "success") {
          // Not an OAuth callback and no token - redirect to auth
          setIsCheckingStatus(false);
          navigate("/auth", { replace: true });
        }
        return;
      }

      // Check backend for onboarding status
      setIsCheckingStatus(true);
      try {
        const authStatus = await apiGet("/auth/status");
        setIsCheckingStatus(false);
        if (authStatus.onboarding_complete) {
          navigate("/dashboard", { replace: true });
          return;
        }
      } catch (error) {
        // If API call fails (e.g., invalid token), redirect to auth
        setIsCheckingStatus(false);
        console.log("Could not check onboarding status:", error);
        navigate("/auth", { replace: true });
      }
    };

    checkOnboardingStatus();
  }, [navigate, searchParams]);

  const handleInputContinue = (sources: string[]) => {
    setInputSources(sources as InputSource[]);
    setStep(2);
  };

  const handleOutputContinue = () => {
    setOutputDestination("notion");
    setStep(3);
  };

  const handleFirstThoughtSent = () => {
    setStep(4);
  };

  const handleComplete = async () => {
    try {
      // Mark onboarding as complete in backend
      await apiPost("/auth/onboarding/complete");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to mark onboarding complete:", error);
      // Still navigate to dashboard even if API call fails
      navigate("/dashboard");
    }
  };

  // Show loader while checking onboarding status
  if (isCheckingStatus) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Checking status...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* Progress bar with back button */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {/* Back button - only show after step 1 */}
          <button
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            className={`p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-all ${
              step === 1 ? "invisible" : ""
            }`}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Progress indicator */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  s === step
                    ? "w-8 bg-primary"
                    : s < step
                    ? "w-4 bg-primary/40"
                    : "w-4 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Spacer to balance the back button */}
          <div className="w-9" />
        </div>

        {/* Screens */}
        <div className="animate-fade-up">
          {step === 1 && <InputSourceScreen onContinue={handleInputContinue} />}
          {step === 2 && (
            <OutputDestinationScreen onContinue={handleOutputContinue} />
          )}
          {step === 3 && (
            <FirstThoughtScreen
              inputSource={inputSources[0] || "slack"}
              onComplete={handleFirstThoughtSent}
            />
          )}
          {step === 4 && <SuccessScreen onComplete={handleComplete} />}
        </div>
      </div>
    </main>
  );
};

export default Onboarding;
