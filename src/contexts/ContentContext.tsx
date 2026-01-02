import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as defaultContent from '@/data/content';

// Типы контента
export interface Teacher {
  name: string;
  description: string;
}

export interface ReviewLink {
  platform: string;
  count: string;
  rating: string;
  url: string;
}

export interface PromoCode {
  code: string;
  discountText: string;
  discountPercent: number;
}

export interface Course {
  id: number;
  title: string;
  school: string;
  schoolLogo: string;
  url: string;
  price: number;
  oldPrice?: number;
  installment?: number;
  format: string;
  duration: string;
  document: string;
  forWhom: string;
  features: string[];
  skills: string[];
  teachers?: Teacher[];
  program?: string[];
  advantages: string[];
  reviews: string;
  reviewLinks?: ReviewLink[];
  promoCode?: PromoCode;
  discount?: string;
  badge?: 'top' | 'popular' | 'new';
}

export interface ContentBlockItem {
  icon: string;
  text: string;
}

export interface ContentBlock {
  title: string;
  paragraphs?: string[];
  list?: ContentBlockItem[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CriteriaItem {
  icon: string;
  text: string;
}

export interface BeforeTableBlock {
  title: string;
  paragraphs: string[];
  criteria: CriteriaItem[];
}

export interface Author {
  name: string;
  photo: string;
  description: string;
  link: string;
}

export interface MetaData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
}

export interface HeaderStats {
  reviewsCount: string;
  badgeText: string;
  subtitle: string;
}

// Настройки видимости блоков на странице
export interface PageBlocks {
  showHeader: boolean;
  showAuthor: boolean;
  showIntro: boolean;
  showBeforeTable: boolean;
  showCoursesList: boolean;
  showCourseDetails: boolean;
  showContentBlocks: boolean;
  showFAQ: boolean;
}

// Навигационная ссылка
export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

// Дополнительная страница
export interface SitePage {
  id: string;
  slug: string;
  title: string;
  menuLabel: string;
  showInMenu: boolean;
  metaData: MetaData;
  blocks: PageBlocks;
  // Контент страницы (может быть свой или общий)
  pageTitle?: string;
  author?: Author;
  headerStats?: HeaderStats;
  introText?: string;
  beforeTableBlock?: BeforeTableBlock;
  courses?: Course[];
  contentBlocks?: ContentBlock[];
  faqData?: FAQItem[];
}

export interface SiteContent {
  pageTitle: string;
  metaData: MetaData;
  author: Author;
  headerStats: HeaderStats;
  introText: string;
  beforeTableBlock: BeforeTableBlock;
  courses: Course[];
  contentBlocks: ContentBlock[];
  faqData: FAQItem[];
  // Дополнительные страницы
  pages: SitePage[];
  // Навигация
  navigation: NavItem[];
  // Футер
  footerText: string;
  footerEmail: string;
}

const STORAGE_KEY = 'site-content-data';
const REFRESH_KEY = 'site-content-refresh';
const CONTENT_JSON_URL = '/content.json';

// Получить дефолтный контент из content.ts
const getDefaultContent = (): SiteContent => ({
  pageTitle: defaultContent.pageTitle,
  metaData: defaultContent.metaData,
  author: defaultContent.author,
  headerStats: defaultContent.headerStats,
  introText: defaultContent.introText,
  beforeTableBlock: defaultContent.beforeTableBlock,
  courses: defaultContent.courses,
  contentBlocks: defaultContent.contentBlocks,
  faqData: defaultContent.faqData,
  pages: [],
  navigation: [
    { label: "Главная", href: "/" },
    { label: "Курсы", href: "#courses" },
  ],
  footerText: 'Интернет-сайт носит информационный характер и ни при каких условиях не является публичной офертой, которая определяется положениями статьи 437 Гражданского кодекса РФ. Информация о программах курсов и иных условий, указанных на сайте, может быть изменена организацией предоставляющей услуги обучения в одностороннем порядке. Скриншоты с сайтов курсов могут отличаться от оригиналов. Информация по ценам, может отличаться от фактической, к моменту просмотра рейтинга.',
  footerEmail: 'info@example.com',
});

// Загрузить контент из public/content.json
const loadContentFromJSON = async (): Promise<SiteContent | null> => {
  try {
    const response = await fetch(CONTENT_JSON_URL + '?t=' + Date.now());
    if (!response.ok) return null;
    const data = await response.json();
    return { ...getDefaultContent(), ...data };
  } catch (e) {
    console.error('Ошибка загрузки content.json:', e);
    return null;
  }
};

interface ContentContextType {
  content: SiteContent;
  setContent: (content: SiteContent) => void;
  updateContent: (updates: Partial<SiteContent>) => void;
  resetToDefault: () => void;
  exportJSON: (pageSlug?: string) => string;
  importJSON: (json: string, pageSlug?: string) => boolean;
  saveNow: () => boolean;
  isModified: boolean;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContentState] = useState<SiteContent>(getDefaultContent());
  const [isLoading, setIsLoading] = useState(true);
  const [isModified, setIsModified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Загрузка контента при старте
  useEffect(() => {
    const isAdminPage = window.location.pathname.includes('panel-x7k9m2');
    setIsAdmin(isAdminPage);
    
    const loadContent = async () => {
      if (isAdminPage) {
        // В админке загружаем из localStorage для редактирования
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            setContentState({ ...getDefaultContent(), ...JSON.parse(saved) });
          } else {
            // Загружаем из content.json как начальные данные
            const jsonContent = await loadContentFromJSON();
            if (jsonContent) {
              setContentState(jsonContent);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(jsonContent));
            }
          }
        } catch (e) {
          console.error('Ошибка загрузки контента:', e);
        }
      } else {
        // На публичных страницах загружаем из content.json
        const jsonContent = await loadContentFromJSON();
        if (jsonContent) {
          setContentState(jsonContent);
        }
      }
      setIsLoading(false);
    };
    
