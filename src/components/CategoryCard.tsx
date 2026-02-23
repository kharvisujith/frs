import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Pencil } from "lucide-react";
import type { Category } from "@/models";
import EditCategoryDialog from "@/components/EditCategoryDialog";

interface CategoryCardProps {
  category: Category;
  isAdmin?: boolean;
  onUpdated?: () => void;
}

export default function CategoryCard({ category, isAdmin, onUpdated }: CategoryCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
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

        {/* Admin Edit Button */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditOpen(true);
            }}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-primary shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
            title="Edit Category"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-display text-lg font-bold text-white mb-1.5 capitalize">{category.name}</h3>
          <p className="text-white/90 text-sm line-clamp-2 mb-2 h-10">{category.description}</p>
          <span className="inline-flex items-center gap-1 text-accent text-sm font-semibold group-hover:gap-2 transition-all">
            Explore <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>

      {/* Edit Dialog */}
      {isAdmin && (
        <EditCategoryDialog
          category={category}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSuccess={() => onUpdated?.()}
        />
      )}
    </>
  );
}
