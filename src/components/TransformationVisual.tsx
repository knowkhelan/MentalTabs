import { useState, useEffect } from "react";
import { ArrowRight, Zap, CheckCircle2, Lightbulb, HelpCircle, X } from "lucide-react";

const chaosThoughts = [
  { text: "call investor back", color: "text-red-500/80" },
  { text: "why do I keep procrastinating?", color: "text-purple-500/80" },
  { text: "birthday gift for mom", color: "text-amber-600/80" },
  { text: "feeling overwhelmed lately", color: "text-blue-500/80" },
  { text: "startup idea: AI for...", color: "text-emerald-500/80" },
  { text: "dentist appointment", color: "text-orange-500/80" },
];

const organizedCards = [
  { 
    label: "Action", 
    icon: CheckCircle2, 
    items: ["Call investor back", "Book dentist appointment"],
    color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700"
  },
  { 
    label: "Thought", 
    icon: Lightbulb, 
    items: ["Startup idea: AI for...", "Birthday gift for mom"],
    color: "bg-amber-500/10 border-amber-500/30 text-amber-700"
  },
  { 
    label: "Curiosity", 
    icon: HelpCircle, 
    items: ["Why do I keep procrastinating?", "Feeling overwhelmed lately"],
    color: "bg-blue-500/10 border-blue-500/30 text-blue-700"
  },
];

const TransformationVisual = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 md:py-24 px-6 bg-gradient-to-b from-background via-accent/20 to-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl text-center text-foreground mb-4">
          From mental chaos to <span className="text-gradient font-bold">crystal clarity</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 md:mb-16 max-w-xl mx-auto">
          Watch your scattered thoughts transform into organized clarity
        </p>

        <div className="grid lg:grid-cols-[1fr,auto,1fr] gap-8 lg:gap-6 items-center">
          {/* Chaos Side - Browser Tabs */}
          <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="bg-card/50 rounded-2xl p-6 border border-border relative overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                  <div className="w-3 h-3 rounded-full bg-green-400/60" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground font-medium">your_brain.exe</span>
                </div>
              </div>

              {/* Floating chaos tabs */}
              <div className="relative min-h-[280px]">
                {chaosThoughts.map((thought, index) => (
                  <div
                    key={index}
                    className={`absolute flex items-center gap-2 px-3 py-2 bg-background rounded-lg border border-border shadow-sm
                      ${index % 2 === 0 ? 'animate-tab-float' : 'animate-tab-float-alt'}`}
                    style={{
                      top: `${(index % 3) * 80 + 10}px`,
                      left: `${(index % 2) * 40 + (index > 2 ? 20 : 0)}px`,
                      animationDelay: `${index * 0.3}s`,
                      zIndex: 6 - index,
                    }}
                  >
                    <X className="w-3 h-3 text-muted-foreground/50" />
                    <span className={`text-sm font-medium ${thought.color} whitespace-nowrap`}>
                      {thought.text}
                    </span>
                  </div>
                ))}
                
                {/* Tab counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full">
                  <span className="text-xs font-bold text-red-500">47 tabs open 🤯</span>
                </div>
              </div>
            </div>
            <p className="text-center text-muted-foreground text-sm mt-4 font-medium">Your brain right now</p>
          </div>

          {/* Transformation Arrow */}
          <div className={`flex flex-col items-center justify-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center animate-transform-pulse">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <ArrowRight className="w-8 h-8 text-primary mt-3 hidden lg:block" />
            <div className="lg:hidden mt-3 text-primary text-2xl">↓</div>
          </div>

          {/* Organized Side */}
          <div className={`space-y-4 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {organizedCards.map((card, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${card.color} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                style={{ animationDelay: `${0.6 + index * 0.15}s` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <card.icon className="w-5 h-5" />
                  <span className="font-display font-semibold">{card.label}</span>
                </div>
                <ul className="space-y-2">
                  {card.items.map((item, i) => (
                    <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-current mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="text-center text-muted-foreground text-sm mt-4 font-medium">After Mental Tabs ✨</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformationVisual;
