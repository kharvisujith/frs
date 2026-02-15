import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/models';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <Badge variant="secondary" className="mb-2 text-xs">
          {product.category}
        </Badge>
        <h3 className="font-display text-lg font-bold text-foreground mb-1">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {product.description}
        </p>
        <div
          // to={`/product/${product.id}`}
          className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 group-hover:gap-2.5 transition-all"
        >
          View Details <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
