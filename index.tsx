import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  ArrowDown,
  Instagram,
  Facebook
} from 'lucide-react';
import './index.css';

/* ═══════════════════════════════
   SCROLL REVEAL HOOK
   ═══════════════════════════════ */
const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    el.querySelectorAll('.reveal').forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return ref;
};

/* ═══════════════════════════════
   NAVBAR
   ═══════════════════════════════ */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <a href="#" className="nav__brand">Kropp &amp; Form</a>
        <ul className="nav__links">
          <li><a href="#services" className="nav__link">Behandlingar</a></li>
          <li><a href="#about" className="nav__link">Om Oss</a></li>
          <li><a href="#contact" className="nav__link">Kontakt</a></li>
        </ul>
        <a href="#contact" className="btn btn--primary">Boka Tid</a>
      </div>
    </nav>
  );
};

/* ═══════════════════════════════
   HERO
   ═══════════════════════════════ */
const Hero = () => (
  <section className="hero">
    <div className="hero__bg" />
    <div className="hero__vignette" />
    <div className="hero__gradient" />

    <div className="container hero__content">
      <span className="label hero__eyebrow">Massage · Wellness · Friskvård</span>
      <h1 className="display hero__title">
        Boka din tid<br /><em>redan idag</em>
      </h1>
      <p className="hero__subtitle">
        Professionell massage och friskvård i hjärtat av Tyringe.
        Låt oss hjälpa dig att hitta balans, återhämtning och välmående.
      </p>
      <div className="hero__actions">
        <a href="#contact" className="btn btn--primary">Boka Tid</a>
        <a href="#services" className="btn btn--ghost">Våra Behandlingar</a>
      </div>
    </div>

    <div className="hero__vertical">Tyringe · Sweden</div>

    <div className="hero__scroll">
      <span>Scroll</span>
      <ArrowDown size={14} />
    </div>
  </section>
);

/* ═══════════════════════════════
   PHILOSOPHY
   ═══════════════════════════════ */
const Philosophy = () => (
  <section className="philosophy reveal" id="about">
    <div className="container">
      <div className="philosophy__divider" />
      <blockquote className="philosophy__quote">
        Vi skapar en plats för avslappning, återhämtning och harmoni —
        där kropp och sinne finner balans.
      </blockquote>
      <p className="philosophy__credit">Kropp &amp; Form, Tyringe</p>
    </div>
  </section>
);

/* ═══════════════════════════════
   SERVICE ITEM
   ═══════════════════════════════ */
interface ServiceItemProps {
  title: string;
  time: string;
  price: string;
  desc: string;
  img: string;
  reversed?: boolean;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ title, time, price, desc, img, reversed }) => (
  <div className={`service reveal ${reversed ? 'service--reversed' : ''}`}>
    <div className="service__image-wrap">
      <img src={img} alt={title} className="service__image" loading="lazy" />
    </div>
    <div className="service__content">
      <span className="label">{time}</span>
      <h3 className="heading service__title">{title}</h3>
      <p className="service__desc">{desc}</p>
      <div className="service__footer">
        <span className="service__price">{price}</span>
        <a href="#contact" className="service__cta">
          Boka nu <ArrowRight size={14} />
        </a>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════
   SERVICES SECTION
   ═══════════════════════════════ */
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

const Services = () => (
  <section className="services" id="services">
    <div className="container">
      <div className="services__header reveal">
        <span className="label">Våra Behandlingar</span>
        <h2 className="heading">Professionell friskvård &amp; massage</h2>
        <div className="services__divider" />
      </div>
      <div className="services__list">
        {treatments.map((t, i) => (
          <ServiceItem key={i} {...t} reversed={i % 2 === 1} />
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════
   INFO SECTION
   ═══════════════════════════════ */
const InfoSection = () => (
  <section className="info reveal" id="contact">
    <div className="container">
      <div className="info__grid">
        <div className="info__item">
          <div className="info__icon-row">
            <MapPin size={18} strokeWidth={1.5} className="info__icon" />
            <span className="label">Besök oss</span>
          </div>
          <p className="info__text">Brännerigatan 4<br />282 34 Tyringe</p>
        </div>

        <div className="info__item">
          <div className="info__icon-row">
            <Phone size={18} strokeWidth={1.5} className="info__icon" />
            <span className="label">Kontakt</span>
          </div>
          <p className="info__text">
            <a href="tel:0768458040">076-845 80 40</a>
          </p>
          <p className="info__text">
            <a href="mailto:info@kroppochform.se">info@kroppochform.se</a>
          </p>
        </div>

        <div className="info__item">
          <div className="info__icon-row">
            <Clock size={18} strokeWidth={1.5} className="info__icon" />
            <span className="label">Öppettider</span>
          </div>
          <div className="info__text">
            <div className="info__hours-row">
              <span className="info__hours-day">Mån, Ons, Fre</span>
              <span className="info__hours-time">10–19</span>
            </div>
            <div className="info__hours-row">
              <span className="info__hours-day">Tis, Tors</span>
              <span className="info__hours-time">09–19</span>
            </div>
            <div className="info__hours-row">
              <span className="info__hours-day">Lördag</span>
              <span className="info__hours-time">11–14</span>
            </div>
            <div className="info__hours-row">
              <span className="info__hours-day">Söndag</span>
              <span className="info__hours-closed">Stängt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════
   FOOTER
   ═══════════════════════════════ */
const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer__top">
        <span className="footer__brand">Kropp &amp; Form</span>
        <p className="footer__tagline">
          Professionell massage och friskvård i Tyringe.
          Vi hjälper dig att hitta balans och välmående.
        </p>
      </div>
      <div className="footer__links">
        <a href="#services" className="footer__link">Behandlingar</a>
        <a href="#about" className="footer__link">Om Oss</a>
        <a href="#contact" className="footer__link">Kontakt</a>
      </div>
      <div className="footer__social">
        <a href="#" className="footer__social-link" aria-label="Instagram">
          <Instagram size={18} />
        </a>
        <a href="#" className="footer__social-link" aria-label="Facebook">
          <Facebook size={18} />
        </a>
      </div>
      <div className="footer__bottom">
        <p className="footer__copy">© 2026 Kropp &amp; Form, Tyringe. Alla rättigheter förbehållna.</p>
      </div>
    </div>
  </footer>
);

/* ═══════════════════════════════
   APP ROOT
   ═══════════════════════════════ */
const App = () => {
  const appRef = useScrollReveal();

  return (
    <div ref={appRef}>
      <Navbar />
      <Hero />
      <Philosophy />
      <Services />
      <InfoSection />
      <Footer />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);