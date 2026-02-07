import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Instagram, 
  Facebook, 
  ArrowRight, 
  Clock,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

/* ════════════════════════════════════════════
   NAVBAR
   ════════════════════════════════════════════ */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? 'py-3 glass-header' : 'py-6 bg-transparent'}`}>
      <div className="container mx-auto px-6 md:px-16 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center">
            <span className="text-[10px] font-semibold text-white tracking-wide">KF</span>
          </div>
          <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-white/90 hidden md:block">
            Kropp & Form
          </span>
        </div>
        
        {/* Navigation Links */}
        <div className="hidden lg:flex gap-10 text-[10px] tracking-[0.2em] uppercase font-medium text-white/60">
          <a href="#services" className="hover:text-white transition-colors duration-300">Behandlingar</a>
          <a href="#about" className="hover:text-white transition-colors duration-300">Om Oss</a>
          <a href="#contact" className="hover:text-white transition-colors duration-300">Kontakt</a>
        </div>

        {/* CTA */}
        <button className="btn-primary uppercase">
          BOKA TID
        </button>
      </div>
    </nav>
  );
};

/* ════════════════════════════════════════════
   HERO
   ════════════════════════════════════════════ */
const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-0 parallax-bg z-0 scale-105"></div>
      <div className="absolute inset-0 hero-overlay z-[1]"></div>
      
      {/* Soft fade to next section */}
      <div className="hero-fade-bottom"></div>

      <div className="container mx-auto px-6 md:px-16 lg:px-24 relative z-10 grid lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Content */}
        <div className="lg:col-span-7 pt-16 animate-fade">
          {/* Eyebrow */}
          <p className="label-sans mb-8 text-white/60">
            Massage · Wellness · Friskvård
          </p>

          {/* Main Headline — Serif, elegant, not shouting */}
          <h1 className="heading-serif text-5xl md:text-7xl lg:text-[82px] text-white mb-8">
            Boka din tid<br />
            <span className="text-teal" style={{ fontWeight: 500 }}>redan idag</span>
          </h1>

          {/* Supporting text */}
          <p className="text-[16px] font-light text-white/60 max-w-md leading-relaxed mb-12">
            Professionell massage och friskvård i hjärtat av Tyringe. 
            Låt oss hjälpa dig att hitta balans, återhämtning och välmående.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-wrap gap-4 items-center">
            <button className="btn-primary uppercase">
              BOKA TID
            </button>
            <button className="btn-outline uppercase">
              VÅRA BEHANDLINGAR
            </button>
          </div>
        </div>

        {/* Right Content — Floating Sticker Logo */}
        <div className="lg:col-span-5 hidden lg:flex justify-center items-center">
          <div className="sticker-container animate-fade-delay">
            <div className="sticker-glow"></div>
            <div className="sticker-logo">
              <div className="sticker-inner">
                <span className="sticker-kf">KF</span>
                <h2 className="sticker-main">Kropp & Form</h2>
                <div className="divider-accent my-2"></div>
                <span className="sticker-sub">Massage · Wellness</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════
   INFO SECTION — Contact + Opening Hours
   ════════════════════════════════════════════ */
const InfoSection = () => (
  <section className="py-20 md:py-28" style={{ background: 'var(--bg-warm)' }}>
    <div className="container mx-auto px-6 md:px-16">
      <div className="grid md:grid-cols-3 gap-12 md:gap-16 max-w-5xl mx-auto">
        
        {/* Address */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-5">
            <MapPin size={18} className="text-teal" strokeWidth={1.5} />
            <span className="label-sans">Besök oss</span>
          </div>
          <p className="text-[15px] text-gray-600 font-light leading-relaxed">
            Brännerigatan 4<br />
            282 34 Tyringe
          </p>
        </div>

        {/* Contact */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-5">
            <Phone size={18} className="text-teal" strokeWidth={1.5} />
            <span className="label-sans">Kontakt</span>
          </div>
          <p className="text-[15px] text-gray-600 font-light leading-relaxed mb-1">
            <a href="tel:0768458040" className="hover:text-teal transition-colors">076-845 80 40</a>
          </p>
          <p className="text-[15px] font-light leading-relaxed">
            <a href="mailto:info@kroppochform.se" className="text-teal hover:underline transition-colors">info@kroppochform.se</a>
          </p>
        </div>

        {/* Opening Hours */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-5">
            <Clock size={18} className="text-teal" strokeWidth={1.5} />
            <span className="label-sans">Öppettider</span>
          </div>
          <div className="text-[15px] text-gray-600 font-light leading-relaxed space-y-1">
            <div className="flex justify-between max-w-[220px] mx-auto md:mx-0">
              <span>Mån, Ons, Fre</span>
              <span className="text-gray-800 font-normal">10–19</span>
            </div>
            <div className="flex justify-between max-w-[220px] mx-auto md:mx-0">
              <span>Tis, Tors</span>
              <span className="text-gray-800 font-normal">09–19</span>
            </div>
            <div className="flex justify-between max-w-[220px] mx-auto md:mx-0">
              <span>Lördag</span>
              <span className="text-gray-800 font-normal">11–14</span>
            </div>
            <div className="flex justify-between max-w-[220px] mx-auto md:mx-0 text-gray-400">
              <span>Söndag</span>
              <span className="italic">Stängt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ════════════════════════════════════════════
   SERVICE CARD
   ════════════════════════════════════════════ */
const ServiceCard: React.FC<{ 
  title: string; 
  time: string; 
  price: string; 
  desc: string; 
  img: string; 
}> = ({ title, time, price, desc, img }) => (
  <div className="service-card bg-white p-8 lg:p-10 rounded-xl border border-gray-100/80 group cursor-pointer">
    {/* Image */}
    <div className="aspect-[16/11] overflow-hidden mb-8 rounded-lg">
      <img 
        src={img} 
        alt={title} 
        className="w-full h-full object-cover grayscale-[60%] group-hover:grayscale-0 transition-all duration-1000 ease-out group-hover:scale-105" 
      />
    </div>

    {/* Title + Price */}
    <div className="flex justify-between items-baseline mb-3">
      <h3 className="heading-serif text-[22px]" style={{ fontWeight: 500 }}>{title}</h3>
      <span className="text-[13px] font-semibold text-teal tracking-wide">{price}</span>
    </div>

    {/* Duration */}
    <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em] mb-6">
      <Clock size={13} strokeWidth={2} /> {time}
    </div>

    {/* Description */}
    <p className="text-[14px] text-gray-500 font-light leading-relaxed mb-8 min-h-[84px]">
      {desc}
    </p>

    {/* CTA */}
    <button className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.15em] text-gray-800 group-hover:text-teal transition-all duration-500 uppercase">
      Boka nu <ArrowRight size={15} className="group-hover:translate-x-2 transition-transform duration-500" />
    </button>
  </div>
);

/* ════════════════════════════════════════════
   SERVICES SECTION
   ════════════════════════════════════════════ */
const Services = () => {
  const treatments = [
    { 
      title: "Klassisk Massage", 
      time: "25 min", 
      price: "500 kr", 
      desc: "En djupgående behandling anpassad för rygg, skulderblad och nacke. Fokuserar på spänningshuvudvärk och muskulär trötthet.",
      img: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1974" 
    },
    { 
      title: "Massagebehandling", 
      time: "40 min", 
      price: "650 kr", 
      desc: "En fokuserad behandling som utförs utifrån dina individuella behov. Perfekt för specifika problemområden.",
      img: "https://images.unsplash.com/photo-1610492421943-47e06899753c?q=80&w=2070" 
    },
    { 
      title: "Helkroppsmassage", 
      time: "60 min", 
      price: "750 kr", 
      desc: "Den ultimata återhämtningen för hela kroppen. Löser upp spänningar från topp till tå och ger ny energi.",
      img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070" 
    },
    { 
      title: "Hot Stone Massage", 
      time: "60 min", 
      price: "795 kr", 
      desc: "Värmande massage med lena lavastenar och essentiella oljor. Ger en djupare avslappning för både kropp och själ.",
      img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070" 
    }
  ];

  return (
    <section id="services" className="py-28 md:py-36" style={{ background: 'var(--bg-light)' }}>
      <div className="container mx-auto px-6 md:px-16">
        {/* Section Header */}
        <div className="mb-20 text-center max-w-2xl mx-auto">
          <p className="label-sans mb-6">Våra Behandlingar</p>
          <h2 className="heading-serif text-4xl md:text-5xl lg:text-[56px] mb-6">
            Professionell friskvård<br />& massage
          </h2>
          <div className="divider-accent mx-auto"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {treatments.map((t, i) => <ServiceCard key={i} {...t} />)}
        </div>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════ */
const Footer = () => (
  <footer id="contact" className="py-20 bg-white border-t border-gray-100">
    <div className="container mx-auto px-6 md:px-16">
      {/* Top */}
      <div className="flex flex-col items-center text-center mb-14">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full border-2 border-teal/30 flex items-center justify-center">
            <span className="text-[11px] font-semibold text-teal">KF</span>
          </div>
          <span className="heading-serif text-[22px]">Kropp & Form</span>
        </div>
        <p className="text-[14px] text-gray-400 font-light max-w-sm leading-relaxed">
          Professionell massage och friskvård i Tyringe. 
          Vi hjälper dig att hitta balans och välmående.
        </p>
      </div>

      {/* Links */}
      <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 mb-14">
        <a href="#services" className="text-[11px] font-medium tracking-[0.2em] uppercase text-gray-400 hover:text-teal transition-colors duration-300">Behandlingar</a>
        <a href="#about" className="text-[11px] font-medium tracking-[0.2em] uppercase text-gray-400 hover:text-teal transition-colors duration-300">Om Oss</a>
        <a href="#contact" className="text-[11px] font-medium tracking-[0.2em] uppercase text-gray-400 hover:text-teal transition-colors duration-300">Kontakt</a>
      </div>

      {/* Social */}
      <div className="flex justify-center gap-6 mb-14">
        <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal hover:border-teal/30 transition-all duration-300">
          <Instagram size={18} />
        </a>
        <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal hover:border-teal/30 transition-all duration-300">
          <Facebook size={18} />
        </a>
      </div>

      {/* Bottom divider + copyright */}
      <div className="border-t border-gray-100 pt-8 text-center">
        <p className="text-[11px] font-light tracking-[0.15em] text-gray-300">
          © 2026 Kropp & Form, Tyringe. Alla rättigheter förbehållna.
        </p>
      </div>
    </div>
  </footer>
);

/* ════════════════════════════════════════════
   APP ROOT
   ════════════════════════════════════════════ */
const App = () => {
  return (
    <div className="min-h-screen selection:bg-teal selection:text-white">
      <Navbar />
      <Hero />
      <InfoSection />
      <Services />
      <Footer />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);