import { useEffect, useState } from "react";

const messyThoughts = [
  "call investor back",
  "feeling anxious about launch",
  "why do I delay follow-ups?",
  "team offsite idea",
  "remember to exercise"
];

const structuredCards = [
  { label: "Action", content: "Call investor back", color: "bg-accent" },
  { label: "Reflection", content: "Feeling anxious about launch", color: "bg-secondary" },
  { label: "Curiosity", content: "Why do I delay follow-ups?", color: "bg-muted" },
];

const TransformationVisual = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 md:py-24 px-6 bg-card/50">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Messy Input */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4 font-medium">
              What's on your mind
            </p>
            <div className="bg-background rounded-xl p-6 border border-border shadow-sm">
              <div className="font-mono text-sm md:text-base text-muted-foreground space-y-2 leading-relaxed">
                {messyThoughts.map((thought, index) => (
                  <p 
                    key={index} 
                    className={`transition-opacity duration-500`}
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      opacity: isVisible ? 1 : 0 
                    }}
                  >
                    {thought}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Arrow (hidden on mobile) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
            <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-muted-foreground/50">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Structured Output */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4 font-medium">
              Organized by AI
            </p>
            <div className="space-y-3">
              {structuredCards.map((card, index) => (
                <div
                  key={index}
                  className={`${card.color} rounded-xl p-4 border border-border/50 transition-all duration-500 hover:shadow-md animate-float`}
                  style={{ 
                    animationDelay: `${index * 200}ms`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(10px)'
                  }}
                >
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {card.label}
                  </span>
                  <p className="text-foreground mt-1 font-medium">
                    {card.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformationVisual;
