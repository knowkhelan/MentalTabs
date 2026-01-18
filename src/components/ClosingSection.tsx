import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain } from "lucide-react";

const ClosingSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <section className="py-20 md:py-28 px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-8">
          <Brain className="w-8 h-8 text-primary" />
        </div>

        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
          A clearer mind,
          <br />
          <span className="text-gradient">without trying.</span>
        </h2>
        
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          Keep doing your work. Mental Tabs closes the loops.
        </p>

        <Button 
          onClick={handleGetStarted}
          className="h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 text-base font-semibold"
        >
          Start capturing thoughts
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};

export default ClosingSection;
