import ConfiguratorSection from "../components/ConfiguratorSection";
import ContactCTA from "../components/ContactCTA";
import CraftSection from "../components/CraftSection";
import GallerySection from "../components/GallerySection";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import ProductsSection from "../components/ProductsSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <GallerySection />
      <ConfiguratorSection />
      <CraftSection />
      <ContactCTA />
    </main>
  );
}
