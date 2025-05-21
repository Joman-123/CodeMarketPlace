import { Link } from "wouter";
import { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.id}`}>
      <div className="card-hover bg-dark-700 rounded-xl p-4 flex flex-col items-center justify-center aspect-square text-center cursor-pointer">
        <div className="h-12 w-12 rounded-full flex items-center justify-center primary-gradient mb-3">
          <i className={`${category.iconName} text-2xl text-white`}></i>
        </div>
        <h3 className="font-medium text-white">{category.name}</h3>
        <p className="text-xs text-gray-400 mt-1">
          {category.assetCount && category.assetCount > 1000 
            ? `${(category.assetCount / 1000).toFixed(1)}k+ assets` 
            : `${category.assetCount ?? 0}+ assets`}
        </p>
      </div>
    </Link>
  );
}
