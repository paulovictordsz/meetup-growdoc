import TopBanner from "./sections/TopBanner";
import Hero from "./sections/Hero";
import Stats from "./sections/Stats";
import Benefits from "./sections/Benefits";
import SocialProof from "./sections/SocialProof";
import LeadForm from "./sections/LeadForm";
import Footer from "./sections/Footer";

export default function App() {
  return (
    <div className="min-h-dvh w-full flex flex-col">
      <TopBanner />
      <Hero />
      <Stats />
      <Benefits />
      <SocialProof />
      <LeadForm />
      <Footer />
    </div>
  );
}
