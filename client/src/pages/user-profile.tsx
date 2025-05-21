import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { useToast } from "@/hooks/use-toast";
import { AssetWithDetails } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { AssetCard } from "@/components/asset-card";
import { AssetPreviewModal } from "@/components/asset-preview-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedAsset, setSelectedAsset] = useState<AssetWithDetails | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !user?.isLoading) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch user's purchased assets
  const { data: purchasedAssets } = useQuery({
    queryKey: ['/api/users/purchases'],
    enabled: !!user,
  });

  // Fetch user's created assets (if they're a creator)
  const { data: createdAssets } = useQuery({
    queryKey: ['/api/users/assets'],
    enabled: !!user && user.isCreator,
  });

  // Fetch user's favorites
  const { data: favorites } = useQuery({
    queryKey: ['/api/users/favorites'],
    enabled: !!user,
  });

  // Handle asset preview
  const handlePreviewClick = (asset: AssetWithDetails) => {
    setSelectedAsset(asset);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Loading profile...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="md:col-span-1">
          <Card className="bg-dark-800 border-dark-600">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <img 
                    src={user.avatarUrl || "https://via.placeholder.com/150"} 
                    alt={user.displayName} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                  />
                  {user.isCreator && (
                    <Badge className="absolute bottom-0 right-0 bg-primary px-3 py-1">Creator</Badge>
                  )}
                </div>
              </div>
              <CardTitle className="text-center text-2xl font-bold">{user.displayName}</CardTitle>
              <CardDescription className="text-center text-gray-400">@{user.username}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Bio</h3>
                <p className="mt-1 text-sm">{user.bio || "No bio provided"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400">Member Since</h3>
                <p className="mt-1 text-sm">
                  {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : "Unknown"}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <p className="text-xl font-bold">{purchasedAssets?.length || 0}</p>
                  <p className="text-xs text-gray-400">Purchases</p>
                </div>
                {user.isCreator && (
                  <div className="text-center">
                    <p className="text-xl font-bold">{createdAssets?.length || 0}</p>
                    <p className="text-xs text-gray-400">Assets</p>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-xl font-bold">{favorites?.length || 0}</p>
                  <p className="text-xs text-gray-400">Favorites</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2 border-dark-600 hover:bg-dark-700"
                onClick={() => navigate("/profile/edit")}
              >
                <i className="ri-edit-line"></i>
                Edit Profile
              </Button>
              <Button 
                variant="destructive" 
                className="w-full flex items-center gap-2"
                onClick={handleLogout}
              >
                <i className="ri-logout-box-line"></i>
                Logout
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Assets Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="purchased" className="w-full">
            <TabsList className="mb-6 bg-dark-700">
              <TabsTrigger value="purchased">Purchased</TabsTrigger>
              {user.isCreator && (
                <TabsTrigger value="created">My Assets</TabsTrigger>
              )}
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            
            <TabsContent value="purchased" className="mt-0">
              <h2 className="text-xl font-bold mb-4">Your Purchased Assets</h2>
              {purchasedAssets?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {purchasedAssets.map((asset: AssetWithDetails) => (
                    <AssetCard 
                      key={asset.id} 
                      asset={asset} 
                      onPreviewClick={handlePreviewClick} 
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-dark-700 rounded-lg p-8 text-center">
                  <i className="ri-shopping-bag-line text-5xl mb-4 text-gray-500"></i>
                  <h3 className="text-xl font-medium mb-2">No Purchases Yet</h3>
                  <p className="text-gray-400 mb-4">You haven't purchased any assets yet.</p>
                  <Button onClick={() => navigate("/explore")}>
                    Browse Assets
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {user.isCreator && (
              <TabsContent value="created" className="mt-0">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Your Created Assets</h2>
                  <Button onClick={() => navigate("/assets/create")}>
                    <i className="ri-add-line mr-2"></i>
                    Upload New Asset
                  </Button>
                </div>
                {createdAssets?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {createdAssets.map((asset: AssetWithDetails) => (
                      <AssetCard 
                        key={asset.id} 
                        asset={asset} 
                        onPreviewClick={handlePreviewClick} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-dark-700 rounded-lg p-8 text-center">
                    <i className="ri-gallery-upload-line text-5xl mb-4 text-gray-500"></i>
                    <h3 className="text-xl font-medium mb-2">No Assets Yet</h3>
                    <p className="text-gray-400 mb-4">Start uploading your digital assets to sell on the marketplace.</p>
                    <Button onClick={() => navigate("/assets/create")}>
                      Upload Your First Asset
                    </Button>
                  </div>
                )}
              </TabsContent>
            )}
            
            <TabsContent value="favorites" className="mt-0">
              <h2 className="text-xl font-bold mb-4">Your Favorites</h2>
              {favorites?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favorites.map((asset: AssetWithDetails) => (
                    <AssetCard 
                      key={asset.id} 
                      asset={asset} 
                      onPreviewClick={handlePreviewClick} 
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-dark-700 rounded-lg p-8 text-center">
                  <i className="ri-heart-line text-5xl mb-4 text-gray-500"></i>
                  <h3 className="text-xl font-medium mb-2">No Favorites Yet</h3>
                  <p className="text-gray-400 mb-4">Browse assets and mark your favorites to save them here.</p>
                  <Button onClick={() => navigate("/explore")}>
                    Explore Assets
                  </Button>
                </div>
              )}
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
    </div>
  );
}