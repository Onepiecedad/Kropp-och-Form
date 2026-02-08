import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  ArrowDown,
  Instagram,
  Facebook,
  Star,
  Send,
  Mail,
  User,
  MessageSquare,
  ChevronUp,
  Menu,
  X
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="container nav__inner">
          <a href="#" className="nav__brand" aria-label="Hem">Kropp &amp; Form</a>
          <ul className="nav__links">
            <li><a href="#services" className="nav__link">Behandlingar</a></li>
            <li><a href="#about" className="nav__link">Om Oss</a></li>
            <li><a href="#contact" className="nav__link">Kontakt</a></li>
          </ul>
          <a href="#contact" className="btn btn--primary nav__cta-desktop">Boka Tid</a>
          <button
            className="nav__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Stäng meny' : 'Öppna meny'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu__content">
          <a href="#services" className="mobile-menu__link" onClick={closeMenu}>Behandlingar</a>
          <a href="#about" className="mobile-menu__link" onClick={closeMenu}>Om Oss</a>
          <a href="#contact" className="mobile-menu__link" onClick={closeMenu}>Kontakt</a>
          <a href="#contact" className="btn btn--primary mobile-menu__cta" onClick={closeMenu}>Boka Tid</a>
        </div>
      </div>
    </>
  );
};

/* ═══════════════════════════════
   FLOATING 3D LOGO
   ═══════════════════════════════ */
const FloatingLogo = () => (
  <div className="logo3d">
    <div className="logo3d__glow" />
    <div className="logo3d__disc">
      <span className="logo3d__initials">KF</span>
      <span className="logo3d__script">Kropp &amp; Form</span>
      <span className="logo3d__tagline">Massage · Wellness</span>
    </div>
  </div>
);

/* ═══════════════════════════════
   HERO
   ═══════════════════════════════ */
const Hero = () => (
  <section className="hero">
    <div className="hero__bg" />
    <div className="hero__vignette" />
    <div className="hero__gradient" />

    <div className="hero__logo-area">
      <FloatingLogo />
    </div>

    <div className="container hero__content">
      <span className="label hero__eyebrow">Massage · Wellness · Friskvård</span>
      <h1 className="display hero__title">
        Upplev hur det känns<br /><em>att vara i fokus</em>
      </h1>
      <p className="hero__subtitle">
        Är det mycket stress? Eller känner du dig stel och har ont i musklerna?
        Besök oss i hjärtat av Tyringe för en professionell massageupplevelse
        som verkligen gör skillnad.
      </p>
      <div className="hero__actions">
        <a href="#contact" className="btn btn--primary">Boka Tid</a>
        <a href="#services" className="btn btn--ghost">Våra Behandlingar</a>
      </div>
    </div>

    <div className="hero__vertical">Tyringe · Sweden</div>


  </section>
);

/* ═══════════════════════════════
   PHILOSOPHY
   ═══════════════════════════════ */
