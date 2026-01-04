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
      // TODO: Connect to backend for waitlist
    }
  };

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
          Clear your mind.
          <br />
          Keep what matters.
        </h2>
        
        <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
          Stop carrying everything in your head. Let Mental Inbox hold it for you.
        </p>

        {!isSubmitted ? (
          <form 
            onSubmit={handleSubmit} 
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6"
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
              Try Mental Inbox
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        ) : (
          <div className="bg-accent/50 rounded-lg p-4 max-w-md mx-auto mb-6">
            <p className="text-foreground font-medium">You're on the list! ✨</p>
            <p className="text-muted-foreground text-sm mt-1">We'll be in touch soon.</p>
          </div>
        )}

        <p className="text-sm text-muted-foreground italic">
          Built for people who think a lot.
        </p>
      </div>
    </section>
  );
};

export default ClosingSection;
