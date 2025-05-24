import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { FEATURED_COLLECTION_IMAGE } from "@/lib/constants";

export function FeaturedSection() {
  return (
    <section className="mb-12 relative overflow-hidden rounded-2xl">
      <img 
        src={FEATURED_COLLECTION_IMAGE} 
        alt="Featured assets collection" 
        className="w-full h-48 md:h-80 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-800/90 via-dark-800/70 to-dark-800/40"></div>
      <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12">
        <div className="max-w-2xl">
          <Badge className="bg-primary text-white mb-4">Featured Collection</Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Creative Pro Toolkit 2023</h2>
          <p className="text-gray-300 mb-6 text-sm md:text-base">
            Get access to our most comprehensive creative toolkit with over 5,000+ premium assets for designers, developers, and content creators.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Button className="accent-gradient px-6 py-3 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center">
              <span>Get Access</span>
              <span className="ml-2 font-bold">$149</span>
            </Button>
            <Link href="/collection/creative-pro-toolkit">
              <div className="text-primary hover:text-primary/90 font-medium flex items-center cursor-pointer">
                Learn More <i className="ri-arrow-right-line ml-1"></i>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}