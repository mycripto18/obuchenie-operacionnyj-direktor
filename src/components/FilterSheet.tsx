import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { FilterSidebar, Filters } from "./FilterSidebar";

interface FilterSheetProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onReset: () => void;
  activeFiltersCount: number;
}

export const FilterSheet = ({ filters, onFiltersChange, onReset, activeFiltersCount }: FilterSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Фильтры
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
        <SheetHeader className="mb-4">
          <SheetTitle>Фильтры</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto h-full pb-20">
          <FilterSidebar
            filters={filters}
            onFiltersChange={onFiltersChange}
            onReset={onReset}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
