import { blogPosts } from "@/data/mockData";
import { BlogCard } from "./BlogCard";
import { ArrowRight } from "lucide-react";

export const BlogSection = () => {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Полезные статьи
          </h2>
          <a
            href="/blog"
            className="hidden md:inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Все статьи
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        <a
          href="/blog"
          className="mt-6 md:hidden inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          Все статьи
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};
