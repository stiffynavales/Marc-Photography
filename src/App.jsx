import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Video, MessageSquare, Play, Pause, ArrowRight, Instagram, Facebook, Mail, Clock, Calendar, Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const navRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power4.out' }
    );
  }, []);

  const navLinks = [
    { name: 'Portfolio', href: '/portfolio', internal: true },
    { name: 'Services', href: isHome ? '#services' : '/#services', internal: false },
    { name: 'Process', href: isHome ? '#process' : '/#process', internal: false },
    { name: 'Contact', href: isHome ? '#contact' : '/#contact', internal: false },
  ];

  return (
    <>
      <nav ref={navRef} className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
        <div className="bg-dark/90 backdrop-blur-xl border border-white/10 rounded-full px-6 md:px-12 py-4 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <img src="/mp logo.png" alt="Marc Photography Logo" className="h-8 md:h-10 w-auto" />
              <div className="text-champagne font-serif text-lg tracking-[0.4em] uppercase hidden xl:block">
                Marc Photography
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.internal ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-offwhite/60 hover:text-signal font-mono text-sm uppercase tracking-widest transition-colors"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-offwhite/60 hover:text-signal font-mono text-sm uppercase tracking-widest transition-colors"
                >
                  {link.name}
                </a>
              )
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsContactOpen(true)}
              className="bg-signal text-offwhite px-4 md:px-6 py-2 rounded-full font-sans font-bold text-xs md:text-sm uppercase tracking-wider hover:scale-105 transition-transform"
            >
              Inquire Now
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-offwhite p-2 hover:text-signal transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[150] bg-dark transition-all duration-500 flex flex-col p-12 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex justify-between items-center mb-24">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <img src="/mp logo.png" alt="Marc Photography Logo" className="h-8 w-auto" />
            <div className="text-champagne font-serif text-lg tracking-[0.4em] uppercase">
              MP
            </div>
          </Link>
          <button onClick={() => setIsOpen(false)} className="text-offwhite">
            <X size={32} />
          </button>
        </div>

        <div className="flex flex-col gap-12">
          {navLinks.map((link, i) => (
            link.internal ? (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="text-offwhite text-5xl font-sans font-bold uppercase tracking-tighter hover:text-signal transition-colors"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-offwhite text-5xl font-sans font-bold uppercase tracking-tighter hover:text-signal transition-colors"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {link.name}
              </a>
            )
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-8">
          <div className="text-offwhite/20 font-mono text-xs uppercase tracking-[0.5em]">Social Transmission</div>
          <div className="flex gap-8 text-offwhite/60">
            <Instagram size={20} className="hover:text-signal cursor-pointer" />
            <Facebook size={20} className="hover:text-signal cursor-pointer" />
            <Mail size={20} className="hover:text-signal cursor-pointer" />
          </div>
        </div>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

const ContactModal = ({ isOpen, onClose }) => {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    const formData = new FormData(event.target);

    // Replace with configured Web3Forms access key from environment variables
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "YOUR_WEB3FORMS_ACCESS_KEY_HERE";
    formData.append("access_key", accessKey);
    formData.append("subject", "New Inquiry Request");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("Inquiry sent securely to our team.");
        event.target.reset();
        setTimeout(() => {
          onClose();
          setResult("");
        }, 3000);
      } else {
        setResult(data.message);
      }
    } catch {
      setResult("Submission failed. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-dark/95 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative bg-dark border border-white/10 p-8 md:p-12 rounded-[2rem] w-full max-w-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-offwhite/50 hover:text-signal transition-colors p-2"
        >
          <X size={24} />
        </button>
        <h2 className="text-offwhite text-3xl md:text-5xl font-sans font-bold uppercase tracking-tighter mb-2">
          Inquire<span className="text-signal italic">.</span>
        </h2>
        <p className="text-offwhite/50 font-mono text-xs uppercase tracking-widest mb-8">
          Tell us about your vision.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="name" placeholder="FULL NAME *" required className="bg-transparent border-b border-white/20 pb-2 text-offwhite placeholder:text-offwhite/30 font-sans focus:outline-none focus:border-signal transition-colors" />
            <input type="email" name="email" placeholder="EMAIL ADDRESS *" required className="bg-transparent border-b border-white/20 pb-2 text-offwhite placeholder:text-offwhite/30 font-sans focus:outline-none focus:border-signal transition-colors" />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <input type="tel" name="phone" placeholder="PHONE NUMBER" className="bg-transparent border-b border-white/20 pb-2 text-offwhite placeholder:text-offwhite/30 font-sans focus:outline-none focus:border-signal transition-colors" />
          </div>
          <textarea name="vision" placeholder="TELL US ABOUT YOUR VISION *" required rows={4} className="bg-transparent border-b border-white/20 pb-2 text-offwhite placeholder:text-offwhite/30 font-sans focus:outline-none focus:border-signal transition-colors resize-none mt-4"></textarea>

          <button type="submit" className="bg-signal text-dark px-8 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-widest hover:bg-offwhite transition-colors mt-4 self-start">
            Submit Inquiry
          </button>
        </form>
        {result && <span className="text-signal font-mono text-xs uppercase tracking-widest mt-6 block">{result}</span>}
      </div>
    </div>
  );
};

const PencilModal = ({ isOpen, onClose }) => {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    const formData = new FormData(event.target);

    // Replace with configured Web3Forms access key from environment variables
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "YOUR_WEB3FORMS_ACCESS_KEY_HERE";
    formData.append("access_key", accessKey);
    formData.append("subject", "New Pencil Booking Request");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("Date securely penciled in. We will be in touch shortly.");
        event.target.reset();
        setTimeout(() => {
          onClose();
          setResult("");
        }, 3000);
      } else {
        setResult(data.message);
      }
    } catch {
      setResult("Submission failed. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-dark/95 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative bg-dark border border-white/10 p-8 md:p-12 rounded-[2rem] w-full max-w-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-offwhite/50 hover:text-signal transition-colors p-2"
        >
          <X size={24} />
        </button>
        <h2 className="text-offwhite text-3xl md:text-5xl font-sans font-bold uppercase tracking-tighter mb-2">
          Pencil <span className="text-signal italic">Booking.</span>
        </h2>
        <p className="text-offwhite/50 font-mono text-xs uppercase tracking-widest mb-8">
          Select your preferred event date to secure your slot.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="name" placeholder="FULL NAME *" required className="bg-transparent border-b border-white/20 pb-2 text-offwhite placeholder:text-offwhite/30 font-sans focus:outline-none focus:border-signal transition-colors" />
            <input type="email" name="email" placeholder="EMAIL ADDRESS *" required className="bg-transparent border-b border-white/20 pb-2 text-offwhite placeholder:text-offwhite/30 font-sans focus:outline-none focus:border-signal transition-colors" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <input type="tel" name="phone" placeholder="PHONE NUMBER *" required className="bg-transparent border-b border-white/20 pb-2 text-offwhite placeholder:text-offwhite/30 font-sans focus:outline-none focus:border-signal transition-colors" />
            <div className="relative border-b border-white/20 pb-2 group">
              <span className="absolute left-0 top-0 text-offwhite/30 font-sans text-sm pointer-events-none transition-colors group-focus-within:text-signal">PREFERRED DATE *</span>
              <Calendar className="absolute right-0 bottom-2 text-offwhite/30 group-focus-within:text-signal pointer-events-none transition-colors" size={18} />
              <input
                type="date"
                name="preferred_date"
                required
                style={{ colorScheme: 'dark' }}
                className="bg-transparent w-full pt-6 text-offwhite font-sans focus:outline-none transition-colors cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>
          </div>
          <div className="relative border-b border-white/20 pb-2 mt-4">
            <select name="event_type" required className="bg-dark w-full text-offwhite font-sans focus:outline-none focus:border-signal transition-colors appearance-none cursor-pointer">
              <option value="" disabled selected className="text-offwhite/30">SELECT EVENT TYPE *</option>
              <option value="Wedding">Wedding</option>
              <option value="Debut">Debut</option>
              <option value="Prenup">Prenup / Engagement</option>
              <option value="Corporate">Corporate / Brand Event</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <textarea name="details" placeholder="ANY ADDITIONAL DETAILS?" rows={3} className="bg-transparent border-b border-white/20 pb-2 text-offwhite placeholder:text-offwhite/30 font-sans focus:outline-none focus:border-signal transition-colors resize-none mt-4"></textarea>

          <button type="submit" className="bg-signal text-dark px-8 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-widest hover:bg-offwhite transition-colors mt-4 self-start">
            Secure Date
          </button>
        </form>
        {result && <span className="text-signal font-mono text-xs uppercase tracking-widest mt-6 block">{result}</span>}
      </div>
    </div>
  );
};

import ReactPlayer from 'react-player';

const Hero = ({
  title1 = "Sophisticated Visuals.",
  title2 = "Timeless Memories.",
  subtitle = "Bespoke photography and cinematic films crafted for weddings, celebrations, and distinguished events.",
  showButton = true
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-line-1", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.8
      });
      gsap.from(".hero-line-2", {
        y: 150,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 1
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center pt-24 pb-12 px-6 bg-dark overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-dark/40 z-10 transition-colors duration-1000"></div>
        <div className="absolute inset-0 w-full h-full scale-[1.1] pointer-events-none">
          <video
            src="/vid-bg-overlay.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="relative z-20 text-center max-w-6xl">
        <div className="overflow-hidden mb-4">
          <h1 className="hero-line-1 text-4xl md:text-7xl lg:text-8xl font-sans font-bold tracking-tighter uppercase leading-[0.9] text-offwhite">
            {title1}
          </h1>
        </div>
        <div className="overflow-hidden mb-12">
          <h1 className="hero-line-2 text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-serif italic text-signal leading-[0.8]">
            {title2}
          </h1>
        </div>
        <p className="max-w-xs md:max-w-xl mx-auto text-offwhite/60 font-mono text-xs md:text-sm uppercase tracking-widest mb-12 leading-relaxed">
          {subtitle}
        </p>

        {showButton && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link to="/portfolio" className="btn-magnetic group bg-offwhite text-dark min-w-[240px] flex items-center justify-center">
              <span className="relative z-10 flex items-center gap-3 font-bold uppercase tracking-widest text-xs">
                View Portfolio <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
            <div className="flex items-center gap-4 px-6">
              <div className="flex -space-x-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-paper/20 border-2 border-offwhite/10 flex items-center justify-center backdrop-blur-sm">
                    <Camera size={14} className="text-offwhite/40" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="text-offwhite font-bold text-xs uppercase">500+ Events</div>
                <div className="text-offwhite/40 font-mono text-[10px] uppercase">Captured with Precision</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-12 left-12 hidden lg:block">
        <div className="flex flex-col gap-6 text-dark/20">
          <Instagram size={20} className="hover:text-signal transition-colors cursor-pointer" />
          <Facebook size={20} className="hover:text-signal transition-colors cursor-pointer" />
          <Mail size={20} className="hover:text-signal transition-colors cursor-pointer" />
        </div>
      </div>

      <div className="absolute bottom-12 right-12 text-right hidden lg:block">
        <div className="text-dark font-mono text-[10px] uppercase tracking-tighter opacity-20 vertical-rl transform rotate-180">
          Marc Photography / Photo & Films
        </div>
      </div>
    </section>
  );
};

// eslint-disable-next-line no-unused-vars
const FeatureCard = ({ title, description, icon: Icon, type, bgImage }) => {
  return (
    <div className="group relative bg-dark rounded-large p-10 border border-white/10 hover:border-signal/30 transition-all duration-500 hover:shadow-2xl overflow-hidden min-h-[400px] h-full flex flex-col justify-between">
      {/* Background Image & Overlay */}
      {bgImage && (
        <>
          <div className="absolute inset-0 z-0">
            <img
              src={bgImage}
              alt={title}
              className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent z-1"></div>
        </>
      )}

      <div className="relative z-10">
        <div className="absolute top-0 right-0 p-8 text-offwhite/5 group-hover:text-signal/10 transition-colors">
          <Icon size={120} strokeWidth={1} />
        </div>

        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-12 text-signal">
          <Icon size={20} />
        </div>
        <h3 className="text-offwhite text-3xl font-sans font-bold tracking-tighter mb-6">{title}</h3>
        <p className="text-offwhite/60 font-sans leading-relaxed text-sm max-w-[280px]">{description}</p>
      </div>

      <div className="relative z-10 mt-8 pt-8 border-t border-white/10">
        {type === 'shuffler' && (
          <div className="flex gap-2">
            {['MEMORIES', 'FRAMES', 'LENS'].map(word => (
              <span key={word} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono uppercase tracking-widest text-offwhite/40 italic">
                {word}
              </span>
            ))}
          </div>
        )}
        {type === 'telemetry' && (
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-signal animate-pulse"></span>
            <span className="text-[10px] font-mono text-offwhite/40 uppercase tracking-widest underline decoration-signal/30 underline-offset-4">
              Live Feed: SAME-DAY EDIT READY
            </span>
          </div>
        )}
        {type === 'scheduler' && (
          <div className="flex items-center gap-3">
            <Calendar size={14} className="text-signal" />
            <span className="text-[10px] font-mono text-offwhite/40 uppercase tracking-widest">
              DIRECT BOOKING ACTIVE
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const Features = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={containerRef} className="py-24 px-6 bg-offwhite">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <div className="feature-card h-full">
            <FeatureCard
              title="Capturing Your Most Memorable Moments"
              description="Professional photography for weddings, debuts, and special events — delivering beautifully framed memories."
              icon={Camera}
              type="shuffler"
              bgImage="/card-1-bg.jpg"
            />
          </div>
          <div className="feature-card h-full">
            <FeatureCard
              title="Dynamic Photo & Video Coverage"
              description="High-quality photo and same-day edit video services that bring your celebrations to life."
              icon={Video}
              type="telemetry"
              bgImage="/card-2-bg.jpg"
            />
          </div>
          <div className="feature-card h-full">
            <FeatureCard
              title="Personalized, On-Demand Service"
              description="Easy booking and direct communication via social channels — customized shoots for every unique client."
              icon={MessageSquare}
              type="scheduler"
              bgImage="/card-3-bg.jpg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const Philosophy = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".philosophy-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.from(".reveal-text", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative py-48 px-6 bg-dark overflow-hidden">
      <div className="philosophy-bg absolute -top-[15%] left-0 w-full h-[130%] z-0">
        <img
          src="/philosophy-bg.jpg"
          alt="Philosophy Background"
          className="w-full h-full object-cover opacity-35"
        />
        {/* Radial gradient centered on subjects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--color-dark)_70%)]"></div>
        {/* Secondary linear gradient to ensure bottom/top darkness */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-transparent to-dark opacity-60"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="reveal-text text-offwhite font-mono text-xs uppercase tracking-[0.5rem] mb-12 opacity-40 italic">
          — Core Philosophy —
        </h2>
        <div className="flex flex-col gap-12">
          <p className="reveal-text text-offwhite text-4xl md:text-6xl font-serif italic leading-tight">
            "Most photography focuses on: <span className="text-offwhite/40">preserving the past.</span>"
          </p>
          <p className="reveal-text text-signal text-4xl md:text-6xl font-sans font-bold uppercase tracking-tighter leading-tight">
            Because every occasion <span className="underline decoration-offwhite/10 underline-offset-8 italic">deserves timeless artistry.</span>
          </p>
        </div>
        <p className="reveal-text mt-24 text-offwhite/30 font-mono text-xs max-w-lg mx-auto leading-relaxed uppercase tracking-widest">
          An image is more than a record — it is a statement of a moment destined to endure.
        </p>
      </div>
    </section>
  );
};

const ProtocolStep = ({ number, title, subtitle, description, isActive }) => {
  return (
    <div className={`stack-card transition-all duration-700 ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}`}>
      <div className="flex flex-col md:flex-row gap-12 h-full">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="font-mono text-xs text-signal mb-8 flex items-center gap-4">
              <span className="w-8 h-px bg-signal/20"></span>
              STEP_{number}
            </div>
            <h3 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter uppercase mb-6 leading-none">
              {title}
            </h3>
            <div className="text-dark/40 font-serif italic text-2xl mb-12">{subtitle}</div>
          </div>

          <div className="max-w-md">
            <p className="text-dark/60 font-sans leading-relaxed text-lg italic">
              {description}
            </p>
          </div>
        </div>

        <div className="flex-1 bg-dark/5 rounded-[2rem] border border-dark/5 relative overflow-hidden flex items-center justify-center p-12">
          <div className="absolute top-0 right-0 p-8">
            <Clock size={20} className="text-dark/10" />
          </div>
          <div className="text-8xl font-sans font-bold text-dark/5 select-none">{number}</div>
          <div className="absolute bottom-12 left-12 flex flex-col gap-4">
            <div className="w-48 h-1 bg-dark/10 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-signal"></div>
            </div>
            <div className="text-[10px] font-mono text-dark/20 uppercase tracking-widest">Syncing Data... 0{number}.00</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Protocol = () => {
  return (
    <section id="process" className="py-24 px-6 bg-offwhite">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-sans font-bold tracking-tighter uppercase leading-[0.8] text-dark/10">
            The<br /><span className="text-dark">Protocol.</span>
          </h2>
          <div className="max-w-xs">
            <p className="text-dark/40 font-mono text-[10px] uppercase tracking-widest leading-relaxed italic">
              A systematic approach to event coverage. No noise. No interference. Pure signal.
            </p>
          </div>
        </div>

        <div className="relative">
          <ProtocolStep
            number="01"
            title="Vision"
            subtitle="The Blueprint"
            description="Deep consultation to map out the narrative of your event. We don't just show up; we architect the vision."
            isActive={true}
          />
          <ProtocolStep
            number="02"
            title="Capture"
            subtitle="The Execution"
            description="Precision production using industry-grade optics. High-velocity capture for high-stakes moments."
            isActive={true}
          />
          <ProtocolStep
            number="03"
            title="Delivery"
            subtitle="The Transmission"
            description="Same-day edits and high-fidelity archival. Your memories, transmitted with zero latency."
            isActive={true}
          />
        </div>
      </div>
    </section>
  );
};

const Membership = () => {
  const containerRef = useRef(null);
  const [isPencilOpen, setIsPencilOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".membership-reveal", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      });

      gsap.from(".membership-card", {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 65%",
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 px-6 bg-offwhite">
      <div className="max-w-7xl mx-auto bg-dark rounded-large p-8 md:p-16 lg:p-24 overflow-hidden relative border border-white/5">
        <div className="absolute top-0 left-0 w-full h-1 bg-signal/20"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div>
            <h2 className="membership-reveal text-offwhite text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-sans font-bold tracking-tighter uppercase leading-none mb-12">
              Ready for <br /><span className="text-signal italic">Deployment?</span>
            </h2>
            <p className="membership-reveal text-offwhite/40 font-mono text-sm uppercase tracking-widest mb-12 leading-relaxed">
              Limited slots available for the 2026 season. <br /> Secure your event date in the Marc Photography registry.
            </p>
            <div className="membership-reveal">
              <button
                onClick={() => setIsPencilOpen(true)}
                className="bg-signal text-offwhite px-8 md:px-12 py-4 md:py-6 rounded-full font-sans font-bold text-base md:text-lg uppercase tracking-widest hover:bg-offwhite hover:text-dark transition-colors flex items-center gap-4"
              >
                Book Now <Play size={20} fill="currentColor" />
              </button>
            </div>
            <PencilModal isOpen={isPencilOpen} onClose={() => setIsPencilOpen(false)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            {[
              { label: 'Weddings', value: 'Prime' },
              { label: 'Debuts', value: 'High' },
              { label: 'Prenups', value: 'Studio' },
              { label: 'Corporate', value: 'Active' }
            ].map(item => (
              <div key={item.label} className="membership-card border border-white/10 p-6 md:p-8 rounded-[2rem] hover:border-signal/50 transition-colors">
                <div className="text-offwhite/20 font-mono text-[10px] uppercase tracking-widest mb-4">{item.label}</div>
                <div className="text-offwhite text-xl md:text-2xl font-sans font-bold uppercase tracking-tighter italic">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 right-0 p-12 opacity-5">
          <Camera size={300} className="text-offwhite" />
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-dark pt-24 pb-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <img src="/mp logo.png" alt="Marc Photography Logo" className="h-12 w-auto" />
              <div className="text-champagne font-serif text-3xl tracking-[0.3em] uppercase italic">
                Marc Photography.
              </div>
            </div>
            <p className="text-offwhite/30 font-mono text-[10px] uppercase tracking-widest max-w-sm leading-relaxed">
              Philippine-based photography & videography team.
              Architecting memories since 2018. Available for nationwide and international deployment.
            </p>
          </div>

          <div>
            <h4 className="text-offwhite font-sans font-bold text-xs uppercase tracking-widest mb-8 text-signal italic">— Navigation</h4>
            <div className="flex flex-col gap-4">
              <Link to="/portfolio" className="text-offwhite/40 hover:text-offwhite font-mono text-[10px] uppercase tracking-widest transition-colors tracking-widest">Portfolio</Link>
              <Link to="/" className="text-offwhite/40 hover:text-offwhite font-mono text-[10px] uppercase tracking-widest transition-colors tracking-widest">Home</Link>
              <a href="#services" className="text-offwhite/40 hover:text-offwhite font-mono text-[10px] uppercase tracking-widest transition-colors tracking-widest">Services</a>
              <a href="#contact" className="text-offwhite/40 hover:text-offwhite font-mono text-[10px] uppercase tracking-widest transition-colors tracking-widest">Contact</a>
            </div>
          </div>

          <div>
            <h4 className="text-offwhite font-sans font-bold text-xs uppercase tracking-widest mb-8 text-signal italic">— Signal</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                <span className="text-offwhite/40 font-mono text-[10px] uppercase tracking-widest">System Active / 2026 Season</span>
              </div>
              <div className="text-offwhite/40 font-mono text-[10px] uppercase tracking-widest mt-4">
                Designed & Developed By Stiffy Navales
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between gap-8">
          <div className="text-offwhite/10 font-mono text-[8px] uppercase tracking-widest">
            © 2026 Marc Photography. All Rights Reserved. Eradicate mediocrity.
          </div>
          <div className="flex gap-8 text-offwhite/20">
            <Instagram size={14} className="hover:text-signal cursor-pointer" />
            <Facebook size={14} className="hover:text-signal cursor-pointer" />
            <Mail size={14} className="hover:text-signal cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PortfolioItem = ({ title, category, image, video, span = 'col-span-1', onSelect }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      onClick={() => {
        if (video && onSelect) {
          onSelect(video);
        }
      }}
      className={`portfolio-card group relative overflow-hidden rounded-[2rem] bg-dark aspect-[4/5] md:aspect-auto ${span === 'full' ? 'md:col-span-2 h-[400px] md:h-[500px]' : 'h-[350px] md:h-[600px]'} ${video ? 'video-card-hover cursor-none' : ''}`}
    >
      <div className="absolute inset-0 z-0">
        {video ? (
          <>
            <video
              ref={videoRef}
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <button
              onClick={togglePlay}
              className="absolute top-6 right-6 z-30 w-12 h-12 rounded-full bg-dark/50 backdrop-blur-md flex items-center justify-center text-offwhite border border-white/10 hover:bg-signal transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
          </>
        ) : (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
          />
        )}
      </div>

      {/* Visual Overlay - Disable pointer events to prevent blocking clicks */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-80 z-10 pointer-events-none"></div>

      {/* Text Content - Disable pointer events on the container to prevent blocking the button */}
      <div className="absolute bottom-0 left-0 p-6 md:p-12 z-20 pointer-events-none w-full">
        <div className="text-signal font-mono text-[8px] md:text-[10px] uppercase tracking-[0.3em] mb-2 md:mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          {category}
        </div>
        <h3 className="text-offwhite text-xl md:text-3xl font-sans font-bold uppercase tracking-tighter transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75 pr-4 truncate whitespace-normal line-clamp-2 md:line-clamp-none">
          {title}
        </h3>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <Philosophy />
      <Protocol />
      <Membership />
    </>
  );
};

const VideoCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('.video-card-hover')) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOver);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 pointer-events-none z-[100] transition-opacity duration-300 items-center justify-center hidden md:flex`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
        opacity: isVisible ? 1 : 0
      }}
    >
      <div className="bg-signal text-dark px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shadow-xl">
        Click to view the Video
      </div>
    </div>
  );
};

const PortfolioPage = () => {
  const containerRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Title Animation
      gsap.from(".portfolio-hero-title", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2
      });

      // Section Titles Animation
      gsap.utils.toArray(".portfolio-section-title").forEach(title => {
        gsap.from(title, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: title,
            start: "top 85%",
          }
        });
      });

      // Cards Stagger Animation
      gsap.utils.toArray(".portfolio-grid").forEach(grid => {
        const cards = grid.querySelectorAll(".portfolio-card");
        gsap.from(cards, {
          y: 100,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 80%",
          }
        });
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const photography = [
    { title: "E L I Z A", category: "Marc Photography", image: "/photog-3.jpg", span: "full" },
    { title: "G E M S I + I A N", category: "Marc Photography", image: "/photog-1.jpg" },
    { title: "S T E V E N", category: "Forever Kids", image: "/photog-2.jpg" },
  ];

  const videography = [
    { title: "E L I Z A | Pre Debut Film", category: "Marc Photography", video: "/vid-port-1.mp4", span: "full" },
    { title: "J E S S A & R Y A N | THE WEDDING | SAME DAY EDIT", category: "Marc Photography", video: "/vid-port-2.mp4", span: "full" },
    { title: "Allison's 1st Birthday & Baptismal | SAME DAY EDIT", category: "Forever Kids", video: "/vid-port-3.mp4", span: "full" },
  ];

  const corporate = [
    { title: "H I S E N S E | GOLF TOURNAMENT", category: "Marc Photography", video: "/vid-corp-1.mp4", span: "full" },
    { title: "Advertising Reels - Dahon at Mesa", category: "Marc Photography", video: "/vid-corp-2.mp4" },
    { title: "LIFE IS ON SCHNEIDER ELECTRIC POWER UP", category: "Marc Photography", video: "/vid-corp-3.mp4" },
  ];

  return (
    <div ref={containerRef} className="bg-dark min-h-screen">
      <VideoCursor />

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/95 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setSelectedVideo(null)}></div>
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-8 right-8 z-50 text-offwhite/50 hover:text-offwhite transition-colors p-4"
          >
            <X size={32} />
          </button>
          <div className="relative z-10 w-full max-w-6xl aspect-video bg-black md:rounded-lg overflow-hidden shadow-2xl mt-16 md:mt-0">
            <video
              src={selectedVideo}
              autoPlay
              controls
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
      <Hero
        title1="Our"
        title2="Portfolio."
        subtitle="A curated archive of our most distinguishable visual narratives."
        showButton={false}
      />
      <div className="py-24 px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          {/* Photography Section */}
          <div className="mb-24 md:mb-32">
            <div className="portfolio-section-title flex flex-col md:flex-row md:justify-between md:items-end mb-8 md:mb-16 gap-4">
              <h2 className="text-offwhite text-4xl sm:text-5xl md:text-8xl font-sans font-bold tracking-tighter uppercase leading-none">
                Photo<span className="text-signal italic">graphy.</span>
              </h2>
              <div className="text-offwhite/40 md:text-offwhite/20 font-mono text-[8px] md:text-[10px] uppercase tracking-[0.3rem] md:tracking-[0.5rem]">
                Archive // Batch 01
              </div>
            </div>

            <div className="portfolio-grid grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {photography.map((item, idx) => (
                <PortfolioItem key={idx} {...item} />
              ))}
            </div>
          </div>

          {/* Videography Section */}
          <div className="mb-24 md:mb-32">
            <div className="portfolio-section-title flex flex-col md:flex-row md:justify-between md:items-end mb-8 md:mb-16 gap-4">
              <h2 className="text-offwhite text-4xl sm:text-5xl md:text-8xl font-sans font-bold tracking-tighter uppercase leading-none">
                Video<span className="text-signal italic">graphy.</span>
              </h2>
              <div className="text-offwhite/40 md:text-offwhite/20 font-mono text-[8px] md:text-[10px] uppercase tracking-[0.3rem] md:tracking-[0.5rem]">
                Transmission // Live
              </div>
            </div>

            <div className="portfolio-grid grid grid-cols-1 gap-4 md:gap-8">
              {videography.map((item, idx) => (
                <PortfolioItem key={idx} {...item} onSelect={setSelectedVideo} />
              ))}
            </div>
          </div>

          {/* Corporate Section */}
          <div className="mb-24 md:mb-32">
            <div className="portfolio-section-title flex flex-col md:flex-row md:justify-between md:items-end mb-8 md:mb-16 gap-4">
              <h2 className="text-offwhite text-4xl sm:text-5xl md:text-8xl font-sans font-bold tracking-tighter uppercase leading-none">
                Corpo<span className="text-signal italic">rate.</span>
              </h2>
              <div className="text-offwhite/40 md:text-offwhite/20 font-mono text-[8px] md:text-[10px] uppercase tracking-[0.3rem] md:tracking-[0.5rem]">
                Commercial // Enterprise
              </div>
            </div>

            <div className="portfolio-grid grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {corporate.map((item, idx) => (
                <PortfolioItem key={idx} {...item} onSelect={setSelectedVideo} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Membership />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <main className="relative bg-offwhite selection:bg-signal selection:text-offwhite">
        <div className="noise-overlay"></div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Routes>
        <Footer />
      </main>
    </Router>
  );
};

export default App;
