import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, MessageCircle, Mail, ArrowRight, Check } from "lucide-react";

const integrations = [
  {
    id: "slack",
    name: "Slack",
    icon: MessageSquare,
    iconColor: "text-[#4A154B]",
    iconBg: "bg-[#4A154B]/10",
    buttonText: "Add to Slack",
    steps: [
      "Sign in with your Google account",
      "Connect your Slack workspace",
      "Start sending messages to yourself",
    ],
    description: "Quickly capture thoughts by messaging yourself in Slack",
  },
  {
    id: "gmail",
    name: "Gmail",
    icon: Mail,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    buttonText: "Add Gmail",
    steps: [
      "Sign in with your Google account",
      "Grant read-only access to Gmail",
      "Apply the 'mentaltabs' label to sync emails",
    ],
    description: "Sync important emails to Notion by labeling them",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageCircle,
    iconColor: "text-[#25D366]",
    iconBg: "bg-[#25D366]/10",
    buttonText: "Add WhatsApp",
    steps: [
      "Sign in with your Google account",
      "Save our WhatsApp number",
      "Send voice notes or messages anytime",
    ],
    description: "Capture thoughts on the go with voice notes or texts",
  },
];

const InstallationSection = () => {
  const navigate = useNavigate();

  const handleInstall = () => {
    navigate("/auth");
  };

  return (
    <section className="py-20 md:py-28 px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-soft animation-delay-1000" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Get Started in Minutes
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Choose your preferred input source and start capturing thoughts instantly
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {integrations.map((integration, index) => {
            const IconComponent = integration.icon;
            return (
              <div
                key={integration.id}
                className="group relative"
              >
                <div className="relative p-8 rounded-2xl bg-gradient-to-b from-card to-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${integration.iconBg} border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary/30 transition-all duration-300`}>
                    <IconComponent className={`w-7 h-7 ${integration.iconColor}`} strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                    {integration.name}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {integration.description}
                  </p>

                  {/* Steps */}
                  <div className="flex-1 mb-6 space-y-3">
                    {integration.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" strokeWidth={2.5} />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={handleInstall}
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 font-semibold group-hover:shadow-lg group-hover:shadow-primary/20"
                  >
                    {integration.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All integrations require a Google account to get started. Your data is encrypted and never stored.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InstallationSection;
