import { schools } from "@/data/mockData";

export const SchoolsSection = () => {
  return (
    <section className="py-12 md:py-16 bg-secondary/30">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Школы-партнёры
        </h2>
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-6 md:gap-8 min-w-max">
            {schools.map((school) => (
              <a
                key={school.id}
                href={`/school/${school.slug}`}
                className="flex-shrink-0 group"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Analytics: click_school", { school: school.slug });
                }}
              >
                <div className="h-16 md:h-20 px-6 bg-card rounded-xl border border-border flex items-center justify-center hover:border-primary/30 hover:shadow-card card-hover">
                  <img
                    src={school.logo}
                    alt={school.name}
                    className="h-8 md:h-10 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
