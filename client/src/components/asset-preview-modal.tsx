import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AssetWithDetails } from "@shared/schema";
import { CheckCircle, Star, StarHalf } from "lucide-react";

interface AssetPreviewModalProps {
  asset: AssetWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AssetPreviewModal({ asset, isOpen, onClose }: AssetPreviewModalProps) {
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | undefined>(
    asset?.previewUrl
  );

  if (!asset) return null;

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="fill-amber-400 text-amber-400 w-4 h-4" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-amber-400 text-amber-400 w-4 h-4" />);
    }

    return stars;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-dark-700 text-white max-w-4xl">
        <DialogHeader>
          <DialogTitle>{asset.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3">
            <img
              src={selectedThumbnail || asset.previewUrl}
              alt={asset.title}
              className="w-full h-auto rounded-lg"
            />

            <div className="flex space-x-2 mt-4 overflow-x-auto hide-scrollbar pb-2">
              {asset.thumbnails?.map((thumbnail, index) => (
                <img
                  key={index}
                  src={thumbnail}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 rounded object-cover border-2 cursor-pointer ${
                    (selectedThumbnail || asset.previewUrl) === thumbnail 
                      ? "border-primary" 
                      : "border-dark-600"
                  }`}
                  onClick={() => setSelectedThumbnail(thumbnail)}
                />
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">
                  By <span className="text-white">{asset.creator.displayName}</span>
                </span>
                <div className="flex items-center text-amber-400">
                  {renderRatingStars(asset.rating)}
                  <span className="ml-1 text-white text-sm">{asset.rating.toFixed(1)}</span>
                </div>
              </div>
              <h4 className="text-2xl font-bold text-white mb-1">${asset.price.toFixed(2)}</h4>
              <div className="flex items-center text-sm">
                <span className="text-green-500 line-through mr-2">${(asset.price * 1.3).toFixed(2)}</span>
                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs">
                  -30% Limited Offer
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-white font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-400">{asset.description}</p>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Includes</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  {asset.tags?.map((tag, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="text-primary mr-2 h-4 w-4" />
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </li>
                  ))}
                  <li className="flex items-center">
                    <CheckCircle className="text-primary mr-2 h-4 w-4" />
                    6 Months Support
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full py-3 primary-gradient rounded-lg text-white font-medium">
                Add to Cart
              </Button>
              <Button
                variant="outline" 
                className="w-full py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
