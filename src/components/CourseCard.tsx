import { Star, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Course, formatPrice } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    const utmUrl = `${course.partnerUrl}?utm_source=site&utm_medium=card&partner_id=${course.id}`;
    console.log("Analytics: click_partner", { 
      courseId: course.id, 
      school: course.school.slug,
      url: utmUrl 
    });
    window.open(utmUrl, "_blank");
  };

  const handleCardView = () => {
    console.log("Analytics: view_card", { courseId: course.id });
  };

  const handleCopyPromo = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (course.promoCode?.code) {
      await navigator.clipboard.writeText(course.promoCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article 
      className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-card-hover card-hover flex flex-col"
      onMouseEnter={handleCardView}
    >
      {/* Image */}
      <div className="aspect-video relative overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {course.isFree && (
            <Badge className="badge-free border text-xs font-semibold">
              Бесплатно
            </Badge>
          )}
          {course.hasDiscount && (
            <Badge className="badge-sale border text-xs font-semibold">
              Скидка
            </Badge>
          )}
          {course.hasCertificate && (
            <Badge className="badge-cert border text-xs font-semibold">
              Сертификат
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-base md:text-lg font-semibold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* School */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={course.school.logo}
            alt={course.school.name}
            className="h-5 object-contain"
          />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 star-rating fill-current" />
            <span className="font-semibold text-foreground">{course.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({course.reviewsCount.toLocaleString("ru-RU")} отзывов)
          </span>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs text-muted-foreground">
          <span className="px-2 py-1 bg-secondary rounded-md">{course.duration}</span>
          <span className="px-2 py-1 bg-secondary rounded-md">
            {course.level === "beginner" && "Начальный"}
            {course.level === "intermediate" && "Средний"}
            {course.level === "advanced" && "Продвинутый"}
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-1">
            {course.isFree ? (
              <span className="text-xl font-bold text-success">Бесплатно</span>
            ) : (
              <>
                <span className="text-xl font-bold text-foreground">
                  {formatPrice(course.price)}
                </span>
                {course.oldPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(course.oldPrice)}
                  </span>
                )}
              </>
            )}
          </div>
          {course.installment && (
            <p className="text-sm text-muted-foreground mb-4">
              Рассрочка от {formatPrice(course.installment)}/мес
            </p>
          )}

          {/* Promo Code */}
          {course.promoCode?.code && (
            <div className="flex flex-col gap-1 mb-3 p-2 bg-success/10 rounded-lg border border-success/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-success">
                  {course.promoCode.discountText} ({course.promoCode.discountPercent}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Промокод:</span>
                <code className="flex-1 text-sm font-bold text-success truncate">
                  "{course.promoCode.code}"
                </code>
                <button
                  onClick={handleCopyPromo}
                  className="p-1.5 hover:bg-success/20 rounded-md transition-colors"
                  title="Скопировать промокод"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4 text-success" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* CTA */}
          <Button 
            onClick={handleClick}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          >
            Перейти
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </article>
  );
};
