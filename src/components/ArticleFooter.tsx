import { useContent } from "@/contexts/ContentContext";
import { footer } from "@/data/siteContent";

export const ArticleFooter = () => {
  const { content } = useContent();
  
  const footerText = content.footerText || 'Интернет-сайт носит информационный характер и ни при каких условиях не является публичной офертой, которая определяется положениями статьи 437 Гражданского кодекса РФ.';
  const footerEmail = content.footerEmail || footer.email;
  
  return (
    <footer id="contacts" className="bg-primary/95 py-8 mt-8">
      <div className="container max-w-4xl mx-auto px-4 text-center">
        <p className="text-sm text-primary-foreground/70 mb-5">
          {footerText}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-primary-foreground/80">
          <span>{footer.copyright}</span>
          <span className="text-primary-foreground/40">•</span>
          <a href={`mailto:${footerEmail}`} className="hover:text-primary-foreground transition-colors">Контакты</a>
        </div>
      </div>
    </footer>
  );
};
