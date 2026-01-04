import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, MessageCircle } from "lucide-react";

const floatingThoughts = [
  { text: "call investor back", delay: "0s", position: "top-20 left-[5%]", color: "text-red-500/60" },
  { text: "why do I keep procrastinating?", delay: "1.5s", position: "top-32 right-[8%]", color: "text-purple-500/60" },
  { text: "startup idea: AI for...", delay: "0.8s", position: "top-48 left-[12%]", color: "text-emerald-500/60" },
  { text: "feeling overwhelmed", delay: "2s", position: "top-16 right-[15%]", color: "text-blue-500/60" },
  { text: "birthday gift for mom", delay: "0.3s", position: "bottom-40 left-[8%]", color: "text-amber-600/60" },
  { text: "dentist appointment", delay: "1.2s", position: "bottom-32 right-[5%]", color: "text-orange-500/60" },
  { text: "follow up on proposal", delay: "0.6s", position: "top-60 right-[25%]", color: "text-teal-500/60" },
  { text: "need to exercise more", delay: "1.8s", position: "bottom-48 left-[20%]", color: "text-pink-500/60" },
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

  return (
    <section className="min-h-[95vh] flex flex-col justify-center px-6 py-16 md:py-24 relative overflow-hidden bg-hero-gradient">
      {/* Floating thought bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingThoughts.map((thought, index) => (
          <div
            key={index}
            className={`absolute ${thought.position} hidden lg:block animate-float-slow`}
            style={{ animationDelay: thought.delay }}
          >
            <div className={`px-4 py-2 bg-card/40 backdrop-blur-sm rounded-full border border-border/30 text-sm font-medium ${thought.color} whitespace-nowrap shadow-sm`}>
              {thought.text}
            </div>
          </div>
        ))}
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft animation-delay-1000" />
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
                className="flex-1 h-14 bg-background border-border text-foreground placeholder:text-muted-foreground text-base px-5"
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
