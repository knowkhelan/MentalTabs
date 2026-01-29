import HeroSection from "@/components/HeroSection";
import NoContextSwitching from "@/components/NoContextSwitching";
import TransformationVisual from "@/components/TransformationVisual";
import HowItWorks from "@/components/HowItWorks";
import InstallationSection from "@/components/InstallationSection";
import WhoItsFor from "@/components/WhoItsFor";
import ClosingSection from "@/components/ClosingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <NoContextSwitching />
      <TransformationVisual />
      <HowItWorks />
      <InstallationSection />
      <WhoItsFor />
      <ClosingSection />
      <Footer />
    </main>
  );
};

export default Index;
