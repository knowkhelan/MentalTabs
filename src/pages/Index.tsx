import HeroSection from "@/components/HeroSection";
import TransformationVisual from "@/components/TransformationVisual";
import HowItWorks from "@/components/HowItWorks";
import PlatformSection from "@/components/PlatformSection";
import WhyItMatters from "@/components/WhyItMatters";
import WhoItsFor from "@/components/WhoItsFor";
import ClosingSection from "@/components/ClosingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <TransformationVisual />
      <HowItWorks />
      <PlatformSection />
      <WhyItMatters />
      <WhoItsFor />
      <ClosingSection />
      <Footer />
    </main>
  );
};

export default Index;
