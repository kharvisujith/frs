import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { saveContactEnquiry } from '@/services';

export default function Contact() {
  // const { toast } = useToast(); // Removed legacy hook
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await saveContactEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone || '',
        message: form.message
      });

      toast.success('Message Sent Successfully!', {
        description: "Thank you for contacting us. We'll respond shortly."
      });

      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Submission Failed', {
        description: 'There was an error sending your message. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            Contact Us
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4">
            Get In Touch
          </h1>
          <p className="text-primary-foreground/70 max-w-xl mx-auto text-lg">
            Have questions about our humanitarian supply capabilities? We'd love
            to hear from you.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <div className="bg-card border rounded-xl p-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Send us a message
              </h2>
              <p className="text-muted-foreground mb-6">
                Fill out the form below and our logistics experts will contact
                you shortly.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="email@organization.org"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
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
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="Tell us about your requirements..."
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full font-semibold" disabled={submitting}>
                  <Send className="w-4 h-4 mr-2" /> {submitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Contact Information
                </h2>
              </div>

              {/* Headquarters */}
              <div className="flex gap-4 items-start bg-card border rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    Headquarters
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Mahatta yei, facebook road
                    <br />
                    JUBA, SOUTH SUDAN
                  </p>
                </div>
              </div>

              {/* Phone Support */}
              <div className="flex gap-4 items-start bg-card border rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    Phone Support
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    0926458778
                    <br />
                    0982839999
                  </p>
                </div>
              </div>

              {/* Email Address */}
              <div className="flex gap-4 items-start bg-card border rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    Email Address
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    fsrl@frsl.net
                  </p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex gap-4 items-start bg-card border rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    Operating Hours
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Mon - Fri: 08:00 - 18:00 (CET)
                    <br />
                    Sat - Sun: Emergency Support Only
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="bg-card border rounded-xl overflow-hidden">
            <div className="relative h-96 bg-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.5760862523143!2d31.5563680768587!3d4.8426089951329905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x171281805e8079a9%3A0x75466ab866377061!2sHass%20Yei%20Road!5e0!3m2!1sen!2sin!4v1770966560330!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Juba Head Office Location"
                className="absolute inset-0"
              />
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
                <h4 className="font-semibold text-sm text-gray-900 mb-1">
                  Juba Head Office
                </h4>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Hass+Yei+Road+Juba+South+Sudan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Open in Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