const Philosophy = () => (
  <section className="philosophy reveal">
    <div className="container">
      <div className="philosophy__divider" />
      <blockquote className="philosophy__quote">
        Hos oss får du personlig massagebehandling som anpassas helt
        efter dina individuella önskemål och behov.
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
  alt: string;
  reversed?: boolean;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ title, time, price, desc, img, alt, reversed }) => (
  <div className={`service reveal ${reversed ? 'service--reversed' : ''}`}>
    <div className="service__image-wrap">
      <img src={img} alt={alt} className="service__image" loading="lazy" width="800" height="600" />
    </div>
    <div className="service__content">
      <span className="label">{time}</span>
      <h3 className="heading service__title">{title}</h3>
      <p className="service__desc">{desc}</p>
      <div className="service__footer">
        <span className="service__price">{price}</span>
        <a href="#contact" className="service__cta">
          Boka {title.toLowerCase()} <ArrowRight size={14} />
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
    desc: "En djupgående behandling anpassad för rygg, skulderblad och nacke. Perfekt för att lindra stress och muskelspänningar.",
    img: "/kroppochformmassage1.webp",
    alt: "Klassisk massage behandling på rygg och nacke i Tyringe"
  },
  {
    title: "Massagebehandling",
    time: "40 min",
    price: "650 kr",
    desc: "En djupgående behandling som utförs utifrån dina individuella önskemål och behov.",
    img: "/kroppochformmassage2.webp",
    alt: "Individuellt anpassad massagebehandling hos Kropp och Form"
  },
  {
    title: "Helkroppsmassage",
    time: "60 min",
    price: "750 kr",
    desc: "En djupgående behandling som är anpassad för hela kroppen. Den ultimata återhämtningen från topp till tå.",
    img: "/kroppochformmassage3.webp",
    alt: "Avslappnande helkroppsmassage från topp till tå"
  },
  {
    title: "Hot Stone Massage",
    time: "60 min",
    price: "795 kr",
    desc: "Med varma stenar och tända ljus får du en varm och avslappnande upplevelse. Ger en djupare avslappning för både kropp och själ.",
    img: "/kroppochformhotstone.webp",
    alt: "Hot Stone massage med varma stenar och levande ljus"
  },
  {
    title: "Taktilmassage",
    time: "60 min",
    price: "750 kr",
    desc: "En avslappnande helkroppsmassage med lugn musik och doftljus. Perfekt för mental återhämtning och total avslappning.",
    img: "/3d2aa42db0cd72496d903fe495721d2b.webp",
    alt: "Taktilmassage med lugn musik för mental återhämtning"
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
   PARALLAX INTERLUDE
   ═══════════════════════════════ */
const ParallaxInterlude = () => (
  <section className="parallax reveal">
    <div className="parallax__bg" />
    <div className="parallax__overlay" />
    <div className="parallax__content">
      <div className="parallax__accent" />
      <p className="parallax__quote">
        Att ta hand om din kropp är inte lyx —<br />
        det är en nödvändighet.
      </p>
      <span className="parallax__attribution">Kropp &amp; Form Filosofi</span>
    </div>
  </section>
);

/* ═══════════════════════════════
   BENEFITS SECTION
   ═══════════════════════════════ */
const benefits = [
  {
    title: "Främjar Allmänt Välbefinnande",
    desc: "Ökar känslan av välbefinnande och balans genom att främja avslappning och minska smärta."
  },
  {
    title: "Lindrar Huvudvärk & Migrän",
    desc: "Regelbunden massage kan minska frekvensen och intensiteten av spänningshuvudvärk och migrän."
  },
  {
    title: "Minskar Stress & Ångest",
    desc: "Främjar avslappning och kan minska nivåerna av stresshormoner som kortisol."
  },
  {
    title: "Förbättrar Hållningen",
    desc: "Genom att släppa på spänningar och stärka svaga muskler kan massage hjälpa till att förbättra kroppshållningen."
  },
  {
    title: "Ökar Rörlighet & Flexibilitet",
    desc: "Hjälper till att hålla musklerna smidiga och lederna flexibla, vilket kan förbättra den övergripande rörligheten."
  },
  {
    title: "Bättre Sömn & Återhämtning",
    desc: "Massage stimulerar det parasympatiska nervsystemet och hjälper kroppen att slappna av, vilket förbättrar sömnkvaliteten."
  }
];

const Benefits = () => (
  <section className="benefits reveal">
    <div className="container">
      <div className="benefits__header">
        <span className="label">Fördelar med massage</span>
        <h2 className="heading">Varför välja massage?</h2>
        <div className="services__divider" />
      </div>
      <div className="benefits__grid">
        {benefits.map((b, i) => (
          <div className="benefits__card reveal" key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
            <div className="benefits__star"><Star size={20} strokeWidth={1.5} /></div>
            <h3 className="benefits__title">{b.title}</h3>
            <p className="benefits__desc">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════
   TESTIMONIALS SECTION
   ═══════════════════════════════ */
const testimonials = [
  {
    text: "Väldigt nöjd kund jag har blivit idag. En massör med mycket kunskap och rådgivande ord. Har hittat min massör de närmaste tider. Tack och vi ses många gånger igen.",
    name: "Slavko M."
  },
  {
    text: "Grymt bra massör 👌 Är lyhörd och tar i vilket jag personligen tycker om.",
    name: "Melinda B."
  },
  {
    text: "Trevligt bemötande, riktigt bra massage.",
    name: "Rose-Marie S."
  }
];

const Testimonials = () => (
  <section className="testimonials reveal">
    <div className="container">
      <div className="testimonials__header">
        <span className="label">Kundnöjdhet</span>
        <h2 className="heading">Vad våra kunder säger</h2>
        <div className="services__divider" />
      </div>
      <div className="testimonials__grid">
        {testimonials.map((t, i) => (
          <div className="testimonials__card reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="testimonials__stars">
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={14} fill="rgba(138,175,197,0.8)" stroke="none" />
              ))}
            </div>
            <p className="testimonials__text">"{t.text}"</p>
            <span className="testimonials__name">— {t.name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════
   ABOUT / OM OSS SECTION
   ═══════════════════════════════ */
const About = () => (
  <section className="about reveal" id="about">
    <div className="container">
      <div className="about__header">
        <span className="label">Om Oss</span>
        <h2 className="heading">Personen bakom Kropp & Form</h2>
        <div className="services__divider" />
      </div>
      <div className="about__grid">
        <div className="about__image-wrap">
          <img src="/kroppochformomoss.webp" alt="Patrik Tysper, medicinsk massageterapeut på Kropp & Form i Tyringe" className="about__image" loading="lazy" width="800" height="800" />
        </div>
        <div className="about__content">
          <h3 className="about__title">Patrik Tysper</h3>
          <p className="about__role">Medicinsk massageterapeut & Personlig coach</p>
          <p className="about__text">
            Mitt namn är Patrik Tysper, Medicinsk massageterapeut och Personlig coach
            sedan 7 år tillbaka.
          </p>
          <p className="about__text">
            Mitt mål är att DU ska förstå vikten av att underhålla kroppen med bland annat
            massage för att få en bättre och bekvämare vardag utan smärta och stelhet.
            Är kroppen i dåligt skick så mår man också därefter.
          </p>
          <p className="about__text">
            Kroppen och musklerna behöver regelbunden stimulans och det får den genom
            rörelse, motion, styrketräning och massage som även bidrar till mental avslappning.
          </p>
          <a href="#contact" className="btn btn--primary about__cta">Boka din tid</a>
        </div>
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════
   CONTACT FORM SECTION
   ═══════════════════════════════ */
const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section className="contact-form reveal" id="contact">
      <div className="contact-form__bg" />
      <div className="container">
        <div className="contact-form__header">
          <span className="label">Kontakta oss</span>
          <h2 className="heading">Boka din tid<br /><em>redan idag!</em></h2>
          <div className="services__divider" />
        </div>
        <div className="contact-form__card">
          <div className="contact-form__info">
            <p className="contact-form__desc">
              Fyll i formuläret så återkommer vi till dig så snart som möjligt.
              Du kan även nå oss direkt via telefon eller e-post.
            </p>
            <div className="contact-form__direct">
              <a href="tel:0768458040" className="contact-form__link">
                <Phone size={16} strokeWidth={1.5} /> 076-845 80 40
              </a>
              <a href="mailto:info@kroppochform.se" className="contact-form__link">
                <Mail size={16} strokeWidth={1.5} /> info@kroppochform.se
              </a>
            </div>
          </div>
          <form className="contact-form__form" onSubmit={handleSubmit}>
            <div className="contact-form__field">
              <User size={16} strokeWidth={1.5} className="contact-form__field-icon" />
              <input
                type="text"
                placeholder="Ditt namn"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="contact-form__field">
              <Mail size={16} strokeWidth={1.5} className="contact-form__field-icon" />
              <input
                type="email"
                placeholder="E-postadress"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="contact-form__field">
              <Phone size={16} strokeWidth={1.5} className="contact-form__field-icon" />
              <input
                type="tel"
                placeholder="Telefonnummer"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="contact-form__field contact-form__field--textarea">
              <MessageSquare size={16} strokeWidth={1.5} className="contact-form__field-icon" />
              <textarea
                placeholder="Ditt meddelande"
                rows={4}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn--primary contact-form__submit">
              {submitted ? '✓ Skickat!' : <><Send size={16} /> Skicka meddelande</>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════
   INFO SECTION
   ═══════════════════════════════ */
const InfoSection = () => (
  <section className="info reveal">
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
              <span className="info__hours-time">10:00–19:00</span>
            </div>
            <div className="info__hours-row">
              <span className="info__hours-day">Tis, Tors</span>
              <span className="info__hours-time">09:00–19:00</span>
            </div>
            <div className="info__hours-row">
              <span className="info__hours-day">Lördag</span>
              <span className="info__hours-time">11:00–14:00</span>
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
          Kropp &amp; Form erbjuder professionell massage och friskvård i Tyringe –
          klassisk massage, helkroppsmassage, Hot Stone och taktilmassage
          med medicinsk massageterapeut Patrik Tysper.
        </p>
      </div>
      <nav className="footer__links" aria-label="Sidfot-navigering">
        <a href="#services" className="footer__link">Våra massagebehandlingar</a>
        <a href="#about" className="footer__link">Om massageterapeut Patrik</a>
        <a href="#contact" className="footer__link">Boka massage i Tyringe</a>
      </nav>
      <div className="footer__social">
        <a href="#" className="footer__social-link" aria-label="Följ Kropp & Form på Instagram">
          <Instagram size={18} />
        </a>
        <a href="#" className="footer__social-link" aria-label="Följ Kropp & Form på Facebook">
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
   SCROLL TO TOP
   ═══════════════════════════════ */
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      className={`scroll-top ${visible ? 'scroll-top--visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scrolla till toppen"
    >
      <ChevronUp size={20} strokeWidth={1.5} />
    </button>
  );
};

/* ═══════════════════════════════
   APP ROOT
   ═══════════════════════════════ */
const App = () => {
  const appRef = useScrollReveal();

  return (
    <div ref={appRef}>
      <Navbar />
      <main>
        <Hero />
        <Testimonials />
        <Philosophy />
        <Services />
        <Benefits />
        <ParallaxInterlude />
        <About />
        <section className="parallax parallax--alt reveal">
          <div className="parallax__bg parallax__bg--alt" />
          <div className="parallax__overlay" />
          <div className="parallax__content">
            <div className="parallax__accent" />
            <p className="parallax__quote">
              Regelbunden massage ger kroppen den<br />återhämtning den förtjänar.
            </p>
            <span className="parallax__attribution">Patrik Tysper</span>
          </div>
        </section>
        <ContactForm />
        <InfoSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);