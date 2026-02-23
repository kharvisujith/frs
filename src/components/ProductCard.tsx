import { useState } from 'react';
import { ArrowRight, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/models';
import { useNavigate } from 'react-router-dom';
import EditProductDialog from '@/components/EditProductDialog';

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  onUpdated?: () => void;
}

export default function ProductCard({ product, isAdmin, onUpdated }: ProductCardProps) {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="group relative bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      >
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* Admin Edit Button */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditOpen(true);
            }}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-primary shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
            title="Edit Product"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}

        <div className="p-4">
          <Badge variant="secondary" className="mb-2 text-xs">
            {product.categoryName}
          </Badge>
          <h3 className="font-display text-lg font-bold text-foreground mb-1">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {product.description}
          </p>
          <div
            className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 group-hover:gap-2.5 transition-all"
          >
            View Details <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      {isAdmin && (
        <EditProductDialog
          product={product}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSuccess={() => onUpdated?.()}
        />
      )}
    </>
  );
}
