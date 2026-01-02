import { useContent, Author } from "@/contexts/ContentContext";
import { getLastMonday } from "@/data/content";
import { Calendar, User } from "lucide-react";

interface AuthorBlockProps {
  author?: Author;
}

export const AuthorBlock = ({ author: authorProp }: AuthorBlockProps) => {
  const { content } = useContent();
  const author = authorProp || content.author;
  const updatedAt = getLastMonday();
  
  return (
    <section className="py-6 md:py-8">
      <div className="container max-w-4xl mx-auto px-3 md:px-4">
        {/* Author Card with Schema.org microdata */}
        <div 
          className="bg-card rounded-xl p-4 md:p-6 shadow-sm border border-border"
          itemScope
          itemType="https://schema.org/Person"
          itemProp="author"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-5">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                <img 
                  src={author.photo} 
                  alt={author.name} 
                  className="w-full h-full object-cover"
                  itemProp="image"
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <User className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Автор рейтинга</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-primary mb-2">
                <a 
                  href={author.link} 
                  className="hover:underline"
                  itemProp="url"
                >
                  <span itemProp="name">{author.name}</span>
                </a>
              </h2>
              <p 
                className="text-sm md:text-base text-muted-foreground leading-relaxed"
                itemProp="description"
              >
                {author.description}
              </p>
            </div>
          </div>
        </div>
        
        {/* Update Date */}
        <div className="mt-3 md:mt-4 bg-card rounded-lg py-2.5 md:py-3 px-4 md:px-6 shadow-sm border border-border flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Обновлено: <time className="font-medium text-foreground" dateTime={new Date().toISOString()}>{updatedAt}</time>
          </p>
        </div>
      </div>
    </section>
  );
};