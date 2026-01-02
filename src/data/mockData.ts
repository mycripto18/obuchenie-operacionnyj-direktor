import { Code, BarChart3, Bug, Palette, Megaphone, TrendingUp, Users, Wallet, Languages, Brain, Apple } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: any;
  count: number;
}

export interface School {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  school: School;
  category: Category;
  price: number;
  oldPrice?: number;
  installment?: number;
  rating: number;
  reviewsCount: number;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  format: "online" | "video";
  isFree: boolean;
  hasCertificate: boolean;
  hasDiscount: boolean;
  image: string;
  startDate?: string;
  partnerUrl: string;
  promoCode?: {
    code: string;
    discountText: string;
    discountPercent: number;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  date: string;
}

export const categories: Category[] = [
  { id: "1", name: "Программирование", slug: "programmirovanie", icon: Code, count: 245 },
  { id: "2", name: "Аналитика данных", slug: "analitika-dannyh", icon: BarChart3, count: 89 },
  { id: "3", name: "Тестирование", slug: "testirovanie", icon: Bug, count: 67 },
  { id: "4", name: "Дизайн", slug: "dizajn", icon: Palette, count: 134 },
  { id: "5", name: "Маркетинг", slug: "marketing", icon: Megaphone, count: 156 },
  { id: "6", name: "Продажи", slug: "prodazhi", icon: TrendingUp, count: 78 },
  { id: "7", name: "Управление", slug: "upravlenie", icon: Users, count: 112 },
  { id: "8", name: "Финансы", slug: "finansy", icon: Wallet, count: 94 },
  { id: "9", name: "Языки", slug: "yazyki", icon: Languages, count: 201 },
  { id: "10", name: "Психология", slug: "psihologiya", icon: Brain, count: 56 },
  { id: "11", name: "Нутрициология", slug: "nutriciologiya", icon: Apple, count: 43 },
];

export const schools: School[] = [
  { id: "1", name: "Skillbox", slug: "skillbox", logo: "https://placehold.co/120x40/1a1a2e/ffffff?text=Skillbox" },
  { id: "2", name: "GeekBrains", slug: "geekbrains", logo: "https://placehold.co/120x40/00b956/ffffff?text=GeekBrains" },
  { id: "3", name: "Нетология", slug: "netology", logo: "https://placehold.co/120x40/6b4fbb/ffffff?text=Нетология" },
  { id: "4", name: "Яндекс Практикум", slug: "yandex-praktikum", logo: "https://placehold.co/120x40/ffcc00/000000?text=Практикум" },
  { id: "5", name: "Skillbox Design", slug: "skillbox-design", logo: "https://placehold.co/120x40/e91e63/ffffff?text=SB+Design" },
  { id: "6", name: "Contented", slug: "contented", logo: "https://placehold.co/120x40/2196f3/ffffff?text=Contented" },
  { id: "7", name: "SkillFactory", slug: "skillfactory", logo: "https://placehold.co/120x40/ff5722/ffffff?text=SkillFactory" },
  { id: "8", name: "ProductStar", slug: "productstar", logo: "https://placehold.co/120x40/9c27b0/ffffff?text=ProductStar" },
];

const generateCourses = (): Course[] => {
  const courseTitles = [
    "Веб-разработчик с нуля до PRO",
    "Python-разработчик",
    "Data Science с нуля",
    "UX/UI дизайнер",
    "Интернет-маркетолог",
    "Тестировщик ПО",
    "Java-разработчик",
    "Frontend-разработчик",
    "Аналитик данных",
    "Графический дизайнер",
    "Product Manager",
    "Project Manager",
    "SMM-специалист",
    "Финансовый аналитик",
    "HR-менеджер",
    "Английский для IT",
    "DevOps инженер",
    "Mobile разработчик",
    "Бизнес-аналитик",
    "Копирайтер",
    "Менеджер по продажам",
    "1С-разработчик",
    "Motion дизайнер",
    "Продуктовый аналитик",
  ];

  const durations = ["3 месяца", "6 месяцев", "9 месяцев", "12 месяцев", "18 месяцев"];
  const levels: ("beginner" | "intermediate" | "advanced")[] = ["beginner", "intermediate", "advanced"];
  const formats: ("online" | "video")[] = ["online", "video"];

  return courseTitles.map((title, index) => {
    const school = schools[index % schools.length];
    const category = categories[index % categories.length];
    const basePrice = Math.floor(Math.random() * 150000) + 30000;
    const hasDiscount = Math.random() > 0.6;
    const isFree = Math.random() > 0.9;
    
    return {
      id: `course-${index + 1}`,
      title,
      slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zа-яё0-9-]/gi, ""),
      school,
      category,
      price: isFree ? 0 : (hasDiscount ? Math.floor(basePrice * 0.7) : basePrice),
      oldPrice: hasDiscount && !isFree ? basePrice : undefined,
      installment: !isFree ? Math.floor((hasDiscount ? basePrice * 0.7 : basePrice) / 24) : undefined,
      rating: Number((Math.random() * 0.8 + 4.2).toFixed(1)),
      reviewsCount: Math.floor(Math.random() * 4900) + 100,
      duration: durations[Math.floor(Math.random() * durations.length)],
      level: levels[Math.floor(Math.random() * levels.length)],
      format: formats[Math.floor(Math.random() * formats.length)],
      isFree,
      hasCertificate: Math.random() > 0.3,
      hasDiscount: hasDiscount && !isFree,
      image: `https://placehold.co/400x225/${['3b82f6', '10b981', 'f59e0b', 'ef4444', '8b5cf6', '06b6d4'][index % 6]}/ffffff?text=${encodeURIComponent(title.split(' ')[0])}`,
      startDate: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      partnerUrl: `https://example.com/course/${index + 1}`,
      promoCode: Math.random() > 0.7 ? {
        code: `PROMO${Math.floor(Math.random() * 1000)}`,
        discountText: "Скидка на курс",
        discountPercent: [5, 10, 15, 20][Math.floor(Math.random() * 4)]
      } : undefined,
    };
  });
};

export const courses: Course[] = generateCourses();

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Лучшие курсы по программированию в 2024 году",
    slug: "luchshie-kursy-programmirovaniya-2024",
    excerpt: "Подробный обзор топовых курсов для начинающих и продвинутых разработчиков с актуальными ценами и отзывами.",
    image: "https://placehold.co/600x400/3b82f6/ffffff?text=Программирование",
    date: "2024-01-15",
  },
  {
    id: "2",
    title: "Как выбрать курс по дизайну: гид для новичков",
    slug: "kak-vybrat-kurs-dizajna",
    excerpt: "Разбираемся в направлениях дизайна, сравниваем школы и помогаем найти идеальный курс под ваши цели.",
    image: "https://placehold.co/600x400/8b5cf6/ffffff?text=Дизайн",
    date: "2024-01-10",
  },
  {
    id: "3",
    title: "Data Science: с чего начать обучение",
    slug: "data-science-s-chego-nachat",
    excerpt: "Пошаговый план входа в профессию аналитика данных: навыки, курсы, инструменты и перспективы карьеры.",
    image: "https://placehold.co/600x400/10b981/ffffff?text=Data+Science",
    date: "2024-01-05",
  },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const getCurrentDate = (): string => {
  return new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
