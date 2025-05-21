import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AssetCard } from "@/components/asset-card";
import { Badge } from '@/components/ui/badge';
import { AssetPreviewModal } from '@/components/asset-preview-modal';
import { AssetWithDetails, User } from '@shared/schema';
import { MessageSquare, Share2, Instagram, Twitter, Globe } from 'lucide-react';

export default function CreatorProfile({ params }: { params: { id: string } }) {
  const creatorId = parseInt(params.id);
  const [selectedAsset, setSelectedAsset] = useState<AssetWithDetails | null>(null);

  const { data: creator, isLoading: creatorLoading } = useQuery({
    queryKey: [`/api/users/${creatorId}`],
  });

  const { data: assets, isLoading: assetsLoading } = useQuery({
    queryKey: ['/api/assets', { creatorId }],
  });

  if (creatorLoading || assetsLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-dark-700 w-full rounded-lg mb-6"></div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="h-32 w-32 bg-dark-700 rounded-full -mt-16 border-4 border-dark-800 mb-4"></div>
            <div className="h-8 bg-dark-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-dark-700 rounded w-1/2 mb-4"></div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-dark-700 rounded w-full"></div>
              <div className="h-4 bg-dark-700 rounded w-full"></div>
            </div>
            <div className="h-10 bg-dark-700 rounded mb-2"></div>
            <div className="h-10 bg-dark-700 rounded"></div>
          </div>
          <div className="md:w-2/3">
            <div className="h-10 bg-dark-700 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-dark-700 rounded-xl overflow-hidden">
                  <div className="aspect-video bg-dark-600"></div>
                  <div className="p-4">
                    <div className="h-5 bg-dark-600 rounded mb-2"></div>
                    <div className="h-4 bg-dark-600 rounded mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-dark-600 rounded w-1/3"></div>
                      <div className="h-4 bg-dark-600 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-white mb-4">Creator Not Found</h2>
        <p className="text-gray-400 mb-6">The creator you're looking for doesn't exist or has been removed.</p>
        <Button>
          Back to Creators
        </Button>
      </div>
    );
  }

  const creatorStats = {
    assetCount: assets?.length || 0,
    rating: 4.9,
    salesCount: 12000,
    followers: 1250,
    joinedDate: new Date(creator.joinedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  };

  const handlePreviewClick = (asset: AssetWithDetails) => {
    setSelectedAsset(asset);
  };

  return (
    <>
      <div className="bg-dark-700 h-48 rounded-lg mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary-500/20"></div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Creator Profile Sidebar */}
        <div className="md:w-1/3">
          <div className="relative z-10">
            <img 
              src={creator.avatarUrl || ''}
              alt={creator.displayName} 
              className="h-32 w-32 rounded-full object-cover -mt-16 border-4 border-dark-800 mb-4"
            />
            <h1 className="text-2xl font-bold text-white mb-1">{creator.displayName}</h1>
            <p className="text-primary mb-4">@{creator.username}</p>
            
            <p className="text-gray-400 mb-4">{creator.bio}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="bg-dark-600 text-gray-300">UI Design</Badge>
              <Badge variant="secondary" className="bg-dark-600 text-gray-300">Illustrations</Badge>
              <Badge variant="secondary" className="bg-dark-600 text-gray-300">Icons</Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-lg font-bold text-white">{creatorStats.assetCount}</div>
                <div className="text-xs text-gray-400">Products</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-lg font-bold text-white">{creatorStats.rating}</div>
                <div className="text-xs text-gray-400">Rating</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-lg font-bold text-white">{creatorStats.salesCount > 1000 ? `${Math.floor(creatorStats.salesCount/1000)}k` : creatorStats.salesCount}</div>
                <div className="text-xs text-gray-400">Sales</div>
              </div>
            </div>
            
            <div className="flex gap-2 mb-4">
              <Button className="w-full primary-gradient">
                <MessageSquare className="h-4 w-4 mr-2" /> Message
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="border-t border-dark-600 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Social Links</span>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Globe className="h-5 w-5" />
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-4">
                Member since {creatorStats.joinedDate}
              </div>
            </div>
          </div>
        </div>
        
        {/* Creator Assets */}
        <div className="md:w-2/3">
          <Tabs defaultValue="products">
            <TabsList className="bg-dark-700 mb-6">
              <TabsTrigger value="products">Products ({creatorStats.assetCount})</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assets?.map((asset: AssetWithDetails) => (
                  <AssetCard 
                    key={asset.id} 
                    asset={asset} 
                    onPreviewClick={handlePreviewClick}
                  />
                ))}
              </div>
              
              {assets?.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">This creator hasn't published any assets yet.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="about">
              <div className="bg-dark-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">About {creator.displayName}</h3>
                <p className="text-gray-400">
                  {creator.bio || 'No biography provided.'}
                </p>
                
                <h4 className="text-white font-medium mt-6 mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-dark-600 text-gray-300">UI Design</Badge>
                  <Badge variant="secondary" className="bg-dark-600 text-gray-300">Illustration</Badge>
                  <Badge variant="secondary" className="bg-dark-600 text-gray-300">Icon Design</Badge>
                  <Badge variant="secondary" className="bg-dark-600 text-gray-300">Branding</Badge>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="bg-dark-700 rounded-lg p-6 text-center">
                <p className="text-gray-400">Reviews coming soon!</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Asset Preview Modal */}
      <AssetPreviewModal
        asset={selectedAsset}
        isOpen={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    </>
  );
}
