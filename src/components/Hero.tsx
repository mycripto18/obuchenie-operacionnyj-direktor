import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { courses, getCurrentDate } from "@/data/mockData";

interface HeroProps {
  onSearch: (query: string) => void;
}

export const Hero = ({ onSearch }: HeroProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 1) {
      const filtered = courses
        .filter((c) => c.title.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5)
        .map((c) => c.title);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    onSearch(searchQuery);
    setShowSuggestions(false);
    // Analytics event
    console.log("Analytics: search_query", { query: searchQuery });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const scrollToCatalog = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-gradient py-16 md:py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        {/* Author and date */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8">
          <span>Рейтинг курсов подготовил</span>
          <span className="font-semibold text-foreground">Иван Иванов</span>
          <span className="mx-2">•</span>
          <span>Обновлено {getCurrentDate()}</span>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 text-foreground animate-fade-in">
            Найдите идеальный курс
            <br />
            <span className="text-primary">для вашей карьеры</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-slide-up">
            Сравнивайте 1000+ онлайн-курсов от ведущих школ России. 
            Честные отзывы, актуальные цены, промокоды.
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto animate-slide-up">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Найти курс..."
                  value={searchQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-12 pr-4 h-14 text-lg rounded-xl border-2 border-border bg-card shadow-card focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
                
                {/* Autocomplete suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-card-hover border border-border overflow-hidden z-50">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3"
                      >
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button 
                onClick={handleSearch}
                className="h-14 px-8 text-lg rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25"
              >
                Найти
              </Button>
            </div>
          </div>

          {/* CTA to catalog */}
          <button
            onClick={scrollToCatalog}
            className="mt-8 inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Подробнее о каталоге
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};
