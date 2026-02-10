import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContentProvider } from "@/contexts/ContentContext";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

// Заглушка для главной — в продакшене статический HTML, здесь только для dev-превью
const HomePage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-8">
    <div className="max-w-lg text-center space-y-6">
      <div className="text-6xl">🏗️</div>
      <h1 className="text-2xl font-bold text-foreground">Статический сайт</h1>
      <p className="text-muted-foreground">
        Главная страница генерируется как статический HTML через админ-панель. 
        В продакшене здесь отображается <code className="bg-muted px-2 py-1 rounded text-sm">index.html</code> со всем контентом и микроразметкой.
      </p>
      <div className="flex flex-col gap-3">
        <a 
          href="/panel-x7k9m2" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          ⚙️ Открыть админ-панель
        </a>
        <p className="text-xs text-muted-foreground">
          Админка → вкладка «Статика» → Скачать index.html
        </p>
      </div>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ContentProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/panel-x7k9m2" element={<Admin />} />
            {/* Все остальные маршруты — статический HTML в продакшене */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ContentProvider>
  </QueryClientProvider>
);

export default App;
