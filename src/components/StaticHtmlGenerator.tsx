import React, { useState } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { 
  Download, 
  Copy, 
  Check, 
  Globe, 
  FileCode,
  FolderOpen,
  Lightbulb,
  FileText
} from 'lucide-react';

// Функция для очистки HTML-тегов из текста
const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

// Функция для экранирования HTML-сущностей
const escapeHtml = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Форматирование цены
const formatPrice = (price: number | undefined): string => {
  if (!price) return 'Бесплатно';
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
};

// Получить медаль для позиции
const getMedal = (position: number): string => {
  if (position === 1) return '🥇';
  if (position === 2) return '🥈';
  if (position === 3) return '🥉';
  return '';
};

export const StaticHtmlGenerator: React.FC = () => {
  const { content } = useContent();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast.success('Скопировано!');
  };

  const downloadHtml = (html: string, filename: string) => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Файл ${filename} скачан`);
  };

  // Генерация Header секции
  const generateHeader = (pageTitle: string, headerStats?: typeof content.headerStats) => {
    const stats = headerStats || content.headerStats;
    return `
  <!-- Header -->
  <header class="header">
    <div class="header-bg-circle header-bg-circle--top"></div>
    <div class="header-bg-circle header-bg-circle--bottom"></div>
    <div class="header-content container">
      <div class="header-badge">
        <span>📅</span>
        <span>Обновлено: ${content.updatedAt || new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>
      <h1 class="header-title">${escapeHtml(pageTitle)}</h1>
      <p class="header-subtitle">${escapeHtml(stats.subtitle || '')}</p>
      <div class="header-stats">
        <div class="stat-item">
          <div class="stat-icon">⭐</div>
          <div>
            <div class="stat-value">${escapeHtml(stats.reviewsCount || '0')}</div>
            <div class="stat-label">отзывов</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">📊</div>
          <div>
            <div class="stat-value">${escapeHtml(stats.badgeText || '')}</div>
            <div class="stat-label">рейтинг</div>
          </div>
        </div>
      </div>
    </div>
    <div class="header-wave">
      <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0 80L60 74.7C120 69.3 240 58.7 360 53.3C480 48 600 48 720 53.3C840 58.7 960 69.3 1080 69.3C1200 69.3 1320 58.7 1380 53.3L1440 48V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="hsl(210, 40%, 96%)"/>
      </svg>
    </div>
  </header>`;
  };

  // Генерация навигации
  const generateNavigation = () => {
    const navItems = content.navigation || [];
    if (navItems.length === 0) return '';
    return `
  <!-- Navigation -->
  <nav class="nav">
    <div class="container">
      <ul class="nav-list">
        ${navItems.map(item => `
        <li><a href="${item.href}" class="nav-link">${escapeHtml(item.label)}</a></li>`).join('')}
      </ul>
    </div>
  </nav>`;
  };

  // Генерация блока автора
  const generateAuthor = (author?: typeof content.author) => {
    const a = author || content.author;
    if (!a?.name) return '';
    return `
  <!-- Author -->
  <section class="author">
    <div class="container">
      <div class="author-card">
        ${a.photo ? `<img src="${a.photo}" alt="${escapeHtml(a.name)}" class="author-avatar">` : ''}
        <div class="author-info">
          <h2 class="author-name">${escapeHtml(a.name)}</h2>
          ${a.link && a.link !== '#' ? `<p class="author-credentials"><a href="${a.link}" target="_blank" rel="noopener">${escapeHtml(a.name)}</a></p>` : ''}
          ${a.description ? `<p class="author-bio">${escapeHtml(stripHtml(a.description))}</p>` : ''}
          <p class="author-date">Обновлено: ${content.updatedAt || 'недавно'}</p>
        </div>
      </div>
    </div>
  </section>`;
  };

  // Генерация вступительного текста
  const generateIntro = (introText?: string) => {
    const text = introText || content.introText;
    if (!text) return '';
    return `
  <!-- Intro -->
  <section class="intro">
    <div class="container">
      <div class="intro-text">
        <p>${escapeHtml(stripHtml(text))}</p>
      </div>
    </div>
  </section>`;
  };

  // Генерация блока перед таблицей
  const generateBeforeTable = (beforeTableBlock?: typeof content.beforeTableBlock) => {
    const block = beforeTableBlock || content.beforeTableBlock;
    if (!block?.title) return '';
    return `
  <!-- Before Table -->
  <section class="before-table">
    <div class="container">
      <div class="before-table-card">
        <h2 class="before-table-title">${escapeHtml(block.title)}</h2>
        <div class="before-table-paragraphs">
          ${(block.paragraphs || []).map(p => `<p>${escapeHtml(stripHtml(p))}</p>`).join('\n          ')}
        </div>
        <ul class="criteria-list">
          ${(block.criteria || []).map(c => `
          <li class="criteria-item">
            <span class="criteria-icon">${c.icon}</span>
            <span class="criteria-text">${escapeHtml(c.text)}</span>
          </li>`).join('')}
        </ul>
      </div>
    </div>
  </section>`;
  };

  // Генерация таблицы курсов
  const generateCoursesTable = (courses?: typeof content.courses, tableTitle?: string) => {
    const c = courses || content.courses;
    const title = tableTitle || 'Рейтинг курсов';
    if (!c || c.length === 0) return '';
    
    return `
  <!-- Courses Table -->
  <section class="courses">
    <div class="container">
      <div class="courses-card">
        <h2 class="courses-title">${escapeHtml(title)}</h2>
        
        <!-- Mobile Cards -->
        <div class="course-cards">
          ${c.map((course, i) => `
          <article class="course-card">
            <div class="course-header">
              <div class="course-rank">
                <span class="course-number">${i + 1}</span>
                <span class="course-medal">${getMedal(i + 1)}</span>
              </div>
              <span class="course-price-badge">${formatPrice(course.price)}</span>
            </div>
            <a href="${course.url || '#'}" class="course-title-link" target="_blank" rel="noopener">${escapeHtml(course.title || '')}</a>
            <p class="course-school">${escapeHtml(course.school || '')}</p>
            <div class="course-buttons">
              <a href="#course-${i + 1}" class="btn btn-secondary">Подробнее</a>
              <a href="${course.url || '#'}" class="btn btn-primary" target="_blank" rel="noopener">На сайт →</a>
            </div>
          </article>`).join('')}
        </div>
        
        <!-- Desktop Table -->
        <table class="courses-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Курс</th>
              <th>Школа</th>
              <th>Цена</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            ${c.map((course, i) => `
            <tr>
              <td style="text-align:center">${i + 1} ${getMedal(i + 1)}</td>
              <td><a href="${course.url || '#'}" target="_blank" rel="noopener">${escapeHtml(course.title || '')}</a></td>
              <td>${escapeHtml(course.school || '')}</td>
              <td>${formatPrice(course.price)}</td>
              <td style="text-align:center"><a href="${course.url || '#'}" class="btn btn-primary" target="_blank" rel="noopener">На сайт →</a></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </section>`;
  };

  // Генерация детальных карточек курсов
  const generateCourseDetails = (courses?: typeof content.courses) => {
    const c = courses || content.courses;
    if (!c || c.length === 0) return '';
    
    return `
  <!-- Course Details -->
  <section class="course-details">
    <div class="container">
      ${c.map((course, i) => `
      <article class="course-detail-card" id="course-${i + 1}">
        <div class="course-detail-header">
          <h3 class="course-detail-title">
            <span class="course-detail-number">${i + 1}.</span>
            <a href="${course.url || '#'}" target="_blank" rel="noopener">${escapeHtml(course.title || '')}</a>
            <span class="course-detail-school">— ${escapeHtml(course.school || '')}</span>
          </h3>
        </div>
        
        ${course.schoolLogo ? `
        <div class="course-detail-image">
          <img src="${course.schoolLogo}" alt="${escapeHtml(course.school || '')}" loading="lazy">
        </div>` : ''}
        
        <div class="course-info-grid">
          <div class="info-item">
            <span class="info-icon">💰</span>
            <div>
              <p class="info-label">Стоимость</p>
              <p class="info-value">${formatPrice(course.price)}</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">⏱️</span>
            <div>
              <p class="info-label">Длительность</p>
              <p class="info-value">${escapeHtml(course.duration || 'Не указано')}</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">📄</span>
            <div>
              <p class="info-label">Документ</p>
              <p class="info-value">${escapeHtml(course.document || 'Сертификат')}</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">🎯</span>
            <div>
              <p class="info-label">Формат</p>
              <p class="info-value">${escapeHtml(course.format || 'Онлайн')}</p>
            </div>
          </div>
          ${course.promoCode?.code ? `
          <div class="info-item info-promo">
            <span class="info-icon">🎁</span>
            <div>
              <p class="info-label">${escapeHtml(course.promoCode.discountText || 'Скидка')}</p>
              <div class="promo-code-wrapper">
                <span>Промокод:</span>
                <code>${escapeHtml(course.promoCode.code)}</code>
              </div>
            </div>
          </div>` : ''}
        </div>
        
        <div class="course-detail-content">
          ${course.forWhom ? `
          <div class="detail-section">
            <h4 class="detail-section-title"><span class="detail-icon">👥</span> Для кого</h4>
            <p class="detail-text">${escapeHtml(stripHtml(course.forWhom))}</p>
          </div>` : ''}
          
          ${course.features && course.features.length > 0 ? `
          <div class="detail-section">
            <h4 class="detail-section-title"><span class="detail-icon">📚</span> Программа курса</h4>
            <ul class="program-list">
              ${course.features.map(f => `<li>${escapeHtml(stripHtml(f))}</li>`).join('\n              ')}
            </ul>
          </div>` : ''}
          
          ${course.skills && course.skills.length > 0 ? `
          <div class="detail-section">
            <h4 class="detail-section-title"><span class="detail-icon">🎓</span> Чему научитесь</h4>
            <ul class="skills-list">
              ${course.skills.map(s => `<li><span class="check-icon">✓</span> ${escapeHtml(stripHtml(s))}</li>`).join('\n              ')}
            </ul>
          </div>` : ''}
          
          ${course.advantages && course.advantages.length > 0 ? `
          <div class="detail-section">
            <h4 class="detail-section-title"><span class="detail-icon">⭐</span> Преимущества</h4>
            <ul class="advantages-list">
              ${course.advantages.map(a => `<li><span class="adv-icon">★</span> ${escapeHtml(a)}</li>`).join('\n              ')}
            </ul>
          </div>` : ''}
          
          ${course.reviews ? `
          <div class="reviews-section">
            <h4 class="detail-section-title"><span class="detail-icon">💬</span> Отзывы</h4>
            <p class="reviews-quote">"${escapeHtml(stripHtml(course.reviews))}"</p>
          </div>` : ''}
          
          <div class="course-cta">
            <a href="${course.url || '#'}" class="btn btn-primary btn-large" target="_blank" rel="noopener">Записаться на курс →</a>
          </div>
        </div>
      </article>`).join('\n      ')}
    </div>
  </section>`;
  };

  // Генерация контентных блоков
  const generateContentBlocks = (contentBlocks?: typeof content.contentBlocks) => {
    const blocks = contentBlocks || content.contentBlocks;
    if (!blocks || blocks.length === 0) return '';
    
    return `
  <!-- Content Blocks -->
  <section class="content-blocks">
    <div class="container">
      ${blocks.map(block => `
      <article class="content-block">
        <h2 class="content-block-title">
          <span class="content-block-bullet">▸</span>
          ${escapeHtml(block.title || '')}
        </h2>
        <div class="content-block-paragraphs">
          ${(block.paragraphs || []).map(p => `<p>${escapeHtml(stripHtml(p))}</p>`).join('\n          ')}
        </div>
        ${block.list && block.list.length > 0 ? `
        <ul class="content-block-list">
          ${block.list.map(item => `
          <li>
            <span class="content-block-list-icon">${item.icon || '•'}</span>
            <span>${escapeHtml(item.text)}</span>
          </li>`).join('')}
        </ul>` : ''}
      </article>`).join('\n      ')}
    </div>
  </section>`;
  };

  // Генерация FAQ
  const generateFAQ = (faqData?: typeof content.faqData) => {
    const faq = faqData || content.faqData;
    const title = 'Часто задаваемые вопросы';
    if (!faq || faq.length === 0) return '';
    
    return `
  <!-- FAQ -->
  <section class="faq">
    <div class="container">
      <h2 class="faq-title">${escapeHtml(title)}</h2>
      <div class="faq-list">
        ${faq.map((item, i) => `
        <article class="faq-item">
          <h3 class="faq-question">${escapeHtml(item.question || '')}</h3>
          <p class="faq-answer">${escapeHtml(stripHtml(item.answer || ''))}</p>
        </article>`).join('\n        ')}
      </div>
    </div>
  </section>`;
  };

  // Генерация футера
  const generateFooter = () => {
    const disclosure = content.adDisclosureText;
    return `
  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      ${disclosure ? `<p class="footer-text">${escapeHtml(disclosure)}</p>` : ''}
      <p class="footer-text">© ${new Date().getFullYear()} — Все права защищены</p>
      <div class="footer-links">
        <a href="/legal/privacy">Политика конфиденциальности</a>
      </div>
    </div>
  </footer>`;
  };

  // Генерация полного HTML для главной страницы
  const generateMainPageHtml = () => {
    const meta = content.metaData;
    const canonicalUrl = meta.canonicalUrl || 'https://example.com/';
    const ogImage = `${canonicalUrl.replace(/\/$/, '')}/favicon.png`;
    
    return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5">
  <title>${escapeHtml(meta.title || '')}</title>
  <meta name="description" content="${escapeHtml(meta.description || '')}">
  <meta name="keywords" content="${escapeHtml(meta.keywords || '')}">
  <meta name="author" content="${escapeHtml(content.author?.name || '')}">
  <meta name="robots" content="index, follow">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="apple-touch-icon" href="/favicon.png">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(meta.title || '')}">
  <meta property="og:description" content="${escapeHtml(meta.description || '')}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:locale" content="ru_RU">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(meta.title || '')}">
  <meta name="twitter:description" content="${escapeHtml(meta.description || '')}">
  <meta name="twitter:image" content="${ogImage}">
  
  <!-- Mobile -->
  <meta name="theme-color" content="#1d7bf5">
  <meta name="mobile-web-app-capable" content="yes">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Styles -->
  <link rel="stylesheet" href="/styles-static.css">
</head>
<body>
${generateHeader(content.pageTitle || '')}
${generateNavigation()}
${generateAuthor()}
${generateIntro()}
${generateBeforeTable()}
${generateCoursesTable()}
${generateCourseDetails()}
${generateContentBlocks()}
${generateFAQ()}
${generateFooter()}
</body>
</html>`;
  };

  // Генерация HTML для дополнительной страницы
  const generatePageHtml = (page: typeof content.pages[0]) => {
    const meta = page.metaData;
    const baseUrl = content.metaData.canonicalUrl?.replace(/\/$/, '') || 'https://example.com';
    const canonicalUrl = meta.canonicalUrl || `${baseUrl}/${page.slug}`;
    const ogImage = `${baseUrl}/favicon.png`;
    
    return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5">
  <title>${escapeHtml(meta.title || page.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description || '')}">
  <meta name="keywords" content="${escapeHtml(meta.keywords || '')}">
  <meta name="robots" content="index, follow">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="apple-touch-icon" href="/favicon.png">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(meta.title || page.title)}">
  <meta property="og:description" content="${escapeHtml(meta.description || '')}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:locale" content="ru_RU">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(meta.title || page.title)}">
  <meta name="twitter:description" content="${escapeHtml(meta.description || '')}">
  <meta name="twitter:image" content="${ogImage}">
  
  <!-- Mobile -->
  <meta name="theme-color" content="#1d7bf5">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Styles -->
  <link rel="stylesheet" href="/styles-static.css">
</head>
<body>
${page.blocks?.showHeader !== false ? generateHeader(page.title, page.headerStats) : ''}
${page.blocks?.showAuthor !== false ? generateAuthor(page.author) : ''}
${page.blocks?.showIntro !== false ? generateIntro(page.introText) : ''}
${page.blocks?.showBeforeTable !== false ? generateBeforeTable(page.beforeTableBlock) : ''}
${page.blocks?.showCoursesList !== false ? generateCoursesTable(page.courses) : ''}
${page.blocks?.showCourseDetails !== false ? generateCourseDetails(page.courses) : ''}
${page.blocks?.showContentBlocks !== false ? generateContentBlocks(page.contentBlocks) : ''}
${page.blocks?.showFAQ !== false ? generateFAQ(page.faqData) : ''}
${generateFooter()}
</body>
</html>`;
  };

  const mainHtml = generateMainPageHtml();

  return (
    <div className="space-y-6">
      {/* Инфо-блок */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                ✅ Полностью статический HTML — без JavaScript!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Готовые страницы с полным дизайном. Подключают только <code className="bg-green-100 dark:bg-green-900 px-1 rounded">styles-static.css</code> и шрифты.
                Идеально для SEO и индексации Яндексом.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Главная страница */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Главная страница
          </CardTitle>
          <CardDescription>
            Полный статический HTML для <code className="bg-muted px-1 rounded">public/index.html</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{content.courses?.length || 0} курсов</Badge>
            <Badge variant="outline">{content.faqData?.length || 0} FAQ</Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">Без JavaScript</Badge>
          </div>
          
          <Textarea 
            value={mainHtml}
            readOnly
            className="font-mono text-xs min-h-[200px]"
          />
          
          <div className="flex gap-2">
            <Button 
              onClick={() => downloadHtml(mainHtml, 'index.html')}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Скачать index.html
            </Button>
            <Button 
              variant="outline"
              onClick={() => copyToClipboard(mainHtml, 'main')}
            >
              {copied === 'main' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Дополнительные страницы */}
      {content.pages && content.pages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="w-5 h-5" />
              Дополнительные страницы
            </CardTitle>
            <CardDescription>
              Статические HTML файлы для папок в <code className="bg-muted px-1 rounded">public/</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Структура папок
                  </p>
                  <div className="bg-amber-100 dark:bg-amber-900 rounded p-3 font-mono text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      <span>public/</span>
                    </div>
                    <div className="ml-6 flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      <span>index.html</span>
                      <span className="text-amber-600">← главная</span>
                    </div>
                    <div className="ml-6 flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      <span>styles-static.css</span>
                    </div>
                    {content.pages.slice(0, 3).map(page => (
                      <div key={page.id} className="ml-6 flex items-center gap-2">
                        <FolderOpen className="w-3 h-3" />
                        <span>{page.slug}/</span>
                        <span className="text-amber-600">index.html</span>
                      </div>
                    ))}
                    {content.pages.length > 3 && (
                      <div className="ml-6 text-muted-foreground">... и другие</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {content.pages.map((page) => {
                const pageHtml = generatePageHtml(page);
                return (
                  <AccordionItem key={page.id} value={page.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <FolderOpen className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">/{page.slug}/index.html</span>
                        <Badge variant="outline">{page.courses?.length || 0} курсов</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <Textarea 
                        value={pageHtml}
                        readOnly
                        className="font-mono text-xs min-h-[150px]"
                      />
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => downloadHtml(pageHtml, 'index.html')}
                          variant="outline"
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Скачать → public/{page.slug}/index.html
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => copyToClipboard(pageHtml, page.id)}
                        >
                          {copied === page.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* JSON Экспорт */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Экспорт JSON
          </CardTitle>
          <CardDescription>
            Полный экспорт данных сайта для переноса на другой ресурс
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => {
                const json = JSON.stringify(content, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `content-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success('JSON экспортирован!');
              }}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Скачать content.json (весь сайт)
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const json = JSON.stringify(content, null, 2);
                navigator.clipboard.writeText(json);
                setCopied('json-full');
                setTimeout(() => setCopied(null), 2000);
                toast.success('JSON скопирован!');
              }}
            >
              {copied === 'json-full' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          {content.pages && content.pages.length > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <p className="text-sm font-medium text-muted-foreground">Экспорт отдельных страниц:</p>
              {content.pages.map((page) => (
                <div key={page.id} className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 justify-start"
                    onClick={() => {
                      const pageJson = JSON.stringify(page, null, 2);
                      const blob = new Blob([pageJson], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${page.slug}-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success(`Страница /${page.slug} экспортирована`);
                    }}
                  >
                    <Download className="w-3 h-3 mr-2" />
                    /{page.slug}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Инструкция */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Инструкция по публикации</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Скачайте <code className="bg-muted px-1 rounded">index.html</code> для главной страницы</li>
            <li>Положите файл в папку <code className="bg-muted px-1 rounded">public/</code></li>
            <li>Для доп. страниц создайте папки <code className="bg-muted px-1 rounded">public/[slug]/</code> и положите туда index.html</li>
            <li>Убедитесь что <code className="bg-muted px-1 rounded">styles-static.css</code> лежит в public/</li>
            <li>Сделайте git commit и push — Vercel автоматически задеплоит</li>
          </ol>
          
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 <strong>Совет:</strong> После публикации запросите переиндексацию в Яндекс.Вебмастере для быстрого появления в поиске.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
