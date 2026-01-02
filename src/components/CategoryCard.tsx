import { Category } from "@/data/mockData";

interface CategoryCardProps {
  category: Category;
  onClick: (categorySlug: string) => void;
}

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  const Icon = category.icon;

  return (
    <button
      onClick={() => onClick(category.slug)}
      className="group flex flex-col items-center p-4 md:p-6 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-card-hover card-hover"
    >
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
      </div>
      <span className="text-sm md:text-base font-semibold text-foreground text-center mb-1">
        {category.name}
      </span>
      <span className="text-xs md:text-sm text-muted-foreground">
        {category.count} курсов
      </span>
    </button>
  );
};
