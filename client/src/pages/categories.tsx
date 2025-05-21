import { useQuery } from '@tanstack/react-query';
import { CategoryCard } from '@/components/category-card';
import { Link } from 'wouter';
import { Category } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Categories() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <div className="mb-6 flex items-center">
          <div className="h-8 bg-dark-700 rounded w-32 animate-pulse"></div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-8 animate-pulse h-10 bg-dark-700 rounded w-64"></h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-dark-700 rounded-xl aspect-square animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="pl-0 text-gray-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-white mb-8">Browse Categories</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories?.map((category: Category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
      
      <div className="mt-16 bg-dark-700 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Can't find what you're looking for?</h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Our marketplace is constantly growing with new categories and assets. Let us know what type of digital assets would help you with your projects.
        </p>
        <Button className="primary-gradient">Request a Category</Button>
      </div>
    </div>
  );
}
