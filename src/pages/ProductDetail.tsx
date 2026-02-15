import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Tag, Mail } from "lucide-react";
import { getProductById } from '@/services';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/models";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const data = await getProductById(id);
        setProduct(data || null);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
        <Button asChild><Link to="/products">Back to Products</Link></Button>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <Link to={`/category/${product.categorySlug}`} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to {product.categoryName}
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="rounded-xl overflow-hidden bg-muted border">
            <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
          </div>

          {/* Info */}
          <div>
            <Badge variant="secondary" className="mb-3"><Tag className="w-3 h-3 mr-1" /> {product.categoryName}</Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{product.name}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">{product.description}</p>

            {/* Enquire Button */}
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-3">Interested in this product?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Get a detailed quotation and technical specifications for your project requirements.
              </p>
              <Button asChild className="w-full font-semibold">
                <Link to={`/product/${id}/enquiry`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Make an Enquiry
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
