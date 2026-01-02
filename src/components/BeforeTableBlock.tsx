import { useContent, BeforeTableBlock as BeforeTableBlockType } from "@/contexts/ContentContext";

interface BeforeTableBlockProps {
  beforeTableBlockData?: BeforeTableBlockType;
}

const BeforeTableBlock = ({ beforeTableBlockData }: BeforeTableBlockProps) => {
  const { content } = useContent();
  const beforeTableBlock = beforeTableBlockData || content.beforeTableBlock;
  return (
    <section className="py-8 md:py-12 max-w-4xl mx-auto px-4">
      <div className="bg-card/50 rounded-2xl p-6 md:p-8 border border-border/50 backdrop-blur-sm">
        {/* Заголовок */}
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 leading-tight">
          {beforeTableBlock.title}
        </h2>

        {/* Параграфы */}
        <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
          {beforeTableBlock.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Критерии отбора */}
        <ul className="space-y-4">
          {beforeTableBlock.criteria.map((item, index) => (
            <li 
              key={index} 
              className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <span className="text-foreground/90">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default BeforeTableBlock;
