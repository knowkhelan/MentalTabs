import { MessageSquare, Sparkles, Brain } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Dump any thought",
    description: "Task, idea, worry, reminder, curiosity — anything. Just send it.",
    accent: "from-primary/20 to-primary/5"
  },
  {
    icon: Sparkles,
    number: "02",
    title: "AI organizes it instantly",
    description: "Without you labeling or categorizing. It just happens.",
    accent: "from-secondary/20 to-secondary/5"
  },
  {
    icon: Brain,
    number: "03",
    title: "Your mind gets clarity",
    description: "Everything in the right place. Mental load lifted.",
    accent: "from-emerald-500/20 to-emerald-500/5"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Three steps. Zero friction. Instant clarity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="group relative"
            >
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[calc(50%+60px)] w-[calc(100%-60px)] h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}
              
              <div className={`relative p-8 rounded-2xl bg-gradient-to-b ${step.accent} border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                {/* Step number */}
                <span className="absolute top-4 right-4 text-5xl font-display font-bold text-foreground/5">
                  {step.number}
                </span>
                
                <div className="w-14 h-14 rounded-xl bg-background border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary/30 transition-all duration-300">
                  <step.icon className="w-7 h-7 text-foreground" strokeWidth={1.5} />
                </div>
                
                <h3 className="font-display font-semibold text-xl text-foreground mb-3">
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
