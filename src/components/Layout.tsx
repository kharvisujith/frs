import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  Menu,
  X,
  Package,
  Globe,
  Phone,
  Info,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const navItems = [
  { label: 'Home', path: '/', icon: Globe },
  { label: 'Products', path: '/products', icon: Package },
  { label: 'About', path: '/about', icon: Info },
  { label: 'Contact', path: '/contact', icon: Phone }
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-t-2 border-t-primary/10 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/10 bg-white">
              <img
                src="/logo.jpg"
                alt="FRS Logo"
                className="w-full h-full object-contain scale-110"
              />
            </div>
            <div className="leading-tight">
              <span className="font-display text-lg font-bold text-foreground tracking-tight">
                FRS
              </span>
              <span className="block text-[10px] text-muted-foreground font-medium tracking-widest uppercase">
                Future Resilience Services
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-card">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium border-b transition-colors ${location.pathname === item.path
                  ? 'bg-primary/5 text-primary'
                  : 'text-foreground hover:bg-muted'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* WhatsApp Float */}
      <WhatsAppFloat />

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
                  <img src="/logo.jpg" alt="FRS Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-display text-lg font-bold">
                  FRS
                </span>
              </div>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                Future Resilience Services Ltd. Your trusted partner in humanitarian supply chain management.
                Providing quality emergency relief materials worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">
                Quick Links
              </h4>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">
                Contact
              </h4>
              <div className="text-sm text-primary-foreground/70 space-y-1">
                <p>frsljuba@gmail.com</p>
                <p>0926458778 / 0982839999</p>
                <p>Mahatta yei, facebook road, JUBA, SOUTH SUDAN</p>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} Future Resilience Services Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
