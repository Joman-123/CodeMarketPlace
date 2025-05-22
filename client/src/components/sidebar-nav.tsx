import { Link, useLocation } from "wouter";

export function SidebarNav() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-dark-700 border-r border-dark-600 h-screen">
      <div className="p-4 border-b border-dark-600">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-lg primary-gradient flex items-center justify-center">
            <i className="ri-store-2-line text-white text-xl"></i>
          </div>
          <h1 className="ml-3 text-xl font-bold text-white">CreatorHub</h1>
        </div>
        <p className="mt-2 text-xs text-gray-400">Digital Asset Marketplace</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/">
              <div className={`flex items-center p-3 rounded-lg hover:bg-dark-600 ${isActive('/') ? 'bg-dark-600 text-gray-200' : 'text-gray-400'} cursor-pointer`}>
                <i className="ri-home-5-line text-lg"></i>
                <span className={`ml-3 ${isActive('/') ? 'font-medium' : ''}`}>Home</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/explore">
              <div className={`flex items-center p-3 rounded-lg hover:bg-dark-600 ${isActive('/explore') ? 'bg-dark-600 text-gray-200' : 'text-gray-400'} cursor-pointer`}>
                <i className="ri-compass-3-line text-lg"></i>
                <span className={`ml-3 ${isActive('/explore') ? 'font-medium' : ''}`}>Explore</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/trending">
              <div className={`flex items-center p-3 rounded-lg hover:bg-dark-600 ${isActive('/trending') ? 'bg-dark-600 text-gray-200' : 'text-gray-400'} cursor-pointer`}>
                <i className="ri-fire-line text-lg"></i>
                <span className={`ml-3 ${isActive('/trending') ? 'font-medium' : ''}`}>Trending</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/collections">
              <div className={`flex items-center p-3 rounded-lg hover:bg-dark-600 ${isActive('/collections') ? 'bg-dark-600 text-gray-200' : 'text-gray-400'} cursor-pointer`}>
                <i className="ri-star-line text-lg"></i>
                <span className={`ml-3 ${isActive('/collections') ? 'font-medium' : ''}`}>Collections</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/creators">
              <div className={`flex items-center p-3 rounded-lg hover:bg-dark-600 ${isActive('/creators') ? 'bg-dark-600 text-gray-200' : 'text-gray-400'} cursor-pointer`}>
                <i className="ri-user-star-line text-lg"></i>
                <span className={`ml-3 ${isActive('/creators') ? 'font-medium' : ''}`}>Creators</span>
              </div>
            </Link>
          </li>
        </ul>
        
        <div className="pt-6 mt-6 border-t border-dark-600">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/category/1">
                <div className={`flex items-center p-3 rounded-lg hover:bg-dark-600 ${isActive('/category/1') ? 'bg-dark-600 text-gray-200' : 'text-gray-400'} cursor-pointer`}>
                  <i className="ri-image-line text-lg"></i>
                  <span className="ml-3">Graphics</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/category/2">
                <div className={`flex items-center p-3 rounded-lg hover:bg-dark-600 ${isActive('/category/2') ? 'bg-dark-600 text-gray-200' : 'text-gray-400'} cursor-pointer`}>
                  <i className="ri-file-code-line text-lg"></i>
                  <span className="ml-3">Code</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/category/3">
                <div className={`flex items-center p-3 rounded-lg hover:bg-dark-600 ${isActive('/category/3') ? 'bg-dark-600 text-gray-200' : 'text-gray-400'} cursor-pointer`}>
                  <i className="ri-video-line text-lg"></i>
                  <span className="ml-3">Video</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/category/5">
                <div className={`flex items-center p-3 rounded-lg hover:bg-dark-600 ${isActive('/category/5') ? 'bg-dark-600 text-gray-200' : 'text-gray-400'} cursor-pointer`}>
                  <i className="ri-music-2-line text-lg"></i>
                  <span className="ml-3">Audio</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/category/6">
                <div className={`flex items-center p-3 rounded-lg hover:bg-dark-600 ${isActive('/category/6') ? 'bg-dark-600 text-gray-200' : 'text-gray-400'} cursor-pointer`}>
                  <i className="ri-gamepad-line text-lg"></i>
                  <span className="ml-3">Game Assets</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="p-4 border-t border-dark-600">
        <Link href="/settings">
          <div className={`flex items-center p-3 rounded-lg hover:bg-dark-600 ${isActive('/settings') ? 'bg-dark-600 text-gray-200' : 'text-gray-400'} cursor-pointer`}>
            <i className="ri-settings-3-line text-lg"></i>
            <span className="ml-3">Settings</span>
          </div>
        </Link>
        <Link href="/help">
          <div className={`flex items-center p-3 rounded-lg hover:bg-dark-600 ${isActive('/help') ? 'bg-dark-600 text-gray-200' : 'text-gray-400'} cursor-pointer`}>
            <i className="ri-question-line text-lg"></i>
            <span className="ml-3">Help Center</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
