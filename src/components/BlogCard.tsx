import { BlogPost, formatDate } from "@/data/mockData";

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <a
      href={`/blog/${post.slug}`}
      className="group block bg-card rounded-xl border border-border overflow-hidden hover:shadow-card-hover card-hover"
      onClick={(e) => {
        e.preventDefault();
        console.log("Analytics: click_blog_post", { slug: post.slug });
      }}
    >
      <div className="aspect-[3/2] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 md:p-5">
        <time className="text-xs text-muted-foreground">{formatDate(post.date)}</time>
        <h3 className="text-lg font-semibold text-foreground mt-2 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
      </div>
    </a>
  );
};
