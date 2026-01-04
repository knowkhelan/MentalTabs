import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, MessageCircle } from "lucide-react";

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
    <section className="min-h-[95vh] flex flex-col justify-center px-6 py-16 md:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-border mb-8 animate-fade-up">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">AI-powered mental clarity</span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] mb-6 animate-fade-up animation-delay-100">
          Too many tabs open
          <br />
          <span className="text-gradient">in your head?</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-fade-up animation-delay-200 max-w-2xl mx-auto leading-relaxed">
          Mental Tabs captures any thought and turns it into clear actions, 
          reflections, or questions — <span className="text-foreground font-medium">automatically.</span>
        </p>

        {!isSubmitted ? (
          <div className="animate-fade-up animation-delay-300">
            <form 
              onSubmit={handleSubmit} 
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4"
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
                className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 text-base font-semibold animate-pulse-glow"
              >
                Clear your mental tabs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
              <MessageCircle className="w-4 h-4" />
              <span>Works with WhatsApp & Telegram</span>
            </div>
          </div>
        ) : (
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 max-w-md mx-auto mb-6 animate-fade-up">
            <p className="text-foreground font-semibold text-lg">You're in! 🎉</p>
            <p className="text-muted-foreground mt-1">We'll notify you when Mental Tabs is ready.</p>
          </div>
        )}

        <p className="text-sm text-muted-foreground animate-fade-up animation-delay-400 font-medium">
          No organizing. No thinking. <span className="text-foreground">Just dump it.</span>
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
