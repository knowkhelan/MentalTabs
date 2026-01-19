import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const About = () => {
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

        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
          About Mental Tabs
        </h1>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <p className="text-lg text-foreground/80">
            Mental Tabs turns the tools you already use into a capture system for your thoughts.
          </p>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">The Problem</h2>
            <p>
              Ideas come at random times—during meetings, in the shower, while cooking. Most get lost because
              switching to a notes app breaks your flow. You're already in WhatsApp, Slack, or email all day.
              Why add another tool?
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">How It Works</h2>
            <p>
              Text yourself on WhatsApp. Forward an email. Message a Slack bot. Mental Tabs captures it,
              uses AI to categorize it (task, idea, question), and syncs it to your Notion workspace—automatically.
            </p>
            <p>
              No new app to learn. No inbox to check. Zero context-switching.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Built for Founders</h2>
            <p>
              If your mind runs faster than your ability to organize it, this is for you. Mental Tabs reduces
              cognitive load without adding another tool to your stack.
            </p>
            <p className="text-sm text-muted-foreground/70">
              🔒 Privacy-first: We never store your messages. Only secure OAuth tokens.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default About;
