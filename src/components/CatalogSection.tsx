import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { courses, Course } from "@/data/mockData";
import { CourseCard } from "./CourseCard";
import { FilterSidebar, Filters } from "./FilterSidebar";
import { FilterSheet } from "./FilterSheet";

const ITEMS_PER_PAGE = 20;

const defaultFilters: Filters = {
  priceRange: [0, 200000],
  isFree: false,
  hasInstallment: false,
  hasDiscount: false,
  formats: [],
  durations: [],
  ratings: [],
  levels: [],
  schools: [],
  categories: [],
};

interface CatalogSectionProps {
  searchQuery: string;
  initialCategory?: string;
}

export const CatalogSection = ({ searchQuery, initialCategory }: CatalogSectionProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => {
    // Initialize from URL
    const priceMin = searchParams.get("price_min");
    const priceMax = searchParams.get("price_max");
    const category = searchParams.get("category") || initialCategory;

    return {
      ...defaultFilters,
      priceRange: [
        priceMin ? parseInt(priceMin) : 0,
        priceMax ? parseInt(priceMax) : 200000,
      ],
      categories: category ? [category] : [],
      isFree: searchParams.get("free") === "true",
      hasDiscount: searchParams.get("discount") === "true",
    };
  });
  const [sortBy, setSortBy] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.priceRange[0] > 0) params.set("price_min", String(filters.priceRange[0]));
    if (filters.priceRange[1] < 200000) params.set("price_max", String(filters.priceRange[1]));
    if (filters.categories.length > 0) params.set("category", filters.categories.join(","));
    if (filters.schools.length > 0) params.set("school", filters.schools.join(","));
    if (filters.isFree) params.set("free", "true");
    if (filters.hasDiscount) params.set("discount", "true");
    if (sortBy !== "relevance") params.set("sort", sortBy);
    setSearchParams(params, { replace: true });
  }, [filters, sortBy, setSearchParams]);

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.school.name.toLowerCase().includes(query) ||
          c.category.name.toLowerCase().includes(query)
      );
    }

    // Price range
    result = result.filter(
      (c) => c.price >= filters.priceRange[0] && c.price <= filters.priceRange[1]
    );

    // Special filters
    if (filters.isFree) result = result.filter((c) => c.isFree);
    if (filters.hasInstallment) result = result.filter((c) => c.installment);
    if (filters.hasDiscount) result = result.filter((c) => c.hasDiscount);

    // Categories
    if (filters.categories.length > 0) {
      result = result.filter((c) => filters.categories.includes(c.category.slug));
    }

    // Schools
    if (filters.schools.length > 0) {
      result = result.filter((c) => filters.schools.includes(c.school.slug));
    }

    // Formats
    if (filters.formats.length > 0) {
      result = result.filter((c) => filters.formats.includes(c.format));
    }

    // Durations
    if (filters.durations.length > 0) {
      result = result.filter((c) => filters.durations.includes(c.duration));
    }

    // Levels
    if (filters.levels.length > 0) {
      result = result.filter((c) => filters.levels.includes(c.level));
    }

    // Ratings
    if (filters.ratings.length > 0) {
      const minRating = Math.min(...filters.ratings);
      result = result.filter((c) => c.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "reviews":
        result.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      default:
        // relevance - keep original order
        break;
    }

    return result;
  }, [searchQuery, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200000) count++;
    if (filters.isFree) count++;
    if (filters.hasInstallment) count++;
    if (filters.hasDiscount) count++;
    count += filters.categories.length;
    count += filters.schools.length;
    count += filters.formats.length;
    count += filters.durations.length;
    count += filters.levels.length;
    count += filters.ratings.length;
    return count;
  }, [filters]);

  // Active filter chips
  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];

    if (filters.isFree) {
      chips.push({
        key: "free",
        label: "Бесплатные",
        onRemove: () => setFilters((f) => ({ ...f, isFree: false })),
      });
    }
    if (filters.hasDiscount) {
      chips.push({
        key: "discount",
        label: "Со скидкой",
        onRemove: () => setFilters((f) => ({ ...f, hasDiscount: false })),
      });
    }
    if (filters.hasInstallment) {
      chips.push({
        key: "installment",
        label: "С рассрочкой",
        onRemove: () => setFilters((f) => ({ ...f, hasInstallment: false })),
      });
    }

    filters.categories.forEach((cat) => {
      chips.push({
        key: `cat-${cat}`,
        label: cat,
        onRemove: () =>
          setFilters((f) => ({
            ...f,
            categories: f.categories.filter((c) => c !== cat),
          })),
      });
    });

    filters.schools.forEach((school) => {
      chips.push({
        key: `school-${school}`,
        label: school,
        onRemove: () =>
          setFilters((f) => ({
            ...f,
            schools: f.schools.filter((s) => s !== school),
          })),
      });
    });

    return chips;
  }, [filters]);

  const resetFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

  return (
    <section id="catalog" className="py-12 md:py-16 bg-background">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Каталог курсов
          <span className="text-muted-foreground font-normal text-lg ml-3">
            ({filteredCourses.length})
          </span>
        </h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            onReset={resetFilters}
            className="hidden lg:block w-64 flex-shrink-0"
          />

          {/* Main content */}
          <div className="flex-1">
            {/* Sort and mobile filter */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="lg:hidden">
                <FilterSheet
                  filters={filters}
                  onFiltersChange={setFilters}
                  onReset={resetFilters}
                  activeFiltersCount={activeFiltersCount}
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">По релевантности</SelectItem>
                  <SelectItem value="rating">По рейтингу</SelectItem>
                  <SelectItem value="price_asc">Сначала дешёвые</SelectItem>
                  <SelectItem value="price_desc">Сначала дорогие</SelectItem>
                  <SelectItem value="reviews">По отзывам</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active filter chips */}
            {activeFilterChips.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeFilterChips.map((chip) => (
                  <button
                    key={chip.key}
                    onClick={chip.onRemove}
                    className="filter-chip filter-chip-active group"
                  >
                    {chip.label}
                    <X className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  </button>
                ))}
                {activeFilterChips.length > 1 && (
                  <button onClick={resetFilters} className="filter-chip">
                    Сбросить все
                  </button>
                )}
              </div>
            )}

            {/* Course grid */}
            {paginatedCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">
                  Курсы не найдены
                </p>
                <Button onClick={resetFilters} variant="outline">
                  Сбросить фильтры
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
