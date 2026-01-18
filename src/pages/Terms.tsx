import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const Terms = () => {
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
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-12">Last updated: January 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <p className="text-lg text-foreground/80">
            By using MentalTabs, you agree to these terms. We've kept them simple and fair.
          </p>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">The Service</h2>
            <p>
              MentalTabs helps you capture and organize thoughts by processing messages you send through 
              WhatsApp, Slack, or Email, and organizing them in your Notion database.
            </p>
            <p>
              The service is provided "as is." We're continuously improving MentalTabs, which means 
              features may change, improve, or occasionally be removed over time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Your Responsibilities</h2>
            <p>
              You're responsible for the content you send to MentalTabs. Please don't use the service 
              to process illegal content or to misuse our systems.
            </p>
            <p>
              You're also responsible for maintaining access to your connected accounts (Notion, Slack, etc.) 
              and ensuring your integrations remain active.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">AI-Powered Organization</h2>
            <p>
              MentalTabs uses AI to categorize and organize your thoughts. While we strive for accuracy, 
              AI isn't perfect. We don't guarantee that every thought will be categorized correctly.
            </p>
            <p>
              You should review organized content and not rely solely on AI-generated categorizations 
              for important decisions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Limitations</h2>
            <p>
              MentalTabs is a tool to help you capture thoughts, not a replacement for professional advice. 
              We're not responsible for decisions you make based on content organized by our service.
            </p>
            <p>
              We do our best to keep the service running smoothly, but we can't guarantee 100% uptime 
              or that every message will be processed without delay.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Changes to Terms</h2>
            <p>
              We may update these terms as MentalTabs evolves. Significant changes will be communicated 
              via email or through the service. Continued use after changes means you accept the new terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Questions?</h2>
            <p>
              If anything here is unclear, reach out at{" "}
              <a href="mailto:support@mentaltabs.com" className="text-primary hover:underline">
                support@mentaltabs.com
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

export default Terms;
