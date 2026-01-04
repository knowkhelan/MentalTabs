import { MessageSquare, Hash, Send, Mail } from "lucide-react";

const platforms = [
  { name: "WhatsApp", icon: MessageSquare },
  { name: "Slack", icon: Hash },
  { name: "Telegram", icon: Send },
  { name: "Email", icon: Mail },
];

const PlatformSection = () => {
  return (
    <section className="py-20 md:py-28 px-6 bg-card/50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
          Your mind doesn't live in one app.
        </h2>
        <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto">
          Mental Tab meets you where you already think.
        </p>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-6 py-4 bg-background rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <platform.icon className="w-6 h-6 text-foreground/70" strokeWidth={1.5} />
              <span className="font-medium text-foreground">{platform.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;
