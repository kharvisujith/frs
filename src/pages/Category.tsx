import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { getCategoryBySlug, getProductsByCategory } from '@/services';
import ProductCard from "@/components/ProductCard";
import EditCategoryDialog from "@/components/EditCategoryDialog";
import { Button } from "@/components/ui/button";
import type { Category, Product } from "@/models";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const isAdmin = typeof window !== 'undefined' ? sessionStorage.getItem('isAdmin') === 'true' : false;

  const fetchData = async () => {
    if (!slug) return;
    try {
      const [categoryData, productsData] = await Promise.all([
        getCategoryBySlug(slug),
        getProductsByCategory(slug)
      ]);
      setCategory(categoryData || null);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Category Not Found</h1>
        <Button asChild><Link to="/products">Back to Products</Link></Button>
      </div>
    );
  }

  return (
    <>
      <section className="relative">
        <img src={category.image} alt={category.name} className="w-full h-64 md:h-80 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-foreground/30" />

        {/* Admin Edit Button */}
        {isAdmin && (
          <button
            onClick={() => setEditCategoryOpen(true)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white text-primary shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
            title="Edit Category"
          >
            <Pencil className="w-5 h-5" />
          </button>
        )}

        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <Link to="/products" className="inline-flex items-center gap-1 text-card/70 hover:text-card text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-card">{category.name}</h1>
          <p className="text-card/70 mt-2 max-w-2xl">{category.description}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground mb-8">{products.length} products in this category</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} isAdmin={isAdmin} onUpdated={fetchData} />
            ))}
          </div>
        </div>
      </section>

      {/* Edit Category Dialog */}
      {isAdmin && category && (
        <EditCategoryDialog
          category={category}
          open={editCategoryOpen}
          onOpenChange={setEditCategoryOpen}
          onSuccess={fetchData}
        />
      )}
    </>
  );
}
