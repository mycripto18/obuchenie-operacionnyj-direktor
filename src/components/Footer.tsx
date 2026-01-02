import { categories, schools } from "@/data/mockData";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">К</span>
              </div>
              <span className="text-xl font-bold">КурсыРФ</span>
            </div>
            <p className="text-sm text-muted-foreground/80 mb-4">
              Крупнейший агрегатор онлайн-курсов в России. Сравнивайте программы, читайте отзывы, находите лучшие цены.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Направления</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/catalog/${cat.slug}`}
                    className="text-sm text-muted-foreground/80 hover:text-background transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Schools */}
          <div>
            <h4 className="font-semibold mb-4">Школы</h4>
            <ul className="space-y-2">
              {schools.slice(0, 6).map((school) => (
                <li key={school.id}>
                  <a
                    href={`/school/${school.slug}`}
                    className="text-sm text-muted-foreground/80 hover:text-background transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    {school.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-sm text-muted-foreground/80 hover:text-background transition-colors" onClick={(e) => e.preventDefault()}>
                  О проекте
                </a>
              </li>
              <li>
                <a href="/blog" className="text-sm text-muted-foreground/80 hover:text-background transition-colors" onClick={(e) => e.preventDefault()}>
                  Блог
                </a>
              </li>
              <li>
                <a href="/contacts" className="text-sm text-muted-foreground/80 hover:text-background transition-colors" onClick={(e) => e.preventDefault()}>
                  Контакты
                </a>
              </li>
              <li>
                <a href="/partners" className="text-sm text-muted-foreground/80 hover:text-background transition-colors" onClick={(e) => e.preventDefault()}>
                  Партнёрам
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground/60">
              © 2024 КурсыРФ. Все права защищены.
            </p>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="text-sm text-muted-foreground/60 hover:text-background transition-colors" onClick={(e) => e.preventDefault()}>
                Политика конфиденциальности
              </a>
              <a href="/terms" className="text-sm text-muted-foreground/60 hover:text-background transition-colors" onClick={(e) => e.preventDefault()}>
                Пользовательское соглашение
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
