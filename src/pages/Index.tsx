import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Globe, Truck, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryCard from '@/components/CategoryCard';
import heroImage from '@/assets/hero-humanitarian.jpg';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getCategories } from '@/services';
import type { Category } from '@/models';

const stats = [
  { icon: Globe, label: 'Countries Served', value: '40+' },
  { icon: Truck, label: 'Deliveries Completed', value: '5,000+' },
  { icon: Shield, label: 'Years Experience', value: '15+' },
  { icon: HeartHandshake, label: 'Partners Worldwide', value: '200+' }
];


export default function Index() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center">
        <img
          src={heroImage}
          alt="Humanitarian supply warehouse"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-transparent" />
        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="inline-block bg-accent text-accent-foreground text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
              Humanitarian Supply Partner
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-card mb-6 leading-tight">
              Reliable Supply Solutions for{' '}
              <span className="text-accent">Humanitarian</span> Operations
            </h1>
            <p className="text-card/80 text-lg md:text-xl mb-8 leading-relaxed">
              Providing quality emergency shelter materials, non-food items, and
              essential supplies to relief organizations and development
              programs worldwide.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-sm"
              >
                <Link to="/products">
                  View Our Products <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-card/30 text-card hover:bg-card/10 font-semibold text-sm text-black"
              >
                <Link to="/about">Learn About Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="text-2xl md:text-3xl font-bold">{s.value}</div>
                <div className="text-xs text-primary-foreground/60 uppercase tracking-wider mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-widest">
              Our Catalog
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              Product Categories
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Explore our comprehensive range of humanitarian supply categories
              designed to meet emergency and development needs.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <CategoryCard key={cat.slug} category={cat} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-humanitarian-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Need Humanitarian Supplies?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Contact our team to discuss your supply requirements. We support
            relief organizations, NGOs, and development programs globally.
          </p>
          <Button asChild size="lg" className="font-semibold">
            <Link to="/contact">
              Get in Touch <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
