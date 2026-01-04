import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // TODO: Connect to backend for waitlist
    }
  };

  return (
    <section className="min-h-[90vh] flex flex-col justify-center px-6 py-16 md:py-24">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-tight mb-6 animate-fade-up">
          Turn messy thoughts into clear actions.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-fade-up animation-delay-100 max-w-xl mx-auto">
          Send any thought — task, idea, worry, or question — and your AI organizes it instantly.
        </p>

        {!isSubmitted ? (
          <form 
            onSubmit={handleSubmit} 
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4 animate-fade-up animation-delay-200"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 bg-card border-border text-foreground placeholder:text-muted-foreground"
              required
            />
            <Button 
              type="submit" 
              className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
            >
              Join the Waitlist
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        ) : (
          <div className="bg-accent/50 rounded-lg p-4 max-w-md mx-auto mb-4 animate-fade-up">
            <p className="text-foreground font-medium">You're on the list! ✨</p>
            <p className="text-muted-foreground text-sm mt-1">We'll be in touch soon.</p>
          </div>
        )}

        <p className="text-sm text-muted-foreground animate-fade-up animation-delay-300">
          No folders. No labels. Just write.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
