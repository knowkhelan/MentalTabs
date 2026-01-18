import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-12">Last updated: January 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <p className="text-lg text-foreground/80">
            Your privacy matters to us. Here's how we handle your data — in plain language.
          </p>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">What We Collect</h2>
            <p>
              We collect only basic account information (like your email address) needed to provide the service 
              and connect your integrations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">How We Handle Your Messages</h2>
            <p>
              When you send a message through WhatsApp, Slack, or Email, we process it in real-time to 
              categorize and organize it, then immediately send it to your connected Notion database.
            </p>
            <p>
              <strong className="text-foreground">We do not store your messages.</strong> Your thoughts pass through 
              our system and go directly to your Notion — we don't keep copies. Your data lives in your Notion, 
              not on our servers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">What We Don't Do</h2>
            <p>
              We don't sell your personal data. We don't use your thoughts for advertising, training AI models, 
              or any purpose other than delivering them to your Notion. We don't share your information with 
              third parties for their marketing purposes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Third-Party Services</h2>
            <p>
              MentalTabs integrates with services like Slack, WhatsApp, Email providers, and Notion. 
              These integrations are used only to receive your messages and deliver organized thoughts 
              to your chosen destination.
            </p>
            <p>
              Each of these services has their own privacy policies that govern how they handle your data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Data Security</h2>
            <p>
              Since we don't store your messages, there's nothing to leak. Your account credentials and 
              integration tokens are stored securely using industry-standard encryption.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Your Rights</h2>
            <p>
              You can request deletion of your data at any time by contacting us at{" "}
              <a href="mailto:admin@mentaltabs.co" className="text-primary hover:underline">
                admin@mentaltabs.co
              </a>
              . We'll remove your information from our systems.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Questions?</h2>
            <p>
              If you have any questions about how we handle your data, reach out to{" "}
              <a href="mailto:admin@mentaltabs.co" className="text-primary hover:underline">
                admin@mentaltabs.co
              </a>
              .
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Privacy;
