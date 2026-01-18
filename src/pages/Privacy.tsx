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
              When you use MentalTabs, we process the messages you send us (via WhatsApp, Slack, or Email) 
              to organize your thoughts and send them to your connected Notion database.
            </p>
            <p>
              We also collect basic account information (like your email address) to provide the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">How We Use Your Data</h2>
            <p>
              Your data is used only to provide MentalTabs. We process your messages to categorize and 
              organize them, then send them to your Notion. That's it.
            </p>
            <p>
              We don't sell your personal data. We don't use your thoughts for advertising. 
              We don't share your information with third parties for their marketing purposes.
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
              We store your data securely and take reasonable measures to protect it. 
              Your messages are processed and stored using industry-standard security practices.
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
