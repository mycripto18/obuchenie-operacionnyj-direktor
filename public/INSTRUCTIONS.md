# Инструкция по созданию контента

## Быстрый старт

1. Скопируйте промпт ниже → вставьте в ChatGPT/Claude/Gemini
2. Укажите тему курсов
3. Получите JSON → загрузите в `/admin`

---

## ПРОМПТ ДЛЯ НЕЙРОСЕТИ

```
Ты — SEO-копирайтер. Создай JSON для сайта-рейтинга онлайн-курсов.

ТЕМА: [УКАЖИ ТЕМУ, например: курсы бухгалтерии]

ПРАВИЛА:
- Минимум 5 курсов (реальные школы: Skillbox, Нетология, GeekBrains, Eduson, Контур.Школа, HEDU, Otus)
- Цены — числа без пробелов (45000, не "45 000")
- badge: "top" (1 место), "popular" (2 место), "new" (3 место), остальные — без badge
- features: 4 пункта, skills: 4-6 пунктов, advantages: 3-4 пункта
- faqData: 5-7 вопросов, contentBlocks: 2-3 блока
- Все тексты — на русском языке

СТРУКТУРА JSON:

{
  "pageTitle": "[ТОП-5] лучших курсов [тема] в 2025 году",
  "metaData": {
    "title": "[ТОП-5] курсов [тема] 2025 — рейтинг с ценами",
    "description": "Рейтинг лучших курсов [тема] 2025. Сравнение цен и отзывов. До 160 символов.",
    "keywords": "ключевое1, ключевое2, ключевое3",
    "canonicalUrl": "https://example.com"
  },
  "author": {
    "name": "Имя Фамилия",
    "photo": "https://placehold.co/200x200/3b82f6/ffffff?text=ИФ",
    "description": "Эксперт в области [тема] с 10+ летним опытом.",
    "link": "#author"
  },
  "headerStats": {
    "reviewsCount": "5000+",
    "badgeText": "Обзор курсов 2025",
    "subtitle": "Анализ программ с отзывами и сравнением цен"
  },
  "introText": "Вводный текст: что найдёт читатель, для кого статья.",
  "beforeTableBlock": {
    "title": "Как мы составляли рейтинг",
    "paragraphs": [
      "Методология: сколько курсов проанализировано.",
      "На что обращали внимание при оценке."
    ],
    "criteria": [
      {"icon": "📋", "text": "Полнота программы"},
      {"icon": "🎓", "text": "Качество документа"},
      {"icon": "👨‍🏫", "text": "Квалификация преподавателей"},
      {"icon": "📊", "text": "Соотношение цены и качества"},
      {"icon": "💼", "text": "Помощь в трудоустройстве"},
      {"icon": "⭐", "text": "Отзывы выпускников"}
    ]
  },
  "courses": [
    {
      "id": 1,
      "title": "Название курса",
      "school": "Название школы",
      "schoolLogo": "https://placehold.co/800x400/3b82f6/ffffff?text=School",
      "url": "https://example.com/course",
      "price": 50000,
      "oldPrice": 80000,
      "installment": 4167,
      "format": "Онлайн с куратором",
      "duration": "3 месяца",
      "document": "Удостоверение о повышении квалификации",
      "forWhom": "Для начинающих специалистов",
      "features": ["Особенность 1", "Особенность 2", "Особенность 3", "Особенность 4"],
      "skills": ["Навык 1", "Навык 2", "Навык 3", "Навык 4"],
      "teachers": [{"name": "Имя Преподавателя", "description": "Опыт 15 лет"}],
      "program": ["Тема 1", "Тема 2", "Тема 3", "Тема 4"],
      "advantages": ["Преимущество 1", "Преимущество 2", "Преимущество 3"],
      "reviews": "Выпускники отмечают качество материалов и поддержку.",
      "reviewLinks": [
        {"platform": "Яндекс", "count": "100+", "rating": "4.9", "url": "#"},
        {"platform": "Отзовик", "count": "50+", "rating": "4.8", "url": "#"},
        {"platform": "tutortop", "count": "30+", "rating": "4.7", "url": "#"}
      ],
      "badge": "top",
      "promoCode": "PROMO2025",
      "discount": "-30%"
    }
  ],
  "contentBlocks": [
    {
      "title": "Кто такой [специалист] и чем занимается",
      "paragraphs": ["Параграф 1", "Параграф 2"],
      "list": [
        {"icon": "👔", "text": "Пункт 1"},
        {"icon": "🏛️", "text": "Пункт 2"},
        {"icon": "📈", "text": "Пункт 3"}
      ]
    },
    {
      "title": "Сколько зарабатывает [специалист]",
      "paragraphs": ["Информация о зарплатах."]
    }
  ],
  "faqData": [
    {"question": "Вопрос 1?", "answer": "Ответ на вопрос 1."},
    {"question": "Вопрос 2?", "answer": "Ответ на вопрос 2."},
    {"question": "Вопрос 3?", "answer": "Ответ на вопрос 3."},
    {"question": "Вопрос 4?", "answer": "Ответ на вопрос 4."},
    {"question": "Вопрос 5?", "answer": "Ответ на вопрос 5."}
  ]
}

ВАЖНО:
- Создай 5 полных объектов курсов по этому шаблону
- oldPrice, installment, promoCode, discount — опциональны (можно null)
- Выведи ТОЛЬКО готовый JSON без пояснений и комментариев
```

---

## Как загрузить JSON

### Главная страница:
1. Откройте `/admin` → введите пароль (`admin123`)
2. Перетащите JSON в зону загрузки
3. Выберите **"Главная страница"** → **"Импортировать"**

### Дополнительные страницы:
1. Вкладка "Страницы" → "Добавить страницу" → укажите URL (slug)
2. Загрузите JSON → выберите созданную страницу

---

## Справочник полей

### metaData (SEO)
| Поле | Макс. длина | Описание |
|------|-------------|----------|
| title | 60 | Title браузера |
| description | 160 | Meta description |
| keywords | — | Ключевые слова |
| canonicalUrl | — | Канонический URL |

### courses (Курсы)
| Поле | Тип | Обязательное |
|------|-----|--------------|
| id | number | ✅ |
| title | string | ✅ |
| school | string | ✅ |
| schoolLogo | string | ✅ |
| url | string | ✅ |
| price | number | ✅ |
| oldPrice | number | ❌ |
| installment | number | ❌ |
| format | string | ✅ |
| duration | string | ✅ |
| document | string | ✅ |
| forWhom | string | ✅ |
| features | string[] | ✅ |
| skills | string[] | ✅ |
| teachers | object[] | ❌ |
| program | string[] | ❌ |
| advantages | string[] | ✅ |
| reviews | string | ✅ |
| reviewLinks | object[] | ❌ |
| badge | string | ❌ |
| promoCode | string | ❌ |
| discount | string | ❌ |

### Изображения
- Курсы: `https://placehold.co/800x400/ЦВЕТ/ffffff?text=ТЕКСТ`
- Аватар: `https://placehold.co/200x200/ЦВЕТ/ffffff?text=ИНИЦИАЛЫ`
- Цвета: `3b82f6` (синий), `22c55e` (зелёный), `6366f1` (фиолетовый), `f59e0b` (оранжевый)
