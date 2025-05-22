import { ReactNode, useState } from "react";
import { SidebarNav } from "./sidebar-nav";
import { MobileNav } from "./mobile-nav";
import { SearchBar } from "./search-bar";
import { Link, useLocation } from "wouter";
import { Bell, Search } from "lucide-react";
import { AssetWithDetails } from "@shared/schema";
import { AssetPreviewModal } from "./asset-preview-modal";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [, setLocation] = useLocation();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetWithDetails | null>(null);

  const handleSearch = (query: string) => {
    setLocation(`/search?q=${encodeURIComponent(query)}`);
    setIsSearchExpanded(false);
  };

  return (
    <div className="flex flex-col h-screen lg:flex-row">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto bg-dark-800">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-dark-800 border-b border-dark-700 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center lg:hidden">
              <div className="h-9 w-9 rounded-lg primary-gradient flex items-center justify-center mr-2">
                <i className="ri-store-2-line text-white text-lg"></i>
              </div>
              <h1 className="text-lg font-bold text-white">CreatorHub</h1>
            </div>
            
            <div className="relative w-full max-w-xl mx-4 hidden md:block">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            <div className="flex items-center">
              {isSearchExpanded ? (
                <div className="fixed inset-0 bg-dark-800/95 z-50 p-4 md:hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-medium">Search</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSearchExpanded(false)}
                      className="text-gray-400"
                    >
                      <i className="ri-close-line text-xl"></i>
                    </Button>
                  </div>
                  <SearchBar 
                    onSearch={(query) => {
                      handleSearch(query);
                      setIsSearchExpanded(false);
                    }}
                  />
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 rounded-full hover:bg-dark-700 text-gray-400 md:hidden"
                  onClick={() => setIsSearchExpanded(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 p-2 rounded-full hover:bg-dark-700 text-gray-400"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Link href="/profile">
                <div className="ml-3 relative cursor-pointer">
                  <img
                    className="h-9 w-9 rounded-full object-cover border-2 border-primary"
                    src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
                    alt="User profile"
                  />
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="container mx-auto px-4 py-6 pb-20 lg:pb-6">
          {children}
        </div>

        <MobileNav />
      </main>

      {/* Asset Preview Modal */}
      <AssetPreviewModal
        asset={selectedAsset}
        isOpen={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    </div>
  );
}
