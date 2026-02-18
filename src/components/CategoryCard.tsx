import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/models";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative overflow-hidden rounded-xl bg-card border shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-display text-lg font-bold text-white mb-1.5 capitalize">{category.name}</h3>
        <p className="text-white/90 text-sm line-clamp-2 mb-2 h-10">{category.description}</p>
        <span className="inline-flex items-center gap-1 text-accent text-sm font-semibold group-hover:gap-2 transition-all">
          Explore <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
