import HeroSection from "@/components/HeroSection";
import TransformationVisual from "@/components/TransformationVisual";
import HowItWorks from "@/components/HowItWorks";
import UseCases from "@/components/UseCases";
import WhoItsFor from "@/components/WhoItsFor";
import ClosingSection from "@/components/ClosingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <TransformationVisual />
      <HowItWorks />
      <UseCases />
      <WhoItsFor />
      <ClosingSection />
      <Footer />
    </main>
  );
};

export default Index;
