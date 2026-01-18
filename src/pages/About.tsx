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
          About MentalTabs
        </h1>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <p className="text-lg text-foreground/80">
            MentalTabs is a simple way to capture and organize your thoughts — without adding another app to your life.
          </p>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">The Problem</h2>
            <p>
              We live with constant mental overload. Ideas pop up in the shower, tasks surface during dinner, 
              and important thoughts get lost in the noise of daily life. We already use messaging apps all day — 
              WhatsApp, Slack, Email — but our thoughts stay scattered across conversations, notes apps, and memory.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">What MentalTabs Does</h2>
            <p>
              MentalTabs lets you send thoughts through the tools you already use. Text a quick idea to WhatsApp, 
              forward an email, or message a Slack bot. Your thoughts are automatically organized and sent to 
              your Notion database — categorized as thoughts, actions, or curiosities.
            </p>
            <p>
              No new app to open. No habit to build. Just capture and forget — we handle the rest.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Our Philosophy</h2>
            <p>
              We believe in reducing cognitive load, not adding to it. MentalTabs is built for people who think 
              a lot — founders, creators, operators, and anyone whose mind runs faster than their ability to 
              write things down.
            </p>
            <p>
              Simplicity is the goal. Clarity is the outcome.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default About;
