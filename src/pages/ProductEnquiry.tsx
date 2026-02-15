import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, Package } from 'lucide-react';
import { getProductById, saveProductEnquiry } from '@/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/models';

export default function ProductEnquiry() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    quantity: '',
    description: ''
  });

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
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">
          Product Not Found
        </h1>
        <Button asChild>
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await saveProductEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        organization: form.organization,
        productId: product.id,
        estimatedQuantity: form.quantity,
        projectDescription: form.description
      });

      toast({
        title: 'Enquiry Submitted Successfully!',
        description: `Thank you for your enquiry about ${product.name}. We'll contact you within 24 hours.`,
        className: 'bg-green-50 border-green-200 text-green-900'
      });

      // Clear form
      setForm({
        name: '',
        email: '',
        phone: '',
        organization: '',
        quantity: '',
        description: ''
      });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your enquiry. Please try again or contact us directly.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <Link
          to={`/product/${id}`}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Product Details
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Product Summary */}
          <div className="bg-card border rounded-xl p-6 mb-8">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted border flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-primary" />
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    Product Enquiry: {product.name}
                  </h1>
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  Category: {product.categoryName}
                </p>
                <p className="text-muted-foreground text-sm">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="bg-card border rounded-xl p-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Submit Your Enquiry
            </h2>
            <p className="text-muted-foreground mb-6">
              Please provide your details and requirements. Our team will
              respond within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Full Name *
                  </label>
                  <Input
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="your.email@organization.org"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Phone Number (Optional)
                  </label>
                  <Input
                    type="tel"
                    placeholder="+211 XXX XXX XXX"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Organization (Optional)
                  </label>
                  <Input
                    placeholder="Your organization name"
                    value={form.organization}
                    onChange={(e) =>
                      setForm({ ...form, organization: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Estimated Quantity (Optional)
                  </label>
                  <Input
                    placeholder="e.g., 100 units, 10 pallets"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: e.target.value })
                    }
                  />
                </div>
                <div></div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Project Description & Requirements *
                </label>
                <Textarea
                  placeholder="Please describe your project, specific requirements, delivery location, timeline, and any other relevant details..."
                  rows={6}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                />
              </div>

              {/* <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold text-foreground text-sm mb-2">
                  What happens next?
                </h3>
                <ul className="text-muted-foreground text-sm space-y-1">
                  <li>• Our logistics team will review your requirements</li>
                  <li>• We'll send you a detailed quotation within 24 hours</li>
                  <li>• Technical specifications and delivery options will be included</li>
                  <li>• A dedicated account manager will be assigned to your project</li>
                </ul>
              </div> */}

              <Button type="submit" className="w-full font-semibold" disabled={submitting}>
                <Send className="w-4 h-4 mr-2" />
                {submitting ? 'Submitting...' : 'Submit Enquiry'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
