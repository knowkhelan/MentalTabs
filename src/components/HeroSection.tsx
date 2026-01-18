import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const floatingThoughts = [
  { text: "call investor back", delay: "0s", position: "top-24 left-[3%]" },
  { text: "why do I keep procrastinating?", delay: "2s", position: "top-20 right-[5%]" },
  { text: "startup idea", delay: "1s", position: "top-44 left-[8%]" },
  { text: "feeling stuck", delay: "3s", position: "top-16 right-[18%]" },
  { text: "birthday gift", delay: "0.5s", position: "bottom-36 left-[5%]" },
  { text: "dentist", delay: "1.5s", position: "bottom-28 right-[8%]" },
  { text: "follow up", delay: "0.8s", position: "top-56 right-[12%]" },
  { text: "exercise", delay: "2.5s", position: "bottom-44 left-[15%]" },
  { text: "email back", delay: "1.2s", position: "top-36 left-[18%]" },
  { text: "book flights", delay: "3.5s", position: "bottom-24 right-[20%]" },
  { text: "team sync", delay: "0.3s", position: "top-64 left-[2%]" },
  { text: "groceries", delay: "2.8s", position: "bottom-52 right-[3%]" },
];

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <section className="min-h-[95vh] flex flex-col justify-center px-6 py-16 md:py-24 relative overflow-hidden bg-hero-gradient">
      {/* Floating thought bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingThoughts.map((thought, index) => (
          <div
            key={index}
            className={`absolute ${thought.position} hidden md:block animate-float-slow`}
            style={{ animationDelay: thought.delay }}
          >
            <div className="px-3 py-1.5 bg-card/20 rounded-full border border-border/20 text-xs text-muted-foreground/40 whitespace-nowrap">
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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-border mb-6 animate-fade-up">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">AI-powered mental clarity</span>
        </div>

        {/* Logo */}
        <div className="mb-8 animate-fade-up animation-delay-50">
          <img src={logo} alt="MentalTabs Logo" className="w-32 h-32 md:w-40 md:h-40 mx-auto" />
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

        <div className="animate-fade-up animation-delay-300">
          <Button 
            onClick={handleGetStarted}
            className="h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 text-base font-semibold animate-pulse-glow mb-4"
          >
            Try Mental Tab
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
            <MessageCircle className="w-4 h-4" />
            <span>Works with WhatsApp, Email and Slack</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground animate-fade-up animation-delay-400 font-medium">
          No organizing. No thinking. <span className="text-foreground">Just dump it.</span>
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