    loadContent();
  }, []);


  // Синхронизация между вкладками/предпросмотром (iframe)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY && e.key !== REFRESH_KEY) return;
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
          setContentState(getDefaultContent());
          return;
        }
        const parsed = JSON.parse(saved);
        setContentState({ ...getDefaultContent(), ...parsed });
      } catch (err) {
        console.error('Ошибка синхронизации контента:', err);
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Сохранение в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      // Проверяем, отличается ли от дефолта
      const defaultStr = JSON.stringify(getDefaultContent());
      const currentStr = JSON.stringify(content);
      setIsModified(defaultStr !== currentStr);
    } catch (e) {
      console.error('Ошибка сохранения контента:', e);
    }
  }, [content]);

  const setContent = (newContent: SiteContent) => {
    setContentState(newContent);
  };

  const updateContent = (updates: Partial<SiteContent>) => {
    setContentState(prev => ({ ...prev, ...updates }));
  };

  const resetToDefault = () => {
    const defaultContent = getDefaultContent();
    setContentState(defaultContent);
    localStorage.removeItem(STORAGE_KEY);
  };

const exportJSON = (pageSlug?: string): string => {
    if (pageSlug === 'main' || !pageSlug) {
      // Экспорт главной страницы (без pages и navigation)
      const { pages, navigation, ...mainContent } = content;
      return JSON.stringify(mainContent, null, 2);
    } else {
      // Экспорт конкретной страницы
      const page = content.pages.find(p => p.slug === pageSlug);
      if (page) {
        return JSON.stringify(page, null, 2);
      }
      return JSON.stringify(content, null, 2);
    }
  };

  const importJSON = (json: string, pageSlug?: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      
      if (pageSlug === 'main' || !pageSlug) {
        // Импорт на главную страницу
        if (!parsed.pageTitle || !parsed.metaData || !parsed.courses) {
          throw new Error('Неверная структура JSON для главной страницы');
        }
        // Сохраняем pages и navigation
        setContentState({ ...getDefaultContent(), ...parsed, pages: content.pages, navigation: content.navigation });
      } else {
        // Импорт на конкретную страницу
        const pageIndex = content.pages.findIndex(p => p.slug === pageSlug);
        if (pageIndex === -1) {
          throw new Error('Страница не найдена');
        }
        
        // Проверяем, это полная страница или контент
        if (parsed.slug && parsed.blocks) {
          // Это полная страница
          const newPages = [...content.pages];
          newPages[pageIndex] = { ...newPages[pageIndex], ...parsed, slug: pageSlug };
          setContentState({ ...content, pages: newPages });
        } else if (parsed.pageTitle || parsed.courses) {
          // Это контент как на главной, применяем к странице
          // ПОЛНОСТЬЮ заменяем курсы из JSON (не мержим со старыми)
          const newPages = [...content.pages];
          // Если есть metaData в JSON - полностью заменяем, иначе мержим поля
          const newMetaData = parsed.metaData ? {
            title: parsed.metaData.title || newPages[pageIndex].metaData.title,
            description: parsed.metaData.description || newPages[pageIndex].metaData.description,
            keywords: parsed.metaData.keywords || newPages[pageIndex].metaData.keywords,
            canonicalUrl: parsed.metaData.canonicalUrl || newPages[pageIndex].metaData.canonicalUrl
          } : newPages[pageIndex].metaData;
          
          newPages[pageIndex] = {
            ...newPages[pageIndex],
            pageTitle: parsed.pageTitle || newPages[pageIndex].pageTitle,
            author: parsed.author || newPages[pageIndex].author,
            headerStats: parsed.headerStats || newPages[pageIndex].headerStats,
            introText: parsed.introText || newPages[pageIndex].introText,
            beforeTableBlock: parsed.beforeTableBlock || newPages[pageIndex].beforeTableBlock,
            courses: parsed.courses || [], // Полная замена курсов
            contentBlocks: parsed.contentBlocks || newPages[pageIndex].contentBlocks,
            faqData: parsed.faqData || newPages[pageIndex].faqData,
            metaData: newMetaData
          };
          setContentState({ ...content, pages: newPages });
        } else {
          throw new Error('Неверная структура JSON');
        }
      }
      return true;
    } catch (e) {
      console.error('Ошибка импорта JSON:', e);
      return false;
    }
  };

  const saveNow = (): boolean => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      localStorage.setItem(REFRESH_KEY, String(Date.now()));
      return true;
    } catch (e) {
      console.error('Ошибка сохранения контента:', e);
      return false;
    }
  };

  return (
    <ContentContext.Provider value={{
      content,
      setContent,
      updateContent,
      resetToDefault,
      exportJSON,
      importJSON,
      saveNow,
      isModified,
      isLoading
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
