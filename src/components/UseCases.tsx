import { Lightbulb, ListTodo, HelpCircle, Heart } from "lucide-react";

const useCases = [
  {
    icon: Lightbulb,
    text: "A random idea during a meeting"
  },
  {
    icon: ListTodo,
    text: "A task you don't want to forget"
  },
  {
    icon: HelpCircle,
    text: "A question that keeps coming back"
  },
  {
    icon: Heart,
    text: "A feeling you want to process"
  }
];

const UseCases = () => {
  return (
    <section className="py-20 md:py-28 px-6 bg-card/30">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-6">
          Capture anything
        </h2>
        <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">
          All thoughts get processed the same way — no mental overhead required.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {useCases.map((useCase, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-5 bg-background rounded-xl border border-border hover:border-muted-foreground/30 transition-all duration-300 hover:shadow-sm group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <useCase.icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
              </div>
              <p className="text-foreground font-medium">
                {useCase.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
