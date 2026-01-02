import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/mockData";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">К</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">КурсыРФ</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#catalog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Каталог
            </a>
            <div className="relative group">
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Направления
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-card rounded-xl shadow-card-hover border border-border p-4 min-w-[200px]">
                  {categories.slice(0, 6).map((cat) => (
                    <a
                      key={cat.id}
                      href={`/catalog/${cat.slug}`}
                      className="block py-2 px-3 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      {cat.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <a href="/schools" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => e.preventDefault()}>
              Школы
            </a>
            <a href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => e.preventDefault()}>
              Блог
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => onSearch("")}>
              <Search className="w-5 h-5" />
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              Подобрать курс
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              <a href="#catalog" className="py-2 px-3 text-foreground hover:bg-secondary rounded-lg">
                Каталог
              </a>
              <a href="/schools" className="py-2 px-3 text-foreground hover:bg-secondary rounded-lg" onClick={(e) => e.preventDefault()}>
                Школы
              </a>
              <a href="/blog" className="py-2 px-3 text-foreground hover:bg-secondary rounded-lg" onClick={(e) => e.preventDefault()}>
                Блог
              </a>
              <Button className="mt-4 w-full bg-primary hover:bg-primary/90">
                Подобрать курс
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
