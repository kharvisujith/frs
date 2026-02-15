import { Shield, Eye, Target, Users, Globe, Award } from "lucide-react";

const values = [
  { icon: Shield, title: "Reliability", description: "We deliver quality supplies on time, every time. Our logistics network ensures rapid response to emergency needs." },
  { icon: Eye, title: "Transparency", description: "Full traceability and accountability in every transaction. We maintain the highest standards of operational integrity." },
  { icon: Target, title: "Quality Assurance", description: "All products meet international humanitarian standards. Rigorous quality control ensures consistency and compliance." },
  { icon: Users, title: "Partnership", description: "We work closely with organizations, governments, and communities to deliver solutions that make a difference." },
  { icon: Globe, title: "Global Reach", description: "Operating across 40+ countries with strategic warehousing and distribution capabilities worldwide." },
  { icon: Award, title: "Experience", description: "Over 15 years of specialized experience in humanitarian supply chain management and emergency response." },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">About Us</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4">Future Resilience Services Ltd</h1>
          <p className="text-primary-foreground/70 max-w-3xl mx-auto text-lg leading-relaxed">
            A partnership company established in South Sudan dedicated to providing premier disaster management solutions.
            Strategic precautionary methods and robust preparedness are vital to mitigating the impact of extreme events.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="bg-card border rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To fight against disasters and manage their after-effects through a deep understanding of South Sudan's unique geographical conditions and environmental shifts, ensuring strategies are tailored to the local context.
              </p>
            </div>
            <div className="bg-card border rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-accent-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                Beyond immediate relief, we are committed to continuous research to improve disaster services nationwide and fostering long-term self-sufficiency through community education and industrial development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 bg-humanitarian-light">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-foreground mb-10 text-center">Our Core Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4 pt-4 border-t-2 border-primary/20">
              <h3 className="font-bold text-xl text-primary">Disaster Management</h3>
              <p className="text-sm text-muted-foreground">Mobilizing rapid-response teams and volunteer coordination to save lives during unforeseen events.</p>
            </div>
            <div className="space-y-4 pt-4 border-t-2 border-primary/20">
              <h3 className="font-bold text-xl text-primary">Construction & Materials</h3>
              <p className="text-sm text-muted-foreground">Comprehensive supply chain for construction-related items and essential goods for infrastructure and vocational training.</p>
            </div>
            <div className="space-y-4 pt-4 border-t-2 border-primary/20">
              <h3 className="font-bold text-xl text-primary">Relief Item Procurement</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                <li>Mosquito Nets (LLIN) WHOPES approved</li>
                <li>Blankets and Sleeping Mats</li>
                <li>Kitchen Sets and Tarpaulins</li>
                <li>Jerry Cans (All Types)</li>
                <li>Reusable Sanitary Pads & Hygiene Kits</li>
                <li>Water Chemicals & Agri Tools</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-12">Our Strengths</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow">
                <v.icon className="w-8 h-8 text-primary mb-3 mx-auto" />
                <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">Connect With Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            For disaster management solutions, relief procurement, or partnership inquiries, please contact our Juba headquarters.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-card border rounded-xl p-6">
              <h4 className="font-bold text-primary mb-2">Address</h4>
              <p className="text-sm text-muted-foreground">
                Mahatta yei, facebook road<br />
                JUBA, SOUTH SUDAN
              </p>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <h4 className="font-bold text-primary mb-2">Phone</h4>
              <p className="text-sm text-muted-foreground">
                0926458778 / 0982839999
              </p>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <h4 className="font-bold text-primary mb-2">Email</h4>
              <p className="text-sm text-muted-foreground">
                frsljuba@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
