import Banner from "@/components/home/Banner";
import Features from "@/components/home/Features";
import UpcomingPreview from "@/components/home/UpcomingPreview";
import Gallery from "@/components/home/Gallery";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Banner />
      <Features />
      <UpcomingPreview />
      <Gallery />
      <Newsletter />
    </>
  );
}
