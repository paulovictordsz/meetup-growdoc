import TopBanner from "./sections/TopBanner";
import Hero from "./sections/Hero";
import Benefits from "./sections/Benefits";
import SocialProof from "./sections/SocialProof";
import LeadForm from "./sections/LeadForm";
import CtaSection from "./sections/CtaSection";
import Footer from "./sections/Footer";

export default function App() {
  return (
    <div className="min-h-dvh w-full flex flex-col">
      <TopBanner />
      <Hero />
      <LeadForm />
      <Benefits />
      <SocialProof />
      <CtaSection />
      <Footer />
    </div>
  );
}
