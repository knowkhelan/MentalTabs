import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowDown } from "lucide-react";

const floatingThoughts = [
  { text: "Call investor tomorrow", delay: "0s", position: "top-16 left-8 md:left-16" },
  { text: "Why do I feel stuck here?", delay: "1s", position: "top-32 right-4 md:right-20" },
  { text: "Idea: new hiring approach", delay: "0.5s", position: "top-48 left-4 md:left-32" },
  { text: "Follow up on proposal", delay: "1.5s", position: "top-24 right-8 md:right-40" },
];

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 py-20 md:py-28 bg-hero-gradient overflow-hidden">
      {/* Floating thought bubbles - decorative */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingThoughts.map((thought, index) => (
          <div
            key={index}
            className={`absolute ${thought.position} hidden md:block animate-float-gentle opacity-40`}
            style={{ animationDelay: thought.delay }}
          >
            <div className="px-4 py-2 bg-card/60 backdrop-blur-sm rounded-full border border-border/50 text-sm text-muted-foreground whitespace-nowrap">
              {thought.text}
            </div>
          </div>
        ))}
        
        {/* Soft gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse-soft animation-delay-1000" />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Logo/Name */}
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground mb-4 animate-fade-up tracking-tight">
          Mental Tab
        </h1>
        
        {/* Tagline */}
        <p className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground/90 mb-6 animate-fade-up animation-delay-100 italic">
          Turn thoughts into clarity. Automatically.
        </p>
        
        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground mb-4 animate-fade-up animation-delay-200 max-w-2xl mx-auto leading-relaxed">
          A universal thinking tool for ideas, actions, and questions — captured the moment they appear.
        </p>

        {/* Platform mention */}
        <p className="text-sm md:text-base text-muted-foreground/80 mb-10 animate-fade-up animation-delay-300">
          Works through WhatsApp, Slack, Telegram, and Email.<br className="hidden sm:block" />
          No app switching. No organizing.
        </p>

        {/* CTAs */}
        {!isSubmitted ? (
          <div className="animate-fade-up animation-delay-400">
            <form 
              onSubmit={handleSubmit} 
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4"
            >
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-14 bg-background border-border text-foreground placeholder:text-muted-foreground text-base px-5 rounded-xl"
                required
              />
              <Button 
                type="submit" 
                className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 text-base font-medium rounded-xl"
              >
                Get Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
            
            <button 
              onClick={scrollToHowItWorks}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              See how it works
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md mx-auto animate-fade-up">
            <p className="text-foreground font-display text-xl mb-1">You're on the list</p>
            <p className="text-muted-foreground">We'll reach out when Mental Tab is ready for you.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
