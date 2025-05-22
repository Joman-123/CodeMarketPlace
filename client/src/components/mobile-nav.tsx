import { Link, useLocation } from "wouter";

export function MobileNav() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-dark-700 border-t border-dark-600 py-2">
      <div className="flex justify-around items-center">
        <Link href="/">
          <div className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-primary' : 'text-gray-400'} cursor-pointer`}>
            <i className="ri-home-5-line text-xl"></i>
            <span className="text-xs mt-1">Home</span>
          </div>
        </Link>
        <Link href="/explore">
          <div className={`flex flex-col items-center p-2 ${isActive('/explore') ? 'text-primary' : 'text-gray-400'} cursor-pointer`}>
            <i className="ri-compass-3-line text-xl"></i>
            <span className="text-xs mt-1">Explore</span>
          </div>
        </Link>
        <Link href="/favorites">
          <div className={`flex flex-col items-center p-2 ${isActive('/favorites') ? 'text-primary' : 'text-gray-400'} cursor-pointer`}>
            <i className="ri-heart-line text-xl"></i>
            <span className="text-xs mt-1">Favorites</span>
          </div>
        </Link>
        <Link href="/profile">
          <div className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'text-primary' : 'text-gray-400'} cursor-pointer`}>
            <i className="ri-user-line text-xl"></i>
            <span className="text-xs mt-1">Profile</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
