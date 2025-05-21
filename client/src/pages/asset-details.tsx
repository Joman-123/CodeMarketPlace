import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { ChevronLeft, Heart, Share2, CheckCircle, Star, StarHalf } from 'lucide-react';
import { AssetWithDetails } from '@shared/schema';

export default function AssetDetails({ params }: { params: { id: string } }) {
  const assetId = parseInt(params.id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: asset, isLoading, error } = useQuery({
    queryKey: [`/api/assets/${assetId}`],
  });

  useEffect(() => {
    if (asset) {
      setSelectedImage(asset.previewUrl);
    }
  }, [asset]);

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="fill-amber-400 text-amber-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-amber-400 text-amber-400" />);
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-700 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="aspect-video bg-dark-700 rounded-lg"></div>
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-dark-700 rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-dark-700 rounded w-3/4"></div>
              <div className="h-6 bg-dark-700 rounded w-1/3"></div>
              <div className="h-4 bg-dark-700 rounded w-full mt-4"></div>
              <div className="h-4 bg-dark-700 rounded w-full"></div>
              <div className="h-4 bg-dark-700 rounded w-3/4"></div>
              <div className="space-y-2 mt-6">
                <div className="h-4 bg-dark-700 rounded w-1/2"></div>
                <div className="h-4 bg-dark-700 rounded w-full"></div>
                <div className="h-4 bg-dark-700 rounded w-full"></div>
              </div>
              <div className="mt-6">
                <div className="h-12 bg-dark-700 rounded w-full mb-2"></div>
                <div className="h-12 bg-dark-700 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Asset Not Found</h2>
        <p className="text-gray-400 mb-6">The asset you're looking for doesn't exist or has been removed.</p>
        <Link href="/explore">
          <Button>Browse Other Assets</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Link href="/explore">
          <Button variant="ghost" size="sm" className="text-gray-400">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Explore
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column - Asset Preview */}
        <div>
          <div className="rounded-lg overflow-hidden mb-4">
            <img 
              src={selectedImage || asset.previewUrl} 
              alt={asset.title} 
              className="w-full object-cover"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto hide-scrollbar pb-2">
            {asset.thumbnails?.map((thumbnail, index) => (
              <img
                key={index}
                src={thumbnail}
                alt={`${asset.title} thumbnail ${index + 1}`}
                className={`w-20 h-20 rounded object-cover border-2 cursor-pointer ${
                  selectedImage === thumbnail ? 'border-primary' : 'border-dark-600'
                }`}
                onClick={() => setSelectedImage(thumbnail)}
              />
            ))}
          </div>
        </div>
        
        {/* Right Column - Asset Details */}
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <Badge className="mb-2 bg-dark-700 text-gray-300">
                {asset.category.name}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{asset.title}</h1>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <span>By</span>
                <Link href={`/creator/${asset.creator.id}`}>
                  <a className="text-white hover:text-primary">{asset.creator.displayName}</a>
                </Link>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  {renderRatingStars(asset.rating)}
                  <span className="ml-1">{asset.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="text-gray-400">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="text-gray-400">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl font-bold text-white">${asset.price.toFixed(2)}</div>
              {asset.price < 100 && (
                <>
                  <div className="text-lg text-green-500 line-through">
                    ${(asset.price * 1.3).toFixed(2)}
                  </div>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400">
                    30% OFF
                  </Badge>
                </>
              )}
            </div>
            
            <p className="text-gray-400 mb-6">{asset.description}</p>
            
            <div className="mb-6">
              <h3 className="font-medium text-white mb-2">What's included:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {asset.tags?.map((tag, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </li>
                ))}
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  6 Months Support
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button className="w-full py-6 primary-gradient rounded-lg text-white font-medium">
                Buy Now - ${asset.price.toFixed(2)}
              </Button>
              <Button variant="outline" className="w-full py-6 border border-primary text-primary hover:bg-primary hover:text-white">
                Add to Cart
              </Button>
            </div>
          </div>
          
          <div className="border-t border-dark-600 pt-4">
            <div className="flex justify-between text-sm">
              <div className="flex items-center text-gray-400">
                <i className="ri-download-line mr-1"></i>
                {asset.downloadCount} downloads
              </div>
              <div className="text-gray-400">
                Last updated: {new Date(asset.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
