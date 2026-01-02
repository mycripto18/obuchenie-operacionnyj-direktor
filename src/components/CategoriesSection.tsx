import { categories } from "@/data/mockData";
import { CategoryCard } from "./CategoryCard";

interface CategoriesSectionProps {
  onCategoryClick: (categorySlug: string) => void;
}

export const CategoriesSection = ({ onCategoryClick }: CategoriesSectionProps) => {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Направления обучения
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={onCategoryClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
