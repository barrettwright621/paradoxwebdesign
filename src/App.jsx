import React, { useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
};

const slideDown = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: 'auto', opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:   { height: 0, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

// ─── PHONE SVG ────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
  </svg>
);

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['Services', 'Why Us', 'Reviews', 'Contact'];

  return (
    <motion.header
      className="header"
      animate={{ boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)' }}
      transition={{ duration: 0.25 }}
    >
      <div className="container header-inner">
        <motion.div
          className="logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="logo-icon">❄️</span>
          <div>
            <span className="logo-name">Kansas City HVAC</span>
            <span className="logo-tag">Family Owned &amp; Operated</span>
          </div>
        </motion.div>

        <nav className="nav">
          {links.map((link, i) => (
            <motion.a
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              whileHover={{ color: 'var(--orange)' }}
            >
              {link}
            </motion.a>
          ))}
        </nav>

        <motion.a
          href="tel:8164091987"
          className="btn btn-primary header-cta"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <PhoneIcon /> (816) 409-1987
        </motion.a>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            variants={slideDown}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {links.map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(' ', '-')}`}
                onClick={() => setMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <a href="tel:8164091987" className="btn btn-primary">
              <PhoneIcon /> Call (816) 409-1987
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─── EMERGENCY BANNER ─────────────────────────────────────────────────────────
function EmergencyBanner() {
  return (
    <motion.div
      className="emergency-banner"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <span className="pulse-dot" />
      <strong>24/7 Emergency Service Available</strong> — We answer every call, day or night.
      <a href="tel:8164091987">&nbsp;Call Now →</a>
    </motion.div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 80]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  const trustItems = [
    { icon: '🕐', text: '24/7 Emergency' },
    { icon: '🏠', text: 'Family Owned' },
    { icon: '💰', text: 'Fair Pricing' },
    { icon: '✅', text: 'Licensed & Insured' },
  ];

  return (
    <section className="hero">
      <div className="hero-bg" />
      <motion.div className="container hero-content" style={{ y, opacity }}>
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          ⭐ 4.3 Stars · Trusted by Kansas City Families
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.35 }}
        >
          Kansas City's Most<br />
          <span className="highlight">Trusted HVAC Team</span>
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.5 }}
        >
          Honest pricing. Expert technicians. Family owned and operated since day one. We treat your home like our own.
        </motion.p>

        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          <motion.a
            href="tel:8164091987"
            className="btn btn-primary btn-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 6px 24px rgba(249,115,22,0.45)' }}
            whileTap={{ scale: 0.97 }}
          >
            <PhoneIcon /> Call (816) 409-1987
          </motion.a>
          <motion.a
            href="#contact"
            className="btn btn-outline btn-lg"
            whileHover={{ background: 'rgba(255,255,255,0.1)', borderColor: '#fff' }}
            whileTap={{ scale: 0.97 }}
          >
            Get a Free Quote
          </motion.a>
        </motion.div>

        <motion.div
          className="hero-trust"
          variants={stagger}
          initial="hidden"
          animate="visible"
          transition={{ delayChildren: 0.8 }}
        >
          {trustItems.map(item => (
            <motion.div
              key={item.text}
              className="trust-item"
              variants={fadeUp}
            >
              <span className="trust-icon">{item.icon}</span>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <div className="hero-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path fill="#f8fafc" d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"/>
        </svg>
      </div>
    </section>
  );
}

// ─── PROOF BAR ────────────────────────────────────────────────────────────────
function ProofBar() {
  const proofItems = [
    { num: '24/7', label: 'Emergency Service' },
    { num: '⭐ 4.3', label: 'Google Rating' },
    { num: '100%', label: 'Honest Pricing' },
    { num: 'KC', label: 'Locally Owned' },
  ];

  return (
    <section className="proof-bar">
      <motion.div
        className="proof-bar-inner container"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {proofItems.map((item, i) => (
          <React.Fragment key={item.label}>
            {i > 0 && <div className="proof-divider" />}
            <motion.div className="proof-item" variants={fadeUp}>
              <span className="proof-num">{item.num}</span>
              <span className="proof-label">{item.label}</span>
            </motion.div>
          </React.Fragment>
        ))}
      </motion.div>
    </section>
  );
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
const services = [
  { icon: '🔥', title: 'Furnace Repair & Service', desc: 'Fast, reliable furnace repairs when you need them most. We diagnose the problem and explain every step before we start.', cta: 'Call for Service →' },
  { icon: '❄️', title: 'A/C Repair & Maintenance', desc: 'Keep your cooling system running at peak efficiency. Tune-ups, refrigerant service, coil cleaning, and full repairs.', cta: 'Call for Service →' },
  { icon: '🚨', title: '24/7 Emergency HVAC', desc: 'No heat in winter? No AC in a Kansas City summer? We pick up the phone and get someone to you fast — any time, any day.', cta: 'Call Now — We Answer →', featured: true, badge: 'Most Popular' },
  { icon: '🔧', title: 'System Installation', desc: "Upgrading your HVAC system? We'll help you choose the right equipment for your home and install it right the first time.", cta: 'Get a Free Quote →' },
  { icon: '📋', title: 'Preventive Maintenance', desc: 'Catch problems before they become expensive. Annual tune-ups extend equipment life and keep your bills low.', cta: 'Schedule Today →' },
  { icon: '🌡️', title: 'Thermostat & Controls', desc: 'Smart thermostat installation, zone control setup, and system diagnostics to maximize comfort and efficiency.', cta: 'Learn More →' },
];

function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <motion.div
          className="section-header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="section-label">What We Do</span>
          <h2 className="section-title">Full-Service Heating &amp; Cooling</h2>
          <p className="section-sub">From emergency repairs to new system installations, we handle everything your home needs to stay comfortable year-round.</p>
        </motion.div>

        <motion.div
          className="services-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map(s => (
            <motion.div
              key={s.title}
              className={`service-card${s.featured ? ' service-card--featured' : ''}`}
              variants={cardVariant}
              whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.18)', borderColor: 'var(--orange)' }}
              transition={{ duration: 0.25 }}
            >
              {s.badge && <div className="service-badge">{s.badge}</div>}
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <a href="tel:8164091987" className="service-link">{s.cta}</a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── WHY US ───────────────────────────────────────────────────────────────────
const whyItems = [
  { icon: '🤝', title: 'Honest & Transparent', desc: '"Very honest nice guys, great work, and great price." We explain every repair in plain English before touching anything.' },
  { icon: '👨‍👩‍👦', title: 'Family Owned & Operated', desc: "We're not a massive corporation. We're a Kansas City family business that cares about our reputation and our neighbors." },
  { icon: '⏰', title: 'Always On Time', desc: 'We respect your schedule. Our customers consistently note that we show up when we say we will — no 4-hour windows.' },
  { icon: '💬', title: 'Expert Who Explains', desc: "Bryan and our team break down exactly what's wrong and what we're doing, so you're never in the dark about your own home." },
  { icon: '💲', title: 'Reasonable Rates', desc: 'Fair, upfront pricing. No hidden fees, no upsells you don\'t need. You get quality work at a price that makes sense.' },
  { icon: '🏳️‍🌈', title: 'Welcoming to All', desc: "We're proud to be an LGBTQ+ friendly business. Every Kansas City family deserves professional, respectful HVAC service." },
];

function WhyUs() {
  return (
    <section className="section section--dark" id="why-us">
      <div className="container">
        <motion.div
          className="section-header section-header--light"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="section-label">Why Choose Us</span>
          <h2 className="section-title" style={{ color: '#fff' }}>The Kansas City HVAC Difference</h2>
          <p className="section-sub" style={{ color: '#94a3b8' }}>We're not a call center or a franchise. We're your neighbors — and we show up like it.</p>
        </motion.div>

        <motion.div
          className="why-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {whyItems.map(item => (
            <motion.div
              key={item.title}
              className="why-card"
              variants={cardVariant}
              whileHover={{
                background: 'rgba(255,255,255,0.07)',
                borderColor: 'var(--orange)',
                y: -4,
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="why-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────
const reviews = [
  {
    stars: '⭐⭐⭐⭐⭐',
    text: '"Wouldn\'t call anyone else for our HVAC needs. Bryan has been out multiple times and is always awesome to deal with — explains everything and makes it easy to understand. They are easy to make an appointment with, always on time."',
    name: 'Jacob Ogden',
    sub: 'Kansas City, MO',
    initials: 'JO',
  },
  {
    stars: '⭐⭐⭐⭐⭐',
    text: '"Bryan has been out to service our home 3 times and each time he was professional, kind, and relatable. I feel like I can trust him with my A/C and furnace needs! Thank you Bryan!"',
    name: 'Stephen Heaton',
    sub: 'Local Guide · 52 Reviews',
    initials: 'SH',
    featured: true,
  },
  {
    stars: '⭐⭐⭐⭐⭐',
    text: '"All I can say is McGrath HVAC is the best. We have called them for various problems and they are honest, professional and courteous, always fully explaining the work being done. Reasonable rates. They\'re good people."',
    name: 'Cliff Snider',
    sub: 'Local Guide · 35 Reviews',
    initials: 'CS',
  },
];

function Reviews() {
  return (
    <section className="section" id="reviews">
      <div className="container">
        <motion.div
          className="section-header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="section-label">Real Reviews</span>
          <h2 className="section-title">What Kansas City Says About Us</h2>
          <div className="stars-summary">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <span className="stars-text"><strong>4.3 out of 5</strong> · 16 Google Reviews</span>
          </div>
        </motion.div>

        <motion.div
          className="reviews-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {reviews.map(r => (
            <motion.div
              key={r.name}
              className={`review-card${r.featured ? ' review-card--featured' : ''}`}
              variants={cardVariant}
              whileHover={{ y: -5, boxShadow: '0 16px 48px rgba(0,0,0,0.15)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="review-stars">{r.stars}</div>
              <p className="review-text">{r.text}</p>
              <div className="reviewer">
                <div className="reviewer-avatar">{r.initials}</div>
                <div>
                  <strong>{r.name}</strong>
                  <span>{r.sub}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── CTA BAND ─────────────────────────────────────────────────────────────────
function CtaBand() {
  return (
    <section className="cta-section">
      <motion.div
        className="container cta-inner"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="cta-text">
          <h2>Ready for Honest, Expert HVAC Service?</h2>
          <p>Call us any time — we answer 24/7. No automated phone trees, no call centers. Just your local Kansas City HVAC team.</p>
        </div>
        <div className="cta-actions">
          <motion.a
            href="tel:8164091987"
            className="btn btn-white btn-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}
            whileTap={{ scale: 0.97 }}
          >
            <PhoneIcon /> (816) 409-1987
          </motion.a>
          <motion.a
            href="#contact"
            className="btn btn-outline-white btn-lg"
            whileHover={{ background: 'rgba(255,255,255,0.12)' }}
            whileTap={{ scale: 0.97 }}
          >
            Request a Quote
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      e.target.reset();
    }, 1000);
  }

  return (
    <section className="section" id="contact">
      <div className="container">
        <motion.div
          className="section-header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="section-label">Get in Touch</span>
          <h2 className="section-title">Contact Kansas City HVAC</h2>
          <p className="section-sub">For emergencies, call us directly. For non-urgent requests, fill out the form and we'll be in touch quickly.</p>
        </motion.div>

        <motion.div
          className="contact-layout"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="contact-card" variants={fadeUp}>
            <h3>Call or Text Us</h3>
            <a href="tel:8164091987" className="contact-phone">(816) 409-1987</a>
            <p className="contact-hours">📍 904 E 63rd St, Kansas City, MO 64110</p>
            <p className="contact-hours">🕐 Open 24 Hours · 7 Days a Week</p>
            <p className="contact-hours">🏠 Family Owned &amp; Operated</p>
            <div className="contact-badges">
              <span className="badge">Licensed</span>
              <span className="badge">Insured</span>
              <span className="badge">LGBTQ+ Friendly</span>
            </div>
          </motion.div>

          <motion.form
            className="contact-form"
            variants={fadeUp}
            onSubmit={handleSubmit}
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input type="text" id="name" name="name" required placeholder="John Smith" />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input type="tel" id="phone" name="phone" required placeholder="(816) 555-0000" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="service">Service Needed *</label>
              <select id="service" name="service" required>
                <option value="">Select a service...</option>
                <option>Furnace Repair</option>
                <option>A/C Repair</option>
                <option>Emergency Service</option>
                <option>New System Installation</option>
                <option>Preventive Maintenance</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">Describe Your Issue</label>
              <textarea id="message" name="message" rows={4} placeholder="Tell us what's going on..." />
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(249,115,22,0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Sending...' : 'Send My Request'}
            </motion.button>
            <p className="form-disclaimer">We typically respond within 1 hour during business hours. For emergencies, please call us directly.</p>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  className="form-success"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  ✅ Thank you! We'll be in touch shortly. For urgent needs, call (816) 409-1987.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-logo logo">
          <span className="logo-icon">❄️</span>
          <div>
            <span className="logo-name">Kansas City HVAC</span>
            <span className="logo-tag">Family Owned &amp; Operated</span>
          </div>
        </div>
        <div className="footer-info">
          <p>904 E 63rd St, Kansas City, MO 64110</p>
          <p><a href="tel:8164091987">(816) 409-1987</a> · Open 24/7</p>
          <p className="footer-copy">&copy; 2025 Kansas City HVAC. All rights reserved.</p>
        </div>
        <div className="footer-links">
          {['Services', 'Why Us', 'Reviews', 'Contact'].map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`}>{link}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── FLOATING CTA (mobile) ────────────────────────────────────────────────────
function FloatingCta() {
  return (
    <motion.a
      href="tel:8164091987"
      className="floating-cta"
      aria-label="Call us now"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <PhoneIcon />
    </motion.a>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <Header />
      <EmergencyBanner />
      <Hero />
      <ProofBar />
      <Services />
      <WhyUs />
      <Reviews />
      <CtaBand />
      <Contact />
      <Footer />
      <FloatingCta />
    </>
  );
}
