import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  HiArrowRight,
  HiShieldCheck,
  HiChartBar,
  HiGlobe,
  HiClock,
  HiCog,
  HiSupport,
  HiUserGroup,
  HiCube,
  HiLocationMarker,
  HiPhone,
  HiMail,
  HiMenu,
  HiX,
  HiCheckCircle,
  HiTrendingUp,
  HiSparkles,
} from "react-icons/hi";
import {
  FaShip,
  FaBoxOpen,
  FaFileInvoice,
  FaMapMarkedAlt,
  FaAnchor,
  FaGlobeAsia,
  FaShippingFast,
  FaWarehouse,
  FaHandshake,
  FaQuoteLeft,
} from "react-icons/fa";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <TrustedBy />
      <ServicesSection />
      <StatsSection />
      <ProcessSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-800/95 backdrop-blur-xl border-b border-amber-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
                  <FaAnchor className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 group-hover:opacity-30 blur-lg transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-white tracking-tight">
                  ShipSource
                </span>
                <span className="text-[10px] text-amber-400/80 uppercase tracking-[0.2em]">
                  Global Logistics
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {["Services", "Solutions", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-slate-300 hover:text-amber-400 transition-colors duration-200 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/signin">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10 hover:text-amber-400"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signin">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-amber-500/25 border-0">
                  Get Started
                  <HiArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white"
            >
              {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-900/98 backdrop-blur-xl border-t border-amber-500/10"
          >
            <div className="px-4 py-6 space-y-4">
              {["Services", "Solutions", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-slate-300 hover:text-amber-400 transition-colors py-2"
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Link to="/signin">
                  <Button variant="outline" className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signin">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>
    </>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-slate-800/50 to-transparent" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px),
                            linear-gradient(to bottom, #fff 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />

        {/* Animated Waves */}
        <svg
          className="absolute bottom-0 left-0 right-0 h-48 opacity-10"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#wave-gradient)"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;M0,128L48,154.7C96,181,192,235,288,245.3C384,256,480,224,576,213.3C672,203,768,213,864,234.7C960,256,1056,288,1152,277.3C1248,267,1344,213,1392,186.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </path>
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Hero Content */}
      <motion.div style={{ y, opacity }} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 px-4 py-1.5 text-sm mb-6">
                <HiSparkles className="w-4 h-4 mr-2" />
                #1 Rated Logistics Platform 2026
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mb-6"
            >
              <span className="text-white">Seamless</span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                Global Shipping
              </span>
              <br />
              <span className="text-white">Made Simple</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8"
            >
              Transform your supply chain with intelligent logistics. Track shipments in real-time, 
              manage suppliers effortlessly, and optimize every route — all from one powerful platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/signin">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-xl shadow-amber-500/25 border-0 text-base px-8"
                >
                  Start Free Trial
                  <HiArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-slate-700 text-slate-300 hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/5 text-base px-8"
              >
                <FaMapMarkedAlt className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-6 justify-center lg:justify-start"
            >
              {[
                { icon: HiShieldCheck, label: "Enterprise Security" },
                { icon: HiGlobe, label: "120+ Countries" },
                { icon: HiClock, label: "24/7 Support" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-slate-400">
                  <item.icon className="w-5 h-5 text-amber-500" />
                  <span>{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-cyan-500/20 rounded-3xl blur-2xl" />

            {/* Main Card */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              {/* Browser Chrome */}
              <div className="bg-slate-800/80 backdrop-blur-sm px-4 py-3 flex items-center gap-3 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 bg-slate-700/50 rounded-md px-3 py-1 text-xs text-slate-400 text-center">
                  shipsource.io/dashboard
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Active Shipments", value: "2,847", trend: "+12%" },
                    { label: "In Transit", value: "1,293", trend: "+8%" },
                    { label: "Delivered", value: "12,450", trend: "+24%" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                      <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-emerald-400 mt-1">{stat.trend}</p>
                    </div>
                  ))}
                </div>

                {/* Mini Map */}
                <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-400">Global Activity</span>
                    <span className="text-xs text-amber-400">Live</span>
                  </div>
                  <div className="h-32 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 relative overflow-hidden">
                    {/* Animated Dots */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-amber-400 rounded-full"
                        style={{
                          left: `${20 + (i % 4) * 20}%`,
                          top: `${20 + Math.floor(i / 4) * 40}%`,
                        }}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function TrustedBy() {
  const companies = [
    "Maersk",
    "MSC",
    "CMA CGM",
    "Hapag-Lloyd",
    "Evergreen",
    "COSCO",
  ];

  return (
    <section className="py-16 border-y border-white/5 bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-slate-500 mb-8 uppercase tracking-widest">
          Trusted by industry leaders worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {companies.map((company, index) => (
            <motion.div
              key={company}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-2xl font-display font-bold text-slate-600 hover:text-slate-400 transition-colors cursor-default"
            >
              {company}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: FaShippingFast,
      title: "Freight Forwarding",
      description: "Air, sea, and land freight solutions tailored to your business needs with global coverage.",
      features: ["Door-to-door delivery", "Customs clearance", "Real-time tracking"],
      color: "amber",
    },
    {
      icon: FaWarehouse,
      title: "Warehousing",
      description: "Strategic warehouse locations with advanced inventory management and fulfillment services.",
      features: ["Climate-controlled storage", "Pick and pack", "Inventory sync"],
      color: "cyan",
    },
    {
      icon: FaHandshake,
      title: "Supplier Management",
      description: "Connect with verified suppliers worldwide and manage relationships seamlessly.",
      features: ["Supplier verification", "Performance analytics", "Contract management"],
      color: "emerald",
    },
    {
      icon: FaGlobeAsia,
      title: "Global Compliance",
      description: "Navigate international trade regulations with automated compliance workflows.",
      features: ["Document management", "Compliance checks", "Risk assessment"],
      color: "violet",
    },
  ];

  return (
    <section id="services" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Complete Logistics
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Solutions
            </span>
          </h2>
          <p className="text-lg text-slate-400">
            From origin to destination, we handle every aspect of your supply chain with precision and care.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative h-full bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-amber-500/30 transition-colors">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center ${
                    service.color === "amber"
                      ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400"
                      : service.color === "cyan"
                      ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400"
                      : service.color === "emerald"
                      ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400"
                      : "bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-violet-400"
                  }`}
                >
                  <service.icon className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{service.description}</p>

                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-slate-500">
                      <HiCheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <Link
                    to="/signin"
                    className="inline-flex items-center text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Learn more
                    <HiArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "15K+", label: "Active Shipments", icon: FaShip },
    { value: "2,500+", label: "Supplier Partners", icon: FaBoxOpen },
    { value: "120+", label: "Countries Served", icon: HiGlobe },
    { value: "99.8%", label: "On-Time Delivery", icon: HiTrendingUp },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-amber-400" />
              </div>
              <div className="text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    {
      number: "01",
      title: "Request a Quote",
      description: "Fill out our simple form with your shipping requirements and get instant pricing.",
    },
    {
      number: "02",
      title: "Book Your Shipment",
      description: "Confirm your booking and prepare your goods for pickup at your convenience.",
    },
    {
      number: "03",
      title: "Track & Manage",
      description: "Monitor your shipment in real-time through our intuitive dashboard.",
    },
    {
      number: "04",
      title: "Delivery Confirmed",
      description: "Receive delivery confirmation with complete documentation and proof.",
    },
  ];

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Simple, Transparent
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Process
            </span>
          </h2>
          <p className="text-lg text-slate-400">
            We've streamlined the entire shipping process so you can focus on what matters most — your business.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-amber-500/50 via-orange-500/50 to-amber-500/50" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-amber-500/30 transition-colors">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-display font-bold text-lg mb-6">
                    {step.number}
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  const reasons = [
    {
      icon: HiCog,
      title: "Smart Automation",
      description: "AI-powered route optimization and automated workflows save time and reduce costs.",
    },
    {
      icon: HiUserGroup,
      title: "Dedicated Support",
      description: "Personal account managers available 24/7 to assist with any queries or issues.",
    },
    {
      icon: HiChartBar,
      title: "Advanced Analytics",
      description: "Real-time insights and comprehensive reports to make data-driven decisions.",
    },
    {
      icon: HiShieldCheck,
      title: "Bank-Grade Security",
      description: "SOC 2 Type II certified with end-to-end encryption and compliance.",
    },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Built for Scale,
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Designed for You
              </span>
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              We combine cutting-edge technology with industry expertise to deliver a logistics platform 
              that grows with your business. Join thousands of companies who trust ShipSource for their 
              global shipping needs.
            </p>

            <div className="space-y-6">
              {reasons.map((reason, index) => (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <reason.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{reason.title}</h3>
                    <p className="text-sm text-slate-400">{reason.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/10 to-cyan-500/10 rounded-3xl blur-xl" />

            <div className="relative bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              {/* Globe Visual */}
              <div className="aspect-square bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute border border-amber-500/30 rounded-full"
                      style={{
                        width: `${100 + i * 40}%`,
                        height: `${100 + i * 40}%`,
                        left: `${-i * 20}%`,
                        top: `${-i * 20}%`,
                      }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20 + i * 5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ))}
                </div>

                <div className="relative text-center z-10">
                  <FaGlobeAsia className="w-24 h-24 text-amber-500/80 mx-auto mb-4" />
                  <p className="text-white font-display font-bold text-xl mb-1">
                    Global Network
                  </p>
                  <p className="text-slate-400 text-sm">
                    Connecting 120+ countries
                  </p>
                </div>

                {/* Floating Elements */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-amber-400 rounded-full"
                    style={{
                      left: `${15 + i * 18}%`,
                      top: `${20 + (i % 3) * 25}%`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "ShipSource has transformed our supply chain operations. We've reduced shipping costs by 23% and improved delivery times significantly.",
      author: "Sarah Chen",
      role: "VP of Operations, TechFlow Inc.",
      avatar: "SC",
    },
    {
      quote:
        "The real-time tracking and supplier management features are game-changers. We now have complete visibility across our entire operation.",
      author: "Marcus Williams",
      role: "Director of Logistics, GlobalTrade Co.",
      avatar: "MW",
    },
    {
      quote:
        "Outstanding support team and intuitive platform. ShipSource handles all our international freight needs with zero headaches.",
      author: "Elena Rodriguez",
      role: "Supply Chain Manager, Pacific Imports",
      avatar: "ER",
    },
  ];

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Loved by
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              {" "}
              Industry Leaders
            </span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-amber-500/30 transition-colors"
            >
              <FaQuoteLeft className="w-8 h-8 text-amber-500/30 mb-4" />

              <p className="text-slate-300 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-amber-500/5" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm mb-8">
            <HiSparkles className="w-4 h-4 mr-2" />
            No credit card required
          </Badge>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Ready to Transform Your
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Logistics Operations?
            </span>
          </h2>

          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            Join 500+ companies who have streamlined their shipping and sourcing with ShipSource. 
            Start your free trial today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signin">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-xl text-base px-10"
              >
                Start Free Trial
                <HiArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 text-base px-10"
            >
              Schedule Demo
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {[
              "Free 14-day trial",
              "No credit card required",
              "Cancel anytime",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-400">
                <HiCheckCircle className="w-4 h-4 text-emerald-400" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const footerLinks = {
    Services: ["Freight Forwarding", "Warehousing", "Supplier Management", "Customs Clearance"],
    Company: ["About Us", "Careers", "Press", "Contact"],
    Resources: ["Blog", "Help Center", "API Documentation", "Case Studies"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  };

  return (
    <footer className="bg-slate-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center">
                <FaAnchor className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-white">ShipSource</span>
                <span className="text-[10px] text-amber-400/80 uppercase tracking-[0.2em]">
                  Global Logistics
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 mb-6 max-w-xs">
              The complete logistics platform for modern businesses. Ship smarter, faster, and more efficiently.
            </p>

            {/* Contact */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <HiLocationMarker className="w-4 h-4 text-amber-500" />
                <span>123 Logistics Ave, Singapore 123456</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <HiPhone className="w-4 h-4 text-amber-500" />
                <span>+65 6123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <HiMail className="w-4 h-4 text-amber-500" />
                <span>hello@shipsource.io</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2026 ShipSource. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["LinkedIn", "Twitter", "YouTube"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-sm text-slate-500 hover:text-amber-400 transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
