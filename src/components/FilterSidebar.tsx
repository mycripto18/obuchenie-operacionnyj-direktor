import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { categories, schools, formatPrice } from "@/data/mockData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface Filters {
  priceRange: [number, number];
  isFree: boolean;
  hasInstallment: boolean;
  hasDiscount: boolean;
  formats: string[];
  durations: string[];
  ratings: number[];
  levels: string[];
  schools: string[];
  categories: string[];
}

interface FilterSidebarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onReset: () => void;
  className?: string;
}

const durations = ["3 месяца", "6 месяцев", "9 месяцев", "12 месяцев", "18 месяцев"];
const levels = [
  { value: "beginner", label: "Начальный" },
  { value: "intermediate", label: "Средний" },
  { value: "advanced", label: "Продвинутый" },
];
const formats = [
  { value: "online", label: "Онлайн" },
  { value: "video", label: "Видеозаписи" },
];

export const FilterSidebar = ({ filters, onFiltersChange, onReset, className }: FilterSidebarProps) => {
  const [openSections, setOpenSections] = useState<string[]>(["price", "special", "category"]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
    console.log("Analytics: apply_filter", { filter: key, value });
  };

  const toggleArrayFilter = (key: keyof Filters, value: string) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated as any);
  };

  const FilterSection = ({
    id,
    title,
    children,
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
  }) => (
    <Collapsible
      open={openSections.includes(id)}
      onOpenChange={() => toggleSection(id)}
      className="border-b border-border pb-4"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-foreground font-semibold hover:text-primary transition-colors">
        {title}
        {openSections.includes(id) ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 space-y-3">{children}</CollapsibleContent>
    </Collapsible>
  );

  return (
    <aside className={className}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground">Фильтры</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4 mr-1" />
          Сбросить
        </Button>
      </div>

      <div className="space-y-4">
        {/* Price */}
        <FilterSection id="price" title="Цена">
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
              max={200000}
              step={5000}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{formatPrice(filters.priceRange[0])}</span>
              <span>{formatPrice(filters.priceRange[1])}</span>
            </div>
          </div>
        </FilterSection>

        {/* Special */}
        <FilterSection id="special" title="Специальные">
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={filters.isFree}
                onCheckedChange={(checked) => updateFilter("isFree", !!checked)}
              />
              <span className="text-sm text-foreground">Бесплатные</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={filters.hasInstallment}
                onCheckedChange={(checked) => updateFilter("hasInstallment", !!checked)}
              />
              <span className="text-sm text-foreground">С рассрочкой</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={filters.hasDiscount}
                onCheckedChange={(checked) => updateFilter("hasDiscount", !!checked)}
              />
              <span className="text-sm text-foreground">Со скидкой</span>
            </label>
          </div>
        </FilterSection>

        {/* Category */}
        <FilterSection id="category" title="Категория">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={filters.categories.includes(cat.slug)}
                  onCheckedChange={() => toggleArrayFilter("categories", cat.slug)}
                />
                <span className="text-sm text-foreground">{cat.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">({cat.count})</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* School */}
        <FilterSection id="school" title="Школа">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {schools.map((school) => (
              <label key={school.id} className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={filters.schools.includes(school.slug)}
                  onCheckedChange={() => toggleArrayFilter("schools", school.slug)}
                />
                <span className="text-sm text-foreground">{school.name}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Format */}
        <FilterSection id="format" title="Формат">
          <div className="space-y-2">
            {formats.map((format) => (
              <label key={format.value} className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={filters.formats.includes(format.value)}
                  onCheckedChange={() => toggleArrayFilter("formats", format.value)}
                />
                <span className="text-sm text-foreground">{format.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Duration */}
        <FilterSection id="duration" title="Длительность">
          <div className="space-y-2">
            {durations.map((duration) => (
              <label key={duration} className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={filters.durations.includes(duration)}
                  onCheckedChange={() => toggleArrayFilter("durations", duration)}
                />
                <span className="text-sm text-foreground">{duration}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Level */}
        <FilterSection id="level" title="Уровень">
          <div className="space-y-2">
            {levels.map((level) => (
              <label key={level.value} className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={filters.levels.includes(level.value)}
                  onCheckedChange={() => toggleArrayFilter("levels", level.value)}
                />
                <span className="text-sm text-foreground">{level.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Rating */}
        <FilterSection id="rating" title="Рейтинг">
          <div className="space-y-2">
            {[4.5, 4.0, 3.5].map((rating) => (
              <label key={rating} className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={filters.ratings.includes(rating)}
                  onCheckedChange={() => {
                    const current = filters.ratings;
                    const updated = current.includes(rating)
                      ? current.filter((r) => r !== rating)
                      : [...current, rating];
                    updateFilter("ratings", updated);
                  }}
                />
                <span className="text-sm text-foreground">От {rating}★</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </aside>
  );
};
