import { Lightbulb, Clock, HelpCircle, CloudRain, ArrowRight } from "lucide-react";

const useCases = [
  {
    icon: Lightbulb,
    text: "An idea you don't want to forget",
    example: '"App that reminds you to drink water..."',
  },
  {
    icon: Clock,
    text: "A task you keep postponing",
    example: '"Reply to that email from last week"',
  },
  {
    icon: HelpCircle,
    text: "A question stuck in your head",
    example: '"Why do I always feel tired at 3pm?"',
  },
  {
    icon: CloudRain,
    text: "Something bothering you mid-day",
    example: '"Feeling anxious about the presentation"',
  }
];

const UseCases = () => {
  return (
    <section className="py-20 md:py-28 px-6 bg-card/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            One tool. Every thought.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Mental Tabs handles all of these the same way — no mental overhead required.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {useCases.map((useCase, index) => (
            <div 
              key={index}
              className="group p-6 bg-background rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                  <useCase.icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-semibold mb-2">
                    {useCase.text}
                  </p>
                  <p className="text-sm text-muted-foreground italic truncate">
                    {useCase.example}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Captured & organized</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
