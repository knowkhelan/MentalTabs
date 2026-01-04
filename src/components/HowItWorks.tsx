import { MessageCircle, Sparkles, Focus } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    number: "01",
    title: "Capture anything",
    description: "Send a message to Mental Tab like you would to a person. No formatting, no categories.",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "AI understands context",
    description: "Mental Tab figures out whether it's a thought, action, or curiosity — automatically.",
  },
  {
    icon: Focus,
    number: "03",
    title: "Stay clear, stay focused",
    description: "Everything stays structured so your mind doesn't have to hold it all.",
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            How it works
          </h2>
          <p className="text-muted-foreground text-lg">
            Three steps. Zero effort.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(50%+48px)] w-[calc(100%-48px)] h-px bg-border" />
              )}
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-card border border-border mb-6 group-hover:border-primary/30 group-hover:shadow-lg transition-all duration-300">
                  <step.icon className="w-10 h-10 text-foreground/70" strokeWidth={1.5} />
                </div>
                
                <p className="text-xs text-muted-foreground font-medium mb-2">Step {step.number}</p>
                
                <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
