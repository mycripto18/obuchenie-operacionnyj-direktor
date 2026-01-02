import { ExternalLink } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";

export const MobileStickyCTA = () => {
  const { content } = useContent();
  const topCourse = content.courses[0];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 bg-card/95 backdrop-blur-md border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 md:hidden safe-area-inset">
      <a
        href={topCourse.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors active:scale-[0.98]"
      >
        Лучший курс — {topCourse.school}
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
};