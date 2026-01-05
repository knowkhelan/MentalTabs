import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputSourceScreen from "@/components/onboarding/InputSourceScreen";
import OutputDestinationScreen from "@/components/onboarding/OutputDestinationScreen";
import FirstThoughtScreen from "@/components/onboarding/FirstThoughtScreen";
import SuccessScreen from "@/components/onboarding/SuccessScreen";

export type InputSource = "slack" | "whatsapp" | "email" | null;
export type OutputDestination = "notion" | "mental-tab" | null;

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [inputSource, setInputSource] = useState<InputSource>(null);
  const [outputDestination, setOutputDestination] = useState<OutputDestination>(null);

  const handleInputSelect = (source: InputSource) => {
    setInputSource(source);
    setStep(2);
  };

  const handleOutputSelect = (destination: OutputDestination) => {
    setOutputDestination(destination);
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
        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-12">
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

        {/* Screens */}
        <div className="animate-fade-up">
          {step === 1 && <InputSourceScreen onSelect={handleInputSelect} />}
          {step === 2 && (
            <OutputDestinationScreen
              onSelect={handleOutputSelect}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <FirstThoughtScreen
              inputSource={inputSource}
              onComplete={handleFirstThoughtSent}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && <SuccessScreen onComplete={handleComplete} />}
        </div>
      </div>
    </main>
  );
};

export default Onboarding;
