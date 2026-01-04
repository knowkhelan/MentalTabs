import { Zap, Bookmark, Wind, Target } from "lucide-react";

const benefits = [
  { icon: Zap, text: "Capture fast thoughts without friction" },
  { icon: Bookmark, text: "Never lose important ideas" },
  { icon: Wind, text: "Reduce mental clutter" },
  { icon: Target, text: "Focus on what actually matters" },
];

const WhyItMatters = () => {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
              Thinking is easy.<br />
              <span className="italic">Acting is hard.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Mental Tab helps you bridge the gap between ideas and action — without forcing structure on the way in.
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <p className="text-foreground font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyItMatters;
