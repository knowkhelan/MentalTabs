import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

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
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
          A clearer mind,<br />
          <span className="italic">every day.</span>
        </h2>

        {!isSubmitted ? (
          <div>
            <form 
              onSubmit={handleSubmit} 
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6"
            >
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-14 bg-card border-border text-foreground placeholder:text-muted-foreground text-base px-5 rounded-xl"
                required
              />
              <Button 
                type="submit" 
                className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 text-base font-medium rounded-xl"
              >
                Try Mental Tab
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
            
            <p className="text-sm text-muted-foreground">
              Early access · Built in public · Feedback-driven
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md mx-auto">
            <p className="text-foreground font-display text-xl mb-1">Welcome aboard</p>
            <p className="text-muted-foreground">We'll be in touch soon.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClosingSection;
