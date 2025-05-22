import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BANNER_IMAGE_URL } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative mb-12 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-secondary-500/90 mix-blend-multiply"></div>
      <img 
        src={BANNER_IMAGE_URL} 
        alt="Marketplace Showcase"
        className="w-full h-64 md:h-80 object-cover"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight max-w-2xl">
          Discover Premium Digital Assets for Your Creative Projects
        </h1>
        <p className="text-gray-200 text-lg md:text-xl mb-6 max-w-xl">
          Join thousands of creators and find the perfect assets to bring your ideas to life.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/explore">
            <Button className="primary-gradient px-6 py-3 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all">
              Browse Assets
            </Button>
          </Link>
          <Link href="/creator-signup">
            <Button 
              variant="outline" 
              className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg text-white font-semibold border border-white/30 hover:bg-white/30 transition-all"
            >
              Become a Creator
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
