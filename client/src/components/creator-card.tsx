import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

interface CreatorCardProps {
  creator: User & {
    assetCount?: number;
    rating?: number;
    salesCount?: number;
    tags?: string[];
  };
}

export function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <div className="card-hover bg-dark-700 rounded-xl p-5">
      <div className="flex flex-col items-center text-center">
        <img 
          src={creator.avatarUrl || ''} 
          alt={`${creator.displayName} avatar`} 
          className="w-24 h-24 rounded-full object-cover border-4 border-primary mb-4"
        />
        <h3 className="font-semibold text-white text-lg">{creator.displayName}</h3>
        <p className="text-sm text-gray-400 mb-3">{creator.bio?.split(" ").slice(0, 3).join(" ") || "Digital Creator"}</p>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          {creator.tags?.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-dark-600 text-gray-300">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex w-full justify-between text-sm text-gray-400 mb-4">
          <div>
            <div className="font-medium text-white">{creator.assetCount || 0}</div>
            <div>Assets</div>
          </div>
          <div>
            <div className="font-medium text-white">{creator.rating || 0}</div>
            <div>Rating</div>
          </div>
          <div>
            <div className="font-medium text-white">
              {creator.salesCount && creator.salesCount > 1000 
                ? `${(creator.salesCount / 1000).toFixed(0)}k` 
                : creator.salesCount || 0}
            </div>
            <div>Sales</div>
          </div>
        </div>
        
        <Link href={`/creator/${creator.id}`}>
          <Button 
            variant="outline" 
            className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-all"
          >
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
