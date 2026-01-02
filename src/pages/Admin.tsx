import React, { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useContent, Course } from '@/contexts/ContentContext';
import { AdminAuth } from '@/components/AdminAuth';
import { ImageUploader } from '@/components/ImageUploader';
import { PageContentEditor } from '@/components/PageContentEditor';
import { SortableCourseItem } from '@/components/SortableCourseItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Upload, 
  Download, 
  RotateCcw, 
  Eye, 
  Save, 
  FileJson, 
  User, 
  BookOpen, 
  HelpCircle,
  Settings,
  Image,
  Link,
  Trash2,
  Plus,
  GraduationCap,
  FileText,
  Rocket,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Globe,
  ToggleLeft,
  ToggleRight,
  Tag,
  MapPin
} from 'lucide-react';
import { SitePage, PageBlocks } from '@/contexts/ContentContext';
import { Switch } from '@/components/ui/switch';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

// Валидация URL
const isValidUrl = (url: string): boolean => {
  if (!url || url === '#') return true; // Пустые и якорные ссылки допустимы
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

const validateAndSetUrl = (
  value: string, 
  onValid: (url: string) => void,
  showError: boolean = true
): boolean => {
  const trimmed = value.trim();
  if (isValidUrl(trimmed)) {
    onValid(trimmed);
    return true;
  } else {
    if (showError) {
      toast.error('Некорректный URL. Ссылка должна начинаться с http:// или https://');
    }
    return false;
  }
};

const AdminContent = () => {
  const { content, updateContent, resetToDefault, exportJSON, importJSON, saveNow, isModified } = useContent();
  const [showPreview, setShowPreview] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [previewPage, setPreviewPage] = useState<string>('/');
  const [dragActive, setDragActive] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Состояния для диалогов экспорта/импорта
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [selectedPageForExport, setSelectedPageForExport] = useState<string>('main');
  const [selectedPageForImport, setSelectedPageForImport] = useState<string>('main');
  const [importFile, setImportFile] = useState<File | null>(null);
  
  // Sitemap preview
  const [showSitemapPreview, setShowSitemapPreview] = useState(false);
  const [sitemapContent, setSitemapContent] = useState('');
  
  // Favicon
  const [faviconUrl, setFaviconUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('site-favicon') || '';
    } catch { return ''; }
  });
  
  const saveFavicon = (url: string) => {
    setFaviconUrl(url);
    try {
      localStorage.setItem('site-favicon', url);
      // Обновляем favicon в документе
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = url;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = url;
        document.head.appendChild(newLink);
      }
      toast.success('Favicon сохранён');
    } catch {
      toast.error('Ошибка сохранения favicon');
    }
  };

  // Обработка drag & drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      // Открываем диалог импорта с файлом
      setImportFile(files[0]);
      setShowImportDialog(true);
    }
  }, []);

  const handleFileUpload = (file: File, pageSlug: string) => {
    if (!file.name.endsWith('.json')) {
      toast.error('Пожалуйста, загрузите JSON файл');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (importJSON(text, pageSlug)) {
        toast.success(`Контент успешно загружен для ${pageSlug === 'main' ? 'главной страницы' : pageSlug}!`);
        setShowImportDialog(false);
        setImportFile(null);
      } else {
        toast.error('Ошибка при загрузке файла. Проверьте структуру JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportWithPage = (pageSlug: string) => {
    const json = exportJSON(pageSlug);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const pageName = pageSlug === 'main' ? 'main' : pageSlug;
    a.download = `${pageName}-content-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Файл скачан!');
    setShowExportDialog(false);
  };

  const handleSave = () => {
    const ok = saveNow();
    if (!ok) {
      toast.error('Не удалось сохранить. Возможно, изображения слишком большие — попробуйте Экспорт JSON.');
      return;
    }
    toast.success('Сохранено');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);
    if (showPreview) {
      setPreviewKey(prev => prev + 1);
    }
  };

  const handleReset = () => {
    if (window.confirm('Вы уверены? Все изменения будут потеряны.')) {
      resetToDefault();
      toast.success('Контент сброшен к исходному');
      if (showPreview) setPreviewKey(prev => prev + 1);
    }
  };

  const handlePublish = () => {
    handleSave();
    handleExportWithPage('main');
    setShowPublish(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Скопировано!');
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      setShowImportDialog(true);
    }
  };

  // Обновление курса
  const updateCourse = (index: number, field: string, value: any) => {
    const newCourses = [...content.courses];
    (newCourses[index] as any)[field] = value;
    updateContent({ courses: newCourses });
  };

  // Добавление курса
  const addCourse = () => {
    const newCourse = {
      id: content.courses.length + 1,
      title: 'Новый курс',
      school: 'Название школы',
      schoolLogo: 'https://placehold.co/200x80/3b82f6/ffffff?text=Logo',
      url: '#',
      price: 0,
      format: 'Онлайн',
      duration: '1 месяц',
      document: 'Сертификат',
      forWhom: 'Для всех',
      features: ['Особенность 1'],
      skills: ['Навык 1'],
      advantages: ['Преимущество 1'],
      reviews: 'Отзывы студентов',
      reviewLinks: []
    };
    updateContent({ courses: [...content.courses, newCourse] });
    toast.success('Курс добавлен');
  };

  // Удаление курса
  const removeCourse = (index: number) => {
    if (window.confirm('Удалить этот курс?')) {
      const newCourses = content.courses.filter((_, i) => i !== index);
      updateContent({ courses: newCourses });
      toast.success('Курс удалён');
    }
  };

  // Обновление FAQ
  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaq = [...content.faqData];
    newFaq[index][field] = value;
    updateContent({ faqData: newFaq });
  };

  const addFAQ = () => {
    updateContent({ 
      faqData: [...content.faqData, { question: 'Новый вопрос?', answer: 'Ответ на вопрос' }] 
    });
    toast.success('Вопрос добавлен');
  };

  const removeFAQ = (index: number) => {
    const newFaq = content.faqData.filter((_, i) => i !== index);
    updateContent({ faqData: newFaq });
    toast.success('Вопрос удалён');
  };

  // Управление страницами
  const addPage = () => {
    const newPage: SitePage = {
      id: `page-${Date.now()}`,
      slug: `new-page-${content.pages.length + 1}`,
      title: 'Новая страница',
      menuLabel: 'Новая страница',
      showInMenu: true,
      metaData: {
        title: 'Новая страница',
        description: 'Описание страницы',
        keywords: '',
        canonicalUrl: ''
      },
      blocks: {
        showHeader: true,
        showAuthor: true,
        showIntro: true,
        showBeforeTable: true,
        showCoursesList: true,
        showCourseDetails: true,
        showContentBlocks: true,
        showFAQ: true
      }
    };
    updateContent({ pages: [...content.pages, newPage] });
    toast.success('Страница добавлена');
  };

  // Дублирование страницы
  const duplicatePage = (index: number) => {
    const sourcePage = content.pages[index];
    const duplicatedPage: SitePage = {
      ...JSON.parse(JSON.stringify(sourcePage)), // Глубокое копирование
      id: `page-${Date.now()}`,
      slug: `${sourcePage.slug}-copy`,
      title: `${sourcePage.title} (копия)`,
      menuLabel: `${sourcePage.menuLabel} (копия)`
    };
    updateContent({ pages: [...content.pages, duplicatedPage] });
    toast.success('Страница продублирована');
  };

  const updatePage = (index: number, updates: Partial<SitePage>) => {
    const newPages = [...content.pages];
    newPages[index] = { ...newPages[index], ...updates };
    updateContent({ pages: newPages });
  };

  const updatePageBlocks = (index: number, block: keyof PageBlocks, value: boolean) => {
    const newPages = [...content.pages];
    newPages[index].blocks[block] = value;
    updateContent({ pages: newPages });
  };

  const removePage = (index: number) => {
    if (window.confirm('Удалить эту страницу?')) {
      const newPages = content.pages.filter((_, i) => i !== index);
      updateContent({ pages: newPages });
      toast.success('Страница удалена');
    }
  };

  // Массовая замена URL курсов
  const [showBulkUrls, setShowBulkUrls] = useState(false);
  const [bulkUrlsText, setBulkUrlsText] = useState('');
  const [bulkUrlsPage, setBulkUrlsPage] = useState<string>('main');

  const applyBulkUrls = () => {
    const urls = bulkUrlsText.split('\n').map(u => u.trim()).filter(u => u);
    
    // Валидация всех URL
    const invalidUrls = urls.filter(url => !isValidUrl(url));
    if (invalidUrls.length > 0) {
      toast.error(`Некорректные ссылки (строки ${invalidUrls.map((_, i) => urls.indexOf(invalidUrls[i]) + 1).join(', ')}). URL должны начинаться с http:// или https://`);
      return;
    }
    
    if (bulkUrlsPage === 'main') {
      const newCourses = content.courses.map((course, i) => ({
        ...course,
        url: urls[i] || course.url
      }));
      updateContent({ courses: newCourses });
      toast.success(`Обновлено ${Math.min(urls.length, content.courses.length)} ссылок`);
    } else {
      const pageIndex = content.pages.findIndex(p => p.slug === bulkUrlsPage);
      if (pageIndex !== -1 && content.pages[pageIndex].courses) {
        const newPages = [...content.pages];
        newPages[pageIndex].courses = newPages[pageIndex].courses!.map((course, i) => ({
          ...course,
          url: urls[i] || course.url
        }));
        updateContent({ pages: newPages });
        toast.success(`Обновлено ${Math.min(urls.length, newPages[pageIndex].courses!.length)} ссылок`);
      }
    }
    setShowBulkUrls(false);
    setBulkUrlsText('');
  };

  // Массовая замена промокодов
  const [showBulkPromos, setShowBulkPromos] = useState(false);
  const [bulkPromosText, setBulkPromosText] = useState('');
  const [bulkPromosPage, setBulkPromosPage] = useState<string>('main');
  const [bulkPromoDiscountText, setBulkPromoDiscountText] = useState('Скидка на курс');
  const [bulkPromoDiscountPercent, setBulkPromoDiscountPercent] = useState(10);
  const [bulkPromoMode, setBulkPromoMode] = useState<'simple' | 'advanced'>('simple');

  // Парсинг строки промокода: ПРОМОКОД или ПРОМОКОД|Текст|Процент
  const parsePromoLine = (line: string, defaultText: string, defaultPercent: number) => {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 3) {
      return {
        code: parts[0],
        discountText: parts[1] || defaultText,
        discountPercent: parseInt(parts[2]) || defaultPercent
      };
    } else if (parts.length === 2) {
      return {
        code: parts[0],
        discountText: parts[1] || defaultText,
        discountPercent: defaultPercent
      };
    }
    return {
      code: parts[0],
      discountText: defaultText,
      discountPercent: defaultPercent
    };
  };

  const applyBulkPromos = () => {
    const lines = bulkPromosText.split('\n').map(p => p.trim()).filter(p => p);
    
    if (bulkPromosPage === 'main') {
      const newCourses = content.courses.map((course, i) => ({
        ...course,
        promoCode: lines[i] ? parsePromoLine(lines[i], bulkPromoDiscountText, bulkPromoDiscountPercent) : course.promoCode
      }));
      updateContent({ courses: newCourses });
      toast.success(`Обновлено ${Math.min(lines.length, content.courses.length)} промокодов`);
    } else {
      const pageIndex = content.pages.findIndex(p => p.slug === bulkPromosPage);
      if (pageIndex !== -1 && content.pages[pageIndex].courses) {
        const newPages = [...content.pages];
        newPages[pageIndex].courses = newPages[pageIndex].courses!.map((course, i) => ({
          ...course,
          promoCode: lines[i] ? parsePromoLine(lines[i], bulkPromoDiscountText, bulkPromoDiscountPercent) : course.promoCode
        }));
        updateContent({ pages: newPages });
        toast.success(`Обновлено ${Math.min(lines.length, newPages[pageIndex].courses!.length)} промокодов`);
      }
    }
    setShowBulkPromos(false);
    setBulkPromosText('');
  };

  // Drag & Drop для курсов
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = content.courses.findIndex(c => c.id === active.id);
      const newIndex = content.courses.findIndex(c => c.id === over.id);
      
      const newCourses = arrayMove(content.courses, oldIndex, newIndex);
      updateContent({ courses: newCourses });
      toast.success('Порядок курсов изменён');
    }
  };

  const updateNavItem = (index: number, field: 'label' | 'href', value: string) => {
    const newNav = [...content.navigation];
    newNav[index][field] = value;
    updateContent({ navigation: newNav });
  };

  const addNavItem = () => {
    updateContent({ 
      navigation: [...content.navigation, { label: 'Новый пункт', href: '#' }] 
    });
    toast.success('Пункт меню добавлен');
  };

  const removeNavItem = (index: number) => {
    const newNav = content.navigation.filter((_, i) => i !== index);
    updateContent({ navigation: newNav });
    toast.success('Пункт меню удалён');
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <RouterLink 
                to="/" 
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/5 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                На сайт
              </RouterLink>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Админ-панель</h1>
                <p className="text-muted-foreground mt-1">Редактирование контента сайта</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {isModified && !justSaved && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Есть изменения
                </Badge>
              )}
              {justSaved && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Сохранено
                </Badge>
              )}
              <Button 
                variant={showPreview ? "default" : "outline"} 
                size="sm" 
                onClick={() => {
                  setShowPreview(!showPreview);
                  if (!showPreview) setPreviewKey(prev => prev + 1);
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Скрыть' : 'Просмотр'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Сброс
              </Button>
              <Button size="sm" variant={isModified ? "default" : "outline"} onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Сохранить
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowExportDialog(true)}>
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </Button>
              <Dialog open={showPublish} onOpenChange={setShowPublish}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Rocket className="w-4 h-4 mr-2" />
                    Опубликовать
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Rocket className="w-5 h-5" />
                      Публикация сайта
                    </DialogTitle>
                    <DialogDescription>
                      Следуйте инструкциям для размещения сайта на хостинге
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-4">
                    {/* Шаг 1 */}
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">1</span>
                        Скачайте JSON с контентом
                      </h3>
                      <p className="text-sm text-muted-foreground ml-8">
                        JSON файл уже скачан автоматически. Если нет — нажмите кнопку ниже.
                      </p>
                      <div className="ml-8">
                        <Button variant="outline" size="sm" onClick={() => handleExportWithPage('main')}>
                          <Download className="w-4 h-4 mr-2" />
                          Скачать JSON ещё раз
                        </Button>
                      </div>
                    </div>

                    {/* Шаг 2 */}
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">2</span>
                        Скопируйте файлы сайта
                      </h3>
                      <p className="text-sm text-muted-foreground ml-8">
                        Скачайте исходный код проекта и скопируйте на хостинг:
                      </p>
                      <ul className="text-sm text-muted-foreground ml-8 space-y-1 list-disc list-inside">
                        <li><code className="bg-muted px-1 rounded">dist/</code> — папка со сборкой (после npm run build)</li>
                        <li>Или весь проект, если хостинг поддерживает Node.js</li>
                      </ul>
                    </div>

                    {/* Шаг 3 */}
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">3</span>
                        Замените контент
                      </h3>
                      <p className="text-sm text-muted-foreground ml-8">
                        Содержимое скачанного JSON вставьте в файл:
                      </p>
                      <div className="ml-8 flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                          src/data/content.ts
                        </code>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard('src/data/content.ts')}
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground ml-8">
                        Или импортируйте JSON через админку на новом сервере
                      </p>
                    </div>

                    {/* Шаг 4 */}
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">4</span>
                        Соберите и разместите
                      </h3>
                      <div className="ml-8 space-y-2">
                        <p className="text-sm text-muted-foreground">Команды для сборки:</p>
                        <div className="bg-muted p-3 rounded-lg font-mono text-sm space-y-1">
                          <div className="flex items-center justify-between">
                            <span>npm install</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard('npm install')}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>npm run build</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard('npm run build')}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          После сборки загрузите содержимое папки <code className="bg-muted px-1 rounded">dist/</code> на хостинг
                        </p>
                      </div>
                    </div>

                    {/* Совет */}
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Совет</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Для быстрого хостинга используйте Vercel, Netlify или GitHub Pages — 
                        они бесплатны и автоматически собирают проект из репозитория.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <Card 
            className={`border-2 border-dashed transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                Перетащите JSON файл сюда
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                или нажмите кнопку ниже
              </p>
              <label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <Button variant="outline" asChild>
                  <span>
                    <FileJson className="w-4 h-4 mr-2" />
                    Выбрать файл
                  </span>
                </Button>
              </label>
            </CardContent>
          </Card>

          {/* Export Dialog */}
          <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Экспорт контента</DialogTitle>
                <DialogDescription>
                  Выберите страницу для экспорта
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Select value={selectedPageForExport} onValueChange={setSelectedPageForExport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите страницу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Главная страница</SelectItem>
                    {content.pages.map(page => (
                      <SelectItem key={page.id} value={page.slug}>
                        {page.menuLabel} (/{page.slug})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                  Отмена
                </Button>
                <Button onClick={() => handleExportWithPage(selectedPageForExport)}>
                  <Download className="w-4 h-4 mr-2" />
                  Скачать JSON
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Import Dialog */}
          <Dialog open={showImportDialog} onOpenChange={(open) => {
            setShowImportDialog(open);
            if (!open) setImportFile(null);
          }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Импорт контента</DialogTitle>
                <DialogDescription>
                  Выберите страницу для импорта контента
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {importFile && (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <FileJson className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">{importFile.name}</span>
                  </div>
                )}
                <Select value={selectedPageForImport} onValueChange={setSelectedPageForImport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите страницу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Главная страница</SelectItem>
                    {content.pages.map(page => (
                      <SelectItem key={page.id} value={page.slug}>
                        {page.menuLabel} (/{page.slug})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setShowImportDialog(false);
                  setImportFile(null);
                }}>
                  Отмена
                </Button>
                <Button 
                  disabled={!importFile}
                  onClick={() => importFile && handleFileUpload(importFile, selectedPageForImport)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Импортировать
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Bulk URLs Dialog */}
          <Dialog open={showBulkUrls} onOpenChange={setShowBulkUrls}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Массовая вставка ссылок</DialogTitle>
                <DialogDescription>
                  Вставьте ссылки (по одной на строку). Они применятся к курсам по порядку.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Select value={bulkUrlsPage} onValueChange={setBulkUrlsPage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите страницу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Главная страница ({content.courses.length} курсов)</SelectItem>
                    {content.pages.filter(p => p.courses?.length).map(page => (
                      <SelectItem key={page.id} value={page.slug}>
                        {page.menuLabel} ({page.courses?.length || 0} курсов)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  value={bulkUrlsText}
                  onChange={(e) => setBulkUrlsText(e.target.value)}
                  placeholder={`https://partner-link1.com/?utm=...\nhttps://partner-link2.com/?utm=...\nhttps://partner-link3.com/?utm=...`}
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {bulkUrlsText.split('\n').filter(u => u.trim()).length} ссылок будет применено
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBulkUrls(false)}>
                  Отмена
                </Button>
                <Button onClick={applyBulkUrls}>
                  <Link className="w-4 h-4 mr-2" />
                  Применить ссылки
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Bulk Promos Dialog */}
          <Dialog open={showBulkPromos} onOpenChange={setShowBulkPromos}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Массовая вставка промокодов</DialogTitle>
                <DialogDescription>
                  Вставьте промокоды (по одному на строку). Они применятся к курсам по порядку.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Select value={bulkPromosPage} onValueChange={setBulkPromosPage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите страницу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Главная страница ({content.courses.length} курсов)</SelectItem>
                    {content.pages.filter(p => p.courses?.length).map(page => (
                      <SelectItem key={page.id} value={page.slug}>
                        {page.menuLabel} ({page.courses?.length || 0} курсов)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Переключатель режима */}
                <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Режим:</span>
                  <div className="flex gap-2">
                    <Button 
                      variant={bulkPromoMode === 'simple' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setBulkPromoMode('simple')}
                    >
                      Простой
                    </Button>
                    <Button 
                      variant={bulkPromoMode === 'advanced' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setBulkPromoMode('advanced')}
                    >
                      Расширенный
                    </Button>
                  </div>
                </div>

                {bulkPromoMode === 'simple' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Текст скидки (для всех)</label>
                      <Input
                        value={bulkPromoDiscountText}
                        onChange={(e) => setBulkPromoDiscountText(e.target.value)}
                        placeholder="Скидка на курс"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Процент скидки (для всех)</label>
                      <Input
                        type="number"
                        value={bulkPromoDiscountPercent}
                        onChange={(e) => setBulkPromoDiscountPercent(parseInt(e.target.value) || 0)}
                        placeholder="10"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {bulkPromoMode === 'simple' 
                      ? 'Промокоды (по одному на строку)' 
                      : 'Промокоды с параметрами (формат: ПРОМОКОД|Текст скидки|Процент)'
                    }
                  </label>
                  <Textarea
                    value={bulkPromosText}
                    onChange={(e) => setBulkPromosText(e.target.value)}
                    placeholder={bulkPromoMode === 'simple' 
                      ? `PROMO2024\nSALE50\nDISCOUNT30\n(пустая строка = без изменений)`
                      : `PROMO2024|Скидка 20%|20\nSALE50|Супер скидка|50\nDISCOUNT30|Промо акция|30\n(пустая строка = без изменений)`
                    }
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {bulkPromosText.split('\n').filter(p => p.trim()).length} промокодов будет применено
                  {bulkPromoMode === 'simple' && ` со скидкой "${bulkPromoDiscountText}" (${bulkPromoDiscountPercent}%)`}
                </p>
                {bulkPromoMode === 'advanced' && (
                  <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <strong>Формат:</strong> ПРОМОКОД|Текст скидки|Процент<br/>
                    <strong>Пример:</strong> SALE2024|Скидка 15%|15<br/>
                    Если указать только код — применятся значения по умолчанию: "{bulkPromoDiscountText}" ({bulkPromoDiscountPercent}%)
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBulkPromos(false)}>
                  Отмена
                </Button>
                <Button onClick={applyBulkPromos}>
                  <Tag className="w-4 h-4 mr-2" />
                  Применить промокоды
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <Card className="mb-8">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Предпросмотр страницы</CardTitle>
                <CardDescription>Изменения отображаются в реальном времени</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={previewPage} onValueChange={(val) => { setPreviewPage(val); setPreviewKey(k => k + 1); }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="/">Главная</SelectItem>
                    {content.pages.map(page => (
                      <SelectItem key={page.id} value={`/${page.slug}`}>
                        {page.menuLabel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPreviewKey(prev => prev + 1)}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Обновить
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border rounded-b-lg overflow-hidden">
                <iframe
                  key={previewKey}
                  src={previewPage}
                  className="w-full h-[600px] bg-background"
                  title="Предпросмотр сайта"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="seo" className="space-y-6">
          <TabsList className="grid grid-cols-4 md:grid-cols-7 w-full">
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">SEO</span>
            </TabsTrigger>
            <TabsTrigger value="author" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Автор</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Курсы</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Контент</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Страницы</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Иконки</span>
            </TabsTrigger>
          </TabsList>

          {/* SEO Tab */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO и метатеги</CardTitle>
                <CardDescription>Настройки для поисковых систем</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">H1 (Заголовок страницы)</label>
                  <Textarea
                    value={content.pageTitle}
                    onChange={(e) => updateContent({ pageTitle: e.target.value })}
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title (Заголовок в браузере)</label>
                  <Textarea
                    value={content.metaData.title}
                    onChange={(e) => updateContent({ 
                      metaData: { ...content.metaData, title: e.target.value } 
                    })}
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description (Описание)</label>
                  <Textarea
                    value={content.metaData.description}
                    onChange={(e) => updateContent({ 
                      metaData: { ...content.metaData, description: e.target.value } 
                    })}
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Keywords (Ключевые слова)</label>
                  <Textarea
                    value={content.metaData.keywords}
                    onChange={(e) => updateContent({ 
                      metaData: { ...content.metaData, keywords: e.target.value } 
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Canonical URL</label>
                  <Input
                    value={content.metaData.canonicalUrl}
                    onChange={(e) => updateContent({ 
                      metaData: { ...content.metaData, canonicalUrl: e.target.value } 
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Вводный текст</label>
                  <Textarea
                    value={content.introText}
                    onChange={(e) => updateContent({ introText: e.target.value })}
                    className="min-h-[120px]"
                  />
                </div>
                
                {/* Footer settings */}
                <div className="border-t pt-6 mt-6">
                  <h4 className="font-semibold mb-4">Настройки футера</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Текст дисклеймера в футере</label>
                      <Textarea
                        value={content.footerText || ''}
                        onChange={(e) => updateContent({ footerText: e.target.value })}
                        className="min-h-[100px]"
                        placeholder="Интернет-сайт носит информационный характер..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email для контактов</label>
                      <Input
                        type="email"
                        value={content.footerEmail || ''}
                        onChange={(e) => updateContent({ footerEmail: e.target.value })}
                        placeholder="info@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Sitemap Generator */}
                <div className="border-t pt-6 mt-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Карта сайта (Sitemap)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Сгенерируйте sitemap.xml для улучшения индексации в Яндексе и Google
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Базовый URL сайта</label>
                      <Input
                        value={content.metaData.canonicalUrl || ''}
                        onChange={(e) => updateContent({ 
                          metaData: { ...content.metaData, canonicalUrl: e.target.value } 
                        })}
                        placeholder="https://example.com"
                      />
                    </div>
                    <Button 
                      onClick={() => {
                        const baseUrl = content.metaData.canonicalUrl?.replace(/\/$/, '') || 'https://example.com';
                        const today = new Date().toISOString().split('T')[0];
                        
                        const urls = [
                          { loc: `${baseUrl}/`, priority: '1.0' },
                          ...content.pages
                            .filter(page => page.showInMenu !== false)
                            .map(page => ({ 
                              loc: `${baseUrl}/${page.slug}`, 
                              priority: '0.8' 
                            }))
                        ];
                        
                        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

                        setSitemapContent(sitemap);
                        setShowSitemapPreview(true);
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Предпросмотр sitemap.xml
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      После скачивания загрузите файл в корень сайта (public/sitemap.xml) и добавьте ссылку в robots.txt
                    </p>
                  </div>

                  {/* Sitemap Preview Dialog */}
                  <Dialog open={showSitemapPreview} onOpenChange={setShowSitemapPreview}>
                    <DialogContent className="max-w-3xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          Предпросмотр sitemap.xml
                        </DialogTitle>
                        <DialogDescription>
                          {sitemapContent.match(/<url>/g)?.length || 0} URL в карте сайта
                        </DialogDescription>
                      </DialogHeader>
                      <div className="overflow-auto max-h-[50vh] bg-muted rounded-lg p-4">
                        <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                          {sitemapContent}
                        </pre>
                      </div>
                      <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            navigator.clipboard.writeText(sitemapContent);
                            toast.success('Скопировано в буфер обмена');
                          }}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Копировать
                        </Button>
                        <Button 
                          onClick={() => {
                            const blob = new Blob([sitemapContent], { type: 'application/xml' });
                            const downloadUrl = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = downloadUrl;
                            a.download = 'sitemap.xml';
                            a.click();
                            URL.revokeObjectURL(downloadUrl);
                            toast.success('Sitemap скачан');
                            setShowSitemapPreview(false);
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Скачать sitemap.xml
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Author Tab */}
          <TabsContent value="author">
            <Card>
              <CardHeader>
                <CardTitle>Информация об авторе</CardTitle>
                <CardDescription>Данные автора статьи</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Имя автора</label>
                  <Input
                    value={content.author.name}
                    onChange={(e) => updateContent({ 
                      author: { ...content.author, name: e.target.value } 
                    })}
                  />
                </div>
                <ImageUploader
                  label="Фото автора"
                  value={content.author.photo}
                  onChange={(photo) => updateContent({ 
                    author: { ...content.author, photo } 
                  })}
                  previewClassName="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <Textarea
                    value={content.author.description}
                    onChange={(e) => updateContent({ 
                      author: { ...content.author, description: e.target.value } 
                    })}
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ссылка</label>
                  <Input
                    value={content.author.link}
                    onChange={(e) => updateContent({ 
                      author: { ...content.author, link: e.target.value } 
                    })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Статистика в шапке</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Количество отзывов</label>
                  <Input
                    value={content.headerStats.reviewsCount}
                    onChange={(e) => updateContent({ 
                      headerStats: { ...content.headerStats, reviewsCount: e.target.value } 
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Текст бейджа</label>
                  <Input
                    value={content.headerStats.badgeText}
                    onChange={(e) => updateContent({ 
                      headerStats: { ...content.headerStats, badgeText: e.target.value } 
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Подзаголовок</label>
                  <Textarea
                    value={content.headerStats.subtitle}
                    onChange={(e) => updateContent({ 
                      headerStats: { ...content.headerStats, subtitle: e.target.value } 
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <div className="space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h2 className="text-xl font-semibold">Курсы ({content.courses.length})</h2>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" onClick={() => setShowBulkUrls(true)}>
                    <Link className="w-4 h-4 mr-2" />
                    Ссылки
                  </Button>
                  <Button variant="outline" onClick={() => setShowBulkPromos(true)}>
                    <Tag className="w-4 h-4 mr-2" />
                    Промокоды
                  </Button>
                  <Button onClick={addCourse}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить курс
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Перетаскивайте курсы за иконку ≡ для изменения порядка
              </p>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={content.courses.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Accordion type="single" collapsible className="space-y-2">
                    {content.courses.map((course, index) => (
                      <SortableCourseItem key={course.id} course={course} index={index}>
                        <div className="space-y-4">
                          {/* Основные данные */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Название курса</label>
                              <Input
                                value={course.title}
                                onChange={(e) => updateCourse(index, 'title', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Школа</label>
                              <Input
                                value={course.school}
                                onChange={(e) => updateCourse(index, 'school', e.target.value)}
                              />
                            </div>
                          </div>

                          {/* Изображения */}
                          <ImageUploader
                            label="Логотип школы"
                            value={course.schoolLogo}
                            onChange={(schoolLogo) => updateCourse(index, 'schoolLogo', schoolLogo)}
                            previewClassName="h-10 w-auto object-contain"
                          />

                          {/* Ссылка на курс */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Ссылка на курс</label>
                            <Input
                              value={course.url}
                              onChange={(e) => updateCourse(index, 'url', e.target.value)}
                              onBlur={(e) => {
                                const url = e.target.value.trim();
                                if (url && url !== '#' && !isValidUrl(url)) {
                                  toast.error('Некорректный URL. Ссылка должна начинаться с http:// или https://');
                                }
                              }}
                              placeholder="https://..."
                              className={course.url && course.url !== '#' && !isValidUrl(course.url) ? 'border-red-500' : ''}
                            />
                            {course.url && course.url !== '#' && !isValidUrl(course.url) && (
                              <p className="text-xs text-red-500 mt-1">Некорректный URL</p>
                            )}
                          </div>

                          {/* Цены */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Цена (₽)</label>
                              <Input
                                type="number"
                                value={course.price}
                                onChange={(e) => updateCourse(index, 'price', Number(e.target.value))}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Старая цена (₽)</label>
                              <Input
                                type="number"
                                value={course.oldPrice || ''}
                                onChange={(e) => updateCourse(index, 'oldPrice', e.target.value ? Number(e.target.value) : undefined)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Рассрочка (₽/мес)</label>
                              <Input
                                type="number"
                                value={course.installment || ''}
                                onChange={(e) => updateCourse(index, 'installment', e.target.value ? Number(e.target.value) : undefined)}
                              />
                            </div>
                          </div>

                          {/* Параметры */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Формат</label>
                              <Input
                                value={course.format}
                                onChange={(e) => updateCourse(index, 'format', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Длительность</label>
                              <Input
                                value={course.duration}
                                onChange={(e) => updateCourse(index, 'duration', e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Документ</label>
                              <Input
                                value={course.document}
                                onChange={(e) => updateCourse(index, 'document', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Для кого</label>
                              <Input
                                value={course.forWhom}
                                onChange={(e) => updateCourse(index, 'forWhom', e.target.value)}
                              />
                            </div>
                          </div>

                          {/* Списки */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Особенности (через Enter)</label>
                            <Textarea
                              value={course.features.join('\n')}
                              onChange={(e) => updateCourse(index, 'features', e.target.value.split('\n').filter(s => s.trim()))}
                              className="min-h-[100px]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Навыки (через Enter)</label>
                            <Textarea
                              value={course.skills.join('\n')}
                              onChange={(e) => updateCourse(index, 'skills', e.target.value.split('\n').filter(s => s.trim()))}
                              className="min-h-[100px]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Преимущества (через Enter)</label>
                            <Textarea
                              value={course.advantages.join('\n')}
                              onChange={(e) => updateCourse(index, 'advantages', e.target.value.split('\n').filter(s => s.trim()))}
                              className="min-h-[80px]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Программа (через Enter)</label>
                            <Textarea
                              value={(course.program || []).join('\n')}
                              onChange={(e) => updateCourse(index, 'program', e.target.value.split('\n').filter(s => s.trim()))}
                              className="min-h-[100px]"
                            />
                          </div>

                          {/* Отзывы */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Текст отзывов</label>
                            <Textarea
                              value={course.reviews}
                              onChange={(e) => updateCourse(index, 'reviews', e.target.value)}
                            />
                          </div>

                          {/* Ссылки на отзывы */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Ссылки на отзывы</label>
                            {(course.reviewLinks || []).map((link, linkIndex) => (
                              <div key={linkIndex} className="grid grid-cols-5 gap-2 mb-2">
                                <Input
                                  placeholder="Платформа"
                                  value={link.platform}
                                  onChange={(e) => {
                                    const newLinks = [...(course.reviewLinks || [])];
                                    newLinks[linkIndex] = { ...newLinks[linkIndex], platform: e.target.value };
                                    updateCourse(index, 'reviewLinks', newLinks);
                                  }}
                                />
                                <Input
                                  placeholder="Кол-во"
                                  value={link.count}
                                  onChange={(e) => {
                                    const newLinks = [...(course.reviewLinks || [])];
                                    newLinks[linkIndex] = { ...newLinks[linkIndex], count: e.target.value };
                                    updateCourse(index, 'reviewLinks', newLinks);
                                  }}
                                />
                                <Input
                                  placeholder="Рейтинг"
                                  value={link.rating}
                                  onChange={(e) => {
                                    const newLinks = [...(course.reviewLinks || [])];
                                    newLinks[linkIndex] = { ...newLinks[linkIndex], rating: e.target.value };
                                    updateCourse(index, 'reviewLinks', newLinks);
                                  }}
                                />
                                <Input
                                  placeholder="URL"
                                  value={link.url}
                                  onChange={(e) => {
                                    const newLinks = [...(course.reviewLinks || [])];
                                    newLinks[linkIndex] = { ...newLinks[linkIndex], url: e.target.value };
                                    updateCourse(index, 'reviewLinks', newLinks);
                                  }}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newLinks = (course.reviewLinks || []).filter((_, i) => i !== linkIndex);
                                    updateCourse(index, 'reviewLinks', newLinks);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newLinks = [...(course.reviewLinks || []), { platform: '', count: '', rating: '', url: '' }];
                                updateCourse(index, 'reviewLinks', newLinks);
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Добавить ссылку
                            </Button>
                          </div>

                          {/* Бейдж и промокод */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Бейдж</label>
                              <select
                                className="w-full border rounded-md px-3 py-2"
                                value={course.badge || ''}
                                onChange={(e) => updateCourse(index, 'badge', e.target.value || undefined)}
                              >
                                <option value="">Без бейджа</option>
                                <option value="top">ТОП</option>
                                <option value="popular">Популярный</option>
                                <option value="new">Новый</option>
                              </select>
                            </div>
                            <div className="md:col-span-3 border rounded-lg p-4 bg-muted/30">
                              <label className="block text-sm font-medium mb-3">Промокод</label>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-xs text-muted-foreground mb-1">Код промокода</label>
                                  <Input
                                    value={course.promoCode?.code || ''}
                                    onChange={(e) => {
                                      const code = e.target.value;
                                      if (code) {
                                        updateCourse(index, 'promoCode', {
                                          code,
                                          discountText: course.promoCode?.discountText || 'Скидка на курс',
                                          discountPercent: course.promoCode?.discountPercent || 10
                                        });
                                      } else {
                                        updateCourse(index, 'promoCode', undefined);
                                      }
                                    }}
                                    placeholder="PROMO2024"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-muted-foreground mb-1">Текст скидки</label>
                                  <Input
                                    value={course.promoCode?.discountText || ''}
                                    onChange={(e) => {
                                      if (course.promoCode?.code) {
                                        updateCourse(index, 'promoCode', {
                                          ...course.promoCode,
                                          discountText: e.target.value
                                        });
                                      }
                                    }}
                                    placeholder="Скидка на курс"
                                    disabled={!course.promoCode?.code}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-muted-foreground mb-1">Процент скидки</label>
                                  <Input
                                    type="number"
                                    value={course.promoCode?.discountPercent || ''}
                                    onChange={(e) => {
                                      if (course.promoCode?.code) {
                                        updateCourse(index, 'promoCode', {
                                          ...course.promoCode,
                                          discountPercent: parseInt(e.target.value) || 0
                                        });
                                      }
                                    }}
                                    placeholder="10"
                                    disabled={!course.promoCode?.code}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Скидка (старое поле)</label>
                              <Input
                                value={course.discount || ''}
                                onChange={(e) => updateCourse(index, 'discount', e.target.value || undefined)}
                                placeholder="-30%"
                              />
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => removeCourse(index)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Удалить курс
                            </Button>
                          </div>
                        </div>
                      </SortableCourseItem>
                    ))}
                  </Accordion>
                </SortableContext>
              </DndContext>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Блок перед таблицей курсов</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Заголовок</label>
                  <Input
                    value={content.beforeTableBlock.title}
                    onChange={(e) => updateContent({ 
                      beforeTableBlock: { ...content.beforeTableBlock, title: e.target.value } 
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Параграфы (через Enter)</label>
                  <Textarea
                    value={content.beforeTableBlock.paragraphs.join('\n\n')}
                    onChange={(e) => updateContent({ 
                      beforeTableBlock: { 
                        ...content.beforeTableBlock, 
                        paragraphs: e.target.value.split('\n\n').filter(s => s.trim()) 
                      } 
                    })}
                    className="min-h-[120px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Критерии</label>
                  {content.beforeTableBlock.criteria.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        className="w-20"
                        value={item.icon}
                        onChange={(e) => {
                          const newCriteria = [...content.beforeTableBlock.criteria];
                          newCriteria[index] = { ...newCriteria[index], icon: e.target.value };
                          updateContent({ beforeTableBlock: { ...content.beforeTableBlock, criteria: newCriteria } });
                        }}
                        placeholder="🎯"
                      />
                      <Input
                        className="flex-1"
                        value={item.text}
                        onChange={(e) => {
                          const newCriteria = [...content.beforeTableBlock.criteria];
                          newCriteria[index] = { ...newCriteria[index], text: e.target.value };
                          updateContent({ beforeTableBlock: { ...content.beforeTableBlock, criteria: newCriteria } });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newCriteria = content.beforeTableBlock.criteria.filter((_, i) => i !== index);
                          updateContent({ beforeTableBlock: { ...content.beforeTableBlock, criteria: newCriteria } });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newCriteria = [...content.beforeTableBlock.criteria, { icon: '✅', text: 'Новый критерий' }];
                      updateContent({ beforeTableBlock: { ...content.beforeTableBlock, criteria: newCriteria } });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить критерий
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Content Blocks */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Текстовые блоки перед FAQ</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {content.contentBlocks.map((block, blockIndex) => (
                    <AccordionItem key={blockIndex} value={`block-${blockIndex}`}>
                      <AccordionTrigger>{block.title}</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Заголовок</label>
                          <Input
                            value={block.title}
                            onChange={(e) => {
                              const newBlocks = [...content.contentBlocks];
                              newBlocks[blockIndex] = { ...newBlocks[blockIndex], title: e.target.value };
                              updateContent({ contentBlocks: newBlocks });
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Параграфы</label>
                          <Textarea
                            value={(block.paragraphs || []).join('\n\n')}
                            onChange={(e) => {
                              const newBlocks = [...content.contentBlocks];
                              newBlocks[blockIndex] = { 
                                ...newBlocks[blockIndex], 
                                paragraphs: e.target.value.split('\n\n').filter(s => s.trim()) 
                              };
                              updateContent({ contentBlocks: newBlocks });
                            }}
                            className="min-h-[80px]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Список</label>
                          {(block.list || []).map((item, itemIndex) => (
                            <div key={itemIndex} className="flex gap-2 mb-2">
                              <Input
                                className="w-20"
                                value={item.icon}
                                onChange={(e) => {
                                  const newBlocks = [...content.contentBlocks];
                                  const newList = [...(newBlocks[blockIndex].list || [])];
                                  newList[itemIndex] = { ...newList[itemIndex], icon: e.target.value };
                                  newBlocks[blockIndex] = { ...newBlocks[blockIndex], list: newList };
                                  updateContent({ contentBlocks: newBlocks });
                                }}
                              />
                              <Input
                                className="flex-1"
                                value={item.text}
                                onChange={(e) => {
                                  const newBlocks = [...content.contentBlocks];
                                  const newList = [...(newBlocks[blockIndex].list || [])];
                                  newList[itemIndex] = { ...newList[itemIndex], text: e.target.value };
                                  newBlocks[blockIndex] = { ...newBlocks[blockIndex], list: newList };
                                  updateContent({ contentBlocks: newBlocks });
                                }}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newBlocks = [...content.contentBlocks];
                                  const newList = (newBlocks[blockIndex].list || []).filter((_, i) => i !== itemIndex);
                                  newBlocks[blockIndex] = { ...newBlocks[blockIndex], list: newList };
                                  updateContent({ contentBlocks: newBlocks });
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newBlocks = [...content.contentBlocks];
                              const newList = [...(newBlocks[blockIndex].list || []), { icon: '✅', text: 'Новый пункт' }];
                              newBlocks[blockIndex] = { ...newBlocks[blockIndex], list: newList };
                              updateContent({ contentBlocks: newBlocks });
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Добавить пункт
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>FAQ ({content.faqData.length} вопросов)</span>
                  <Button onClick={addFAQ}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {content.faqData.map((item, index) => (
                    <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <span className="text-left">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Вопрос</label>
                          <Input
                            value={item.question}
                            onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Ответ</label>
                          <Textarea
                            value={item.answer}
                            onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                            className="min-h-[100px]"
                          />
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeFAQ(index)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Удалить
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pages Tab */}
          <TabsContent value="pages">
            <div className="space-y-6">
              {/* Navigation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Меню навигации
                  </CardTitle>
                  <CardDescription>Ссылки в верхнем меню сайта</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {content.navigation.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={item.label}
                        onChange={(e) => updateNavItem(index, 'label', e.target.value)}
                        placeholder="Название"
                        className="flex-1"
                      />
                      <Input
                        value={item.href}
                        onChange={(e) => updateNavItem(index, 'href', e.target.value)}
                        placeholder="Ссылка (/ или #anchor)"
                        className="flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeNavItem(index)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addNavItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить пункт меню
                  </Button>
                </CardContent>
              </Card>

              {/* Pages */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Layers className="w-5 h-5" />
                        Дополнительные страницы
                      </CardTitle>
                      <CardDescription>Создавайте новые страницы с настраиваемыми блоками</CardDescription>
                    </div>
                    <Button onClick={addPage}>
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить страницу
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {content.pages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Нет дополнительных страниц. Нажмите «Добавить страницу» для создания.
                    </p>
                  ) : (
                    <Accordion type="single" collapsible className="space-y-4">
                      {content.pages.map((page, index) => (
                        <AccordionItem key={page.id} value={page.id} className="border rounded-lg">
                          <AccordionTrigger className="px-4 hover:no-underline">
                            <div className="flex items-center gap-3 flex-wrap">
                              <Badge variant="outline">/{page.slug}</Badge>
                              <span className="font-medium">{page.title}</span>
                              {page.showInMenu && <Badge variant="secondary">В меню</Badge>}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); duplicatePage(index); }}
                                className="ml-auto"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 space-y-6">
                            {/* Основные настройки */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">URL (slug)</label>
                                <Input
                                  value={page.slug}
                                  onChange={(e) => updatePage(index, { slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                                  placeholder="example-page"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Будет доступна по адресу: /{page.slug}</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Название в меню</label>
                                <Input
                                  value={page.menuLabel}
                                  onChange={(e) => updatePage(index, { menuLabel: e.target.value })}
                                  placeholder="Название пункта меню"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <Switch
                                checked={page.showInMenu}
                                onCheckedChange={(checked) => updatePage(index, { showInMenu: checked })}
                              />
                              <label className="text-sm">Показывать в меню</label>
                            </div>

                            {/* SEO */}
                            <div className="space-y-4">
                              <h4 className="font-semibold">SEO настройки</h4>
                              <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <Input
                                  value={page.metaData.title}
                                  onChange={(e) => updatePage(index, { metaData: { ...page.metaData, title: e.target.value } })}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <Textarea
                                  value={page.metaData.description}
                                  onChange={(e) => updatePage(index, { metaData: { ...page.metaData, description: e.target.value } })}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Keywords</label>
                                <Input
                                  value={page.metaData.keywords || ''}
                                  onChange={(e) => updatePage(index, { metaData: { ...page.metaData, keywords: e.target.value } })}
                                  placeholder="ключевое слово 1, ключевое слово 2, ..."
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Canonical URL</label>
                                <Input
                                  value={page.metaData.canonicalUrl || ''}
                                  onChange={(e) => updatePage(index, { metaData: { ...page.metaData, canonicalUrl: e.target.value } })}
                                  placeholder="https://example.com/page-slug"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Полный URL страницы для мета-тегов og:url и canonical. Оставьте пустым для автогенерации.
                                </p>
                              </div>
                            </div>

                            {/* Блоки */}
                            <div className="space-y-4">
                              <h4 className="font-semibold">Отображаемые блоки</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                  { key: 'showHeader', label: 'Шапка' },
                                  { key: 'showAuthor', label: 'Автор' },
                                  { key: 'showIntro', label: 'Вступление' },
                                  { key: 'showBeforeTable', label: 'Блок до таблицы' },
                                  { key: 'showCoursesList', label: 'Список курсов' },
                                  { key: 'showCourseDetails', label: 'Детали курсов' },
                                  { key: 'showContentBlocks', label: 'Контент-блоки' },
                                  { key: 'showFAQ', label: 'FAQ' },
                                ].map(({ key, label }) => (
                                  <div key={key} className="flex items-center gap-2">
                                    <Switch
                                      checked={page.blocks[key as keyof PageBlocks]}
                                      onCheckedChange={(checked) => updatePageBlocks(index, key as keyof PageBlocks, checked)}
                                    />
                                    <label className="text-sm">{label}</label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Редактор контента страницы */}
                            <PageContentEditor 
                              page={page} 
                              pageIndex={index} 
                              onUpdatePage={updatePage} 
                            />

                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => removePage(index)}
                              className="mt-6"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Удалить страницу
                            </Button>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab - Favicon */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Favicon (иконка сайта)
                </CardTitle>
                <CardDescription>Настройте иконку, которая отображается во вкладке браузера</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">📋 Требования к favicon</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                    <li><strong>Размер:</strong> 32×32 px или 16×16 px (рекомендуется 32×32)</li>
                    <li><strong>Формат:</strong> ICO, PNG или SVG</li>
                    <li><strong>Прозрачность:</strong> PNG и ICO поддерживают прозрачный фон</li>
                    <li><strong>Цвета:</strong> Используйте контрастные цвета для видимости</li>
                  </ul>
                </div>

                <ImageUploader
                  label="Favicon"
                  value={faviconUrl}
                  onChange={saveFavicon}
                  previewClassName="w-8 h-8 object-contain"
                  maxWidth={64}
                  quality={1}
                />

                {faviconUrl && (
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-background rounded border flex items-center justify-center">
                        <img src={faviconUrl} alt="Favicon preview" className="w-4 h-4" />
                      </div>
                      <span className="text-sm">Как выглядит во вкладке</span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Где создать favicon:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><a href="https://favicon.io" target="_blank" rel="noopener" className="text-primary hover:underline">favicon.io</a> — генератор из текста, изображения или эмодзи</li>
                    <li><a href="https://realfavicongenerator.net" target="_blank" rel="noopener" className="text-primary hover:underline">realfavicongenerator.net</a> — продвинутый генератор</li>
                    <li><a href="https://www.canva.com" target="_blank" rel="noopener" className="text-primary hover:underline">Canva</a> — создайте дизайн 32×32 px</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Admin = () => {
  return (
    <AdminAuth>
      <AdminContent />
    </AdminAuth>
  );
};

export default Admin;
