import { MessageSquare, Mail, Hash } from "lucide-react";

const scenarios = [
  {
    icon: Hash,
    context: "You're in Slack",
    trigger: "idea hits",
    action: "message yourself",
    color: "text-[#4A154B]"
  },
  {
    icon: MessageSquare,
    context: "You're on WhatsApp",
    trigger: "reminder pops up",
    action: "send it",
    color: "text-[#25D366]"
  },
  {
    icon: Mail,
    context: "You're in Email",
    trigger: "thought appears",
    action: "forward it",
    color: "text-primary"
  }
];

const NoContextSwitching = () => {
  return (
    <section className="py-20 md:py-28 px-6 bg-accent/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            No context switching. <span className="text-gradient">Ever.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Your brain jumps fast. Tools shouldn't slow it down.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {scenarios.map((scenario, index) => (
            <div 
              key={index}
              className="relative p-6 rounded-2xl bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <scenario.icon className={`w-5 h-5 ${scenario.color}`} />
                </div>
                <span className="text-sm font-medium text-muted-foreground">{scenario.context}</span>
              </div>
              
              <div className="space-y-2">
                <p className="text-foreground">
                  <span className="text-muted-foreground">→</span> {scenario.trigger}
                </p>
                <p className="text-foreground font-medium">
                  <span className="text-muted-foreground">→</span> {scenario.action}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
          Mental Tabs organizes everything automatically — <span className="text-foreground font-medium">while you stay focused.</span>
        </p>
      </div>
    </section>
  );
};

export default NoContextSwitching;
