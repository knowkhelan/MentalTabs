import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Brain } from "lucide-react";

const ClosingSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <section className="py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-8">
          <Brain className="w-8 h-8 text-primary" />
        </div>

        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
          A clearer mind,
          <br />
          <span className="text-gradient">every day.</span>
        </h2>
        

        {!isSubmitted ? (
          <div>
            <form 
              onSubmit={handleSubmit} 
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-14 bg-card border-border text-foreground placeholder:text-muted-foreground text-base px-5"
                required
              />
              <Button 
                type="submit" 
                className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 text-base font-semibold"
              >
                Start closing tabs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        ) : (
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 max-w-md mx-auto mb-6">
            <p className="text-foreground font-semibold text-lg">Welcome aboard! 🧠✨</p>
            <p className="text-muted-foreground mt-1">You'll be first to know when we launch.</p>
          </div>
        )}

        <p className="text-muted-foreground font-medium">
          Built for people who <span className="text-foreground">think a lot.</span>
        </p>
      </div>
    </section>
  );
};

export default ClosingSection;
