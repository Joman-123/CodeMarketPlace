import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { AssetCard } from '@/components/asset-card';
import { SearchBar } from '@/components/search-bar';
import { AssetPreviewModal } from '@/components/asset-preview-modal';
import { AssetWithDetails, Category } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { SlidersHorizontal, XCircle } from 'lucide-react';

export default function Explore() {
  const [, setLocation] = useLocation();
  const [selectedAsset, setSelectedAsset] = useState<AssetWithDetails | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [sortOption, setSortOption] = useState<string>('popular');

  // Fetch all assets
  const { data: assets, isLoading } = useQuery({
    queryKey: ['/api/assets'],
  });

  // Fetch all categories
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  const handlePreviewClick = (asset: AssetWithDetails) => {
    setSelectedAsset(asset);
  };

  const handleSearch = (query: string) => {
    setLocation(`/search?q=${encodeURIComponent(query)}`);
  };

  // Filter assets based on selected filters
  const filteredAssets = assets?.filter((asset: AssetWithDetails) => {
    // Filter by category
    if (selectedCategory !== 'all' && asset.category.id !== parseInt(selectedCategory)) {
      return false;
    }

    // Filter by price
    if (asset.price < priceRange[0] || asset.price > priceRange[1]) {
      return false;
    }

    return true;
  });

  // Sort assets based on selected sort option
  const sortedAssets = filteredAssets?.sort((a: AssetWithDetails, b: AssetWithDetails) => {
    switch (sortOption) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
      default:
        return b.downloadCount - a.downloadCount;
    }
  });

  return (
    <div className="container mx-auto">
      {/* Top search section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-6">Explore Digital Assets</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar 
            onSearch={handleSearch} 
            className="flex-1"
          />
          <Button 
            variant="outline" 
            className="md:w-auto flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        {showFilters && (
          <div className="bg-dark-700 rounded-lg p-6 h-fit lg:sticky lg:top-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-white">Filters</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => setShowFilters(false)}
              >
                <XCircle className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Categories filter */}
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Categories</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="category-all" 
                      checked={selectedCategory === 'all'} 
                      onCheckedChange={() => setSelectedCategory('all')}
                      className="mr-2"
                    />
                    <label htmlFor="category-all" className="text-sm text-gray-300 cursor-pointer">
                      All Categories
                    </label>
                  </div>
                  
                  {categories?.map((category: Category) => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox 
                        id={`category-${category.id}`} 
                        checked={selectedCategory === category.id.toString()} 
                        onCheckedChange={() => setSelectedCategory(category.id.toString())}
                        className="mr-2"
                      />
                      <label htmlFor={`category-${category.id}`} className="text-sm text-gray-300 cursor-pointer">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price range */}
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Price Range</h4>
                <Slider
                  defaultValue={[0, 100]}
                  max={100}
                  step={1}
                  value={priceRange}
                  onValueChange={(values) => setPriceRange(values)}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              
              {/* Sort options */}
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Sort By</h4>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Clear filters button */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceRange([0, 100]);
                  setSortOption('popular');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
        
        {/* Assets grid */}
        <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-400">{sortedAssets?.length || 0} assets found</p>
                <div className="hidden md:block">
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {sortedAssets?.length === 0 ? (
                <div className="bg-dark-700 rounded-lg p-10 text-center">
                  <h3 className="text-xl font-medium text-white mb-2">No assets found</h3>
                  <p className="text-gray-400 mb-6">Try adjusting your filters to find what you're looking for.</p>
                  <Button 
                    onClick={() => {
                      setSelectedCategory('all');
                      setPriceRange([0, 100]);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedAssets?.map((asset: AssetWithDetails) => (
                    <AssetCard 
                      key={asset.id} 
                      asset={asset} 
                      onPreviewClick={handlePreviewClick}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Asset Preview Modal */}
      <AssetPreviewModal
        asset={selectedAsset}
        isOpen={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    </div>
  );
}
