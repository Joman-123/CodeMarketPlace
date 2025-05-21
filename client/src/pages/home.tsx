import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "@/components/hero-section";
import { CategoryCard } from "@/components/category-card";
import { AssetCard } from "@/components/asset-card";
import { CreatorCard } from "@/components/creator-card";
import { FeaturedSection } from "@/components/featured-section";
import { AssetWithDetails, Category, User } from "@shared/schema";
import { AssetPreviewModal } from "@/components/asset-preview-modal";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  const [selectedAsset, setSelectedAsset] = useState<AssetWithDetails | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Fetch trending assets
  const { data: trendingAssets, isLoading: assetsLoading } = useQuery({
    queryKey: ['/api/assets/trending'],
  });

  // Fetch recent assets
  const { data: recentAssets, isLoading: recentLoading } = useQuery({
    queryKey: ['/api/assets/recent'],
  });

  // Fetch top creators
  const { data: creators, isLoading: creatorsLoading } = useQuery({
    queryKey: ['/api/creators'],
  });

  // Handle asset preview
  const handlePreviewClick = (asset: AssetWithDetails) => {
    setSelectedAsset(asset);
  };

  // Filter assets by category
  const getFilteredAssets = () => {
    if (!trendingAssets) return [];
    if (activeFilter === "all") return trendingAssets;
    
    return trendingAssets.filter(
      (asset: AssetWithDetails) => asset.category.name.toLowerCase().includes(activeFilter.toLowerCase())
    );
  };

  return (
    <>
      <HeroSection />

      {/* Popular Categories */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Popular Categories</h2>
          <Link href="/categories">
            <div className="text-primary hover:text-primary/90 flex items-center text-sm cursor-pointer">
              View All <i className="ri-arrow-right-line ml-1"></i>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories?.map((category: Category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Trending Assets */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Trending Assets</h2>
          <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              className={activeFilter === "all" ? "bg-primary text-white" : "bg-dark-700 text-gray-300 hover:bg-dark-600"}
              onClick={() => setActiveFilter("all")}
            >
              All
            </Button>
            <Button
              variant={activeFilter === "design" ? "default" : "outline"}
              size="sm"
              className={activeFilter === "design" ? "bg-primary text-white" : "bg-dark-700 text-gray-300 hover:bg-dark-600"}
              onClick={() => setActiveFilter("design")}
            >
              Design
            </Button>
            <Button
              variant={activeFilter === "code" ? "default" : "outline"}
              size="sm"
              className={activeFilter === "code" ? "bg-primary text-white" : "bg-dark-700 text-gray-300 hover:bg-dark-600"}
              onClick={() => setActiveFilter("code")}
            >
              Code
            </Button>
            <Button
              variant={activeFilter === "video" ? "default" : "outline"}
              size="sm"
              className={activeFilter === "video" ? "bg-primary text-white" : "bg-dark-700 text-gray-300 hover:bg-dark-600 hidden md:block"}
              onClick={() => setActiveFilter("video")}
            >
              Video
            </Button>
            <Button
              variant={activeFilter === "audio" ? "default" : "outline"}
              size="sm"
              className={activeFilter === "audio" ? "bg-primary text-white" : "bg-dark-700 text-gray-300 hover:bg-dark-600 hidden md:block"}
              onClick={() => setActiveFilter("audio")}
            >
              Audio
            </Button>
          </div>
        </div>

        {assetsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-dark-700 rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-dark-600"></div>
                <div className="p-4">
                  <div className="h-5 bg-dark-600 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-dark-600 rounded w-full mb-3"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-dark-600"></div>
                      <div className="ml-2 h-3 bg-dark-600 rounded w-24"></div>
                    </div>
                    <div className="h-3 bg-dark-600 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getFilteredAssets().map((asset: AssetWithDetails) => (
              <AssetCard 
                key={asset.id} 
                asset={asset} 
                onPreviewClick={handlePreviewClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* Top Creators */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Top Creators</h2>
          <Link href="/creators">
            <div className="text-primary hover:text-primary/90 flex items-center text-sm cursor-pointer">
              View All <i className="ri-arrow-right-line ml-1"></i>
            </div>
          </Link>
        </div>
        
        {creatorsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-dark-700 rounded-xl p-5 animate-pulse">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-dark-600 mb-4"></div>
                  <div className="h-5 bg-dark-600 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-dark-600 rounded w-1/3 mb-3"></div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="bg-dark-600 h-6 w-16 rounded-full"></div>
                    <div className="bg-dark-600 h-6 w-16 rounded-full"></div>
                  </div>
                  <div className="flex w-full justify-between mb-4">
                    <div className="bg-dark-600 h-10 w-16 rounded"></div>
                    <div className="bg-dark-600 h-10 w-16 rounded"></div>
                    <div className="bg-dark-600 h-10 w-16 rounded"></div>
                  </div>
                  <div className="bg-dark-600 h-10 w-full rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {creators?.map((creator: User) => (
              <CreatorCard 
                key={creator.id} 
                creator={{
                  ...creator,
                  assetCount: 32,
                  rating: 4.9,
                  salesCount: 10000,
                  tags: ["UI Kits", "Icons"]
                }} 
              />
            ))}
          </div>
        )}
      </section>

      <FeaturedSection />

      {/* Recently Added */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Recently Added</h2>
          <Link href="/recent">
            <div className="text-primary hover:text-primary/90 flex items-center text-sm cursor-pointer">
              View All <i className="ri-arrow-right-line ml-1"></i>
            </div>
          </Link>
        </div>
        
        {recentLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-dark-700 rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-dark-600"></div>
                <div className="p-4">
                  <div className="h-5 bg-dark-600 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-dark-600 rounded w-full mb-3"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-dark-600"></div>
                      <div className="ml-2 h-3 bg-dark-600 rounded w-24"></div>
                    </div>
                    <div className="h-3 bg-dark-600 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentAssets?.map((asset: AssetWithDetails) => (
              <AssetCard 
                key={asset.id} 
                asset={asset} 
                onPreviewClick={handlePreviewClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* Asset Preview Modal */}
      <AssetPreviewModal
        asset={selectedAsset}
        isOpen={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    </>
  );
}
