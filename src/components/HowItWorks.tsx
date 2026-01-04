import { Brain, Sparkles, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Brain,
    title: "Dump whatever's on your mind",
    description: "No need to categorize. Just write or voice what you're thinking."
  },
  {
    icon: Sparkles,
    title: "AI structures it automatically",
    description: "Your thoughts become organized — actions, ideas, reflections, questions."
  },
  {
    icon: CheckCircle,
    title: "Get clarity without effort",
    description: "Review what matters. Act on what's important. Let go of the rest."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-16">
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent mb-5 group-hover:scale-110 transition-transform duration-300">
                <step.icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="font-medium text-lg text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
