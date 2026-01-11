import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import InputSourceScreen from "@/components/onboarding/InputSourceScreen";
import OutputDestinationScreen from "@/components/onboarding/OutputDestinationScreen";
import FirstThoughtScreen from "@/components/onboarding/FirstThoughtScreen";
import SuccessScreen from "@/components/onboarding/SuccessScreen";

export type InputSource = "slack" | "whatsapp" | "email";
export type OutputDestination = "notion" | "mental-tab" | null;

const Onboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [inputSources, setInputSources] = useState<InputSource[]>([]);
  const [outputDestination, setOutputDestination] = useState<OutputDestination>(null);

  // Handle OAuth callback
  useEffect(() => {
    const oauthStatus = searchParams.get("oauth");
    const oauthError = searchParams.get("error");

    if (oauthStatus === "success") {
      // OAuth successful - email source should be marked as connected
      // The InputSourceScreen component will handle updating its state
      // Clean up URL
      navigate("/onboarding", { replace: true });
    } else if (oauthError) {
      console.error("OAuth error:", oauthError);
      // Clean up URL
      navigate("/onboarding", { replace: true });
    }
  }, [searchParams, navigate]);

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

  const handleComplete = () => {
    navigate("/");
  };

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
