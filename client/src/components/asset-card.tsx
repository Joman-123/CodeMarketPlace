import { Link } from "wouter";
import { Heart } from "lucide-react";
import { AssetWithDetails } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AssetCardProps {
  asset: AssetWithDetails;
  onPreviewClick: (asset: AssetWithDetails) => void;
}

export function AssetCard({ asset, onPreviewClick }: AssetCardProps) {
  return (
    <div className="card-hover bg-dark-700 rounded-xl overflow-hidden">
      <div className="relative aspect-video">
        <img 
          src={asset.previewUrl} 
          alt={asset.title} 
          className="w-full h-full object-cover"
        />
        <Badge 
          className="absolute top-2 right-2 bg-dark-800/80 backdrop-blur-sm"
          variant="outline"
        >
          {asset.category.name}
        </Badge>
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className="h-4 w-4 text-white" />
        </Button>
      </div>
      <div 
        className="p-4 cursor-pointer" 
        onClick={() => onPreviewClick(asset)}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-white">{asset.title}</h3>
          <span className="font-bold text-primary">${asset.price}</span>
        </div>
        <p className="text-sm text-gray-400 mb-3">{asset.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={asset.creator.avatarUrl || ''} 
              alt={asset.creator.displayName} 
              className="w-6 h-6 rounded-full"
            />
            <span className="ml-2 text-xs text-gray-400">by <span className="text-white">{asset.creator.displayName}</span></span>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <i className="ri-download-line mr-1"></i> {asset.downloadCount > 1000 ? `${(asset.downloadCount / 1000).toFixed(1)}k` : asset.downloadCount}
          </div>
        </div>
      </div>
    </div>
  );
}
