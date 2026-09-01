import ConfiguratorSection from "../components/ConfiguratorSection";
import ContactCTA from "../components/ContactCTA";
import CraftSection from "../components/CraftSection";
import GallerySection from "../components/GallerySection";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import ProductsSection from "../components/ProductsSection";
import StorySection from "../components/StorySection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <GallerySection />
      <ConfiguratorSection />
      <StorySection />
      <CraftSection />
      <ContactCTA />
    </main>
  );
}
