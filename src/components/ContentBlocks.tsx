import { useContent, ContentBlock } from "@/contexts/ContentContext";

interface ContentBlocksProps {
  contentBlocksData?: ContentBlock[];
}

const ContentBlocks = ({ contentBlocksData }: ContentBlocksProps) => {
  const { content } = useContent();
  const contentBlocks = contentBlocksData || content.contentBlocks;
  return (
    <section className="py-8 md:py-12">
      <div className="space-y-10 md:space-y-12">
        {contentBlocks.map((block, index) => (
          <article key={index} className="space-y-4">
            {/* Заголовок блока */}
            <h2 className="flex items-start gap-3 text-xl md:text-2xl font-bold text-foreground">
              <span className="text-primary mt-1">●</span>
              {block.title}
            </h2>

            {/* Параграфы */}
            {block.paragraphs && (
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {block.paragraphs.map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))}
              </div>
            )}

            {/* Список с иконками */}
            {block.list && (
              <ul className="space-y-3 mt-4">
                {block.list.map((item, lIndex) => (
                  <li key={lIndex} className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <span className="text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default ContentBlocks;
