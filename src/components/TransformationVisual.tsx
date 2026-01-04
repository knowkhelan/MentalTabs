import { useState, useEffect } from "react";
import { CheckCircle, Lightbulb, HelpCircle, ArrowRight } from "lucide-react";

const rawThoughts = [
  { text: "Call investor tomorrow", type: "action" },
  { text: "Why do I feel stuck here?", type: "curiosity" },
  { text: "Idea: new hiring approach", type: "thought" },
  { text: "Follow up on proposal", type: "action" },
  { text: "Something feels off about Q3 plan", type: "curiosity" },
];

const categories = [
  { 
    label: "Thought", 
    icon: Lightbulb, 
    color: "bg-amber-50 border-amber-200 text-amber-800",
    items: ["Idea: new hiring approach"]
  },
  { 
    label: "Action", 
    icon: CheckCircle, 
    color: "bg-emerald-50 border-emerald-200 text-emerald-800",
    items: ["Call investor tomorrow", "Follow up on proposal"]
  },
  { 
    label: "Curiosity", 
    icon: HelpCircle, 
    color: "bg-sky-50 border-sky-200 text-sky-800",
    items: ["Why do I feel stuck here?", "Something feels off about Q3 plan"]
  },
];

const TransformationVisual = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('transformation-visual');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="transformation-visual" className="py-20 md:py-28 px-6 bg-section-warm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            From scattered to structured
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Your thoughts arrive messy. Mental Tab organizes them instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,auto,1fr] gap-8 lg:gap-12 items-center">
          {/* Raw thoughts */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-medium">
              What's on your mind
            </p>
            <div className="space-y-3">
              {rawThoughts.map((thought, index) => (
                <div
                  key={index}
                  className={`p-4 bg-background rounded-xl border border-border shadow-sm transition-all duration-500 ${isVisible ? 'animate-float-subtle' : ''}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <p className="text-foreground/80 font-medium">{thought.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className={`flex items-center justify-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-primary hidden lg:block" />
              <span className="lg:hidden text-primary text-xl">↓</span>
            </div>
          </div>

          {/* Organized categories */}
          <div className={`space-y-4 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-medium">
              Organized by Mental Tab
            </p>
            {categories.map((category, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${category.color} transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <category.icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{category.label}</span>
                </div>
                <ul className="space-y-1.5">
                  {category.items.map((item, i) => (
                    <li key={i} className="text-sm opacity-80">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformationVisual;
