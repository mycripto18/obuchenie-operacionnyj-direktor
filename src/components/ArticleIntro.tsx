import { useContent } from "@/contexts/ContentContext";

interface ArticleIntroProps {
  introText?: string;
}

export const ArticleIntro = ({ introText: introTextProp }: ArticleIntroProps) => {
  const { content } = useContent();
  const introText = introTextProp || content.introText;
  return (
    <section className="pb-6">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <p className="text-foreground leading-relaxed">{introText}</p>
        </div>
      </div>
    </section>
  );
};
