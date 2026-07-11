import { useState, useEffect, useRef, useMemo } from "react";
import { Heart, Sparkles, Cake, PartyPopper, ChevronDown, Gift } from "lucide-react";

/* ======================================================================
   PENGATURAN — ganti bagian ini sesuai teman kamu ✨
   ====================================================================== */
const NAME = "Aura";               // nama teman ulang tahun
const FROM_NAME = "Bagas, A.Md.Kom";               // nama kamu (pengirim ucapan)
const BIRTH_DATE = new Date(2005, 6, 13, 0, 0, 0); // 13 Juli 2005 (bulan: 0=Jan, jadi 6=Juli)
const MESSAGE = `Selamat bertambah usia, Aura!

Semoga di umur yang baru ini kamu selalu sehat, bahagia, dan semua yang kamu usahakan bisa tercapai. Jangan terlalu takut sama hal-hal yang kamu takuti, kadang semuanya nggak seburuk yang dibayangin.

Terus, kurang-kurangin asbunnya, lebih produktif lagi. Semoga tahun ini jadi tahun terbaik buat kamu. Semoga selalu dikelilingin orang baik.

Selamat Merayakan Hari Istimewamu.
`;
const REPLY_WHATSAPP = ""; // opsional: isi nomor WA Aura (format 62xxxxxxxxxx, tanpa + atau spasi) biar muncul tombol "Balas ucapan ini". Kosongkan untuk sembunyikan tombolnya.

/* ====================================================================== */

const MESSAGE_PARAGRAPHS = MESSAGE.trim().split(/\n\s*\n/);

function diffYMD(from, to) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

/* ---------- Scroll reveal (buat surat dibuka paragraf demi paragraf) ---------- */
function useReveal(threshold = 0.35) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function RevealParagraph({ text, index }) {
  const [ref, inView] = useReveal(0.3);
  return (
    <p
      ref={ref}
      className={`letter-para${inView ? " in-view" : ""}`}
      style={{ transitionDelay: `${index * 0.18}s` }}
    >
      {text}
    </p>
  );
}

const PETAL_EMOJI = ["🌸", "🌺", "🌼", "🌷", "💮", "🌻"];
const PETAL_COLORS = ["#FF6F9C", "#B183F4", "#FFD166", "#6BCB77", "#FFA3C0"];

function Petal({ size, color, angle, delay }) {
  const style = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: size * 0.44,
    height: size * 0.62,
    marginLeft: -(size * 0.22),
    marginTop: -(size * 0.62),
    transform: `rotate(${angle}deg)`,
    transformOrigin: "50% 100%",
  };
  return (
    <div style={style}>
      <div
        className="petal-shape"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${color} 0%, ${color}CC 70%, ${color}99 100%)`,
          animationDelay: `${delay}s`,
        }}
      />
    </div>
  );
}

function Flower({ size = 70, color = "#FF6F9C", centerColor = "#FFD166", delay = 0, wobble = 0 }) {
  const petalCount = 6;
  return (
    <div
      className="flower-bloom"
      style={{
        width: size,
        height: size,
        position: "relative",
        animationDelay: `${delay}s`,
        ["--wobble"]: `${wobble}deg`,
      }}
    >
      {Array.from({ length: petalCount }).map((_, i) => (
        <Petal
          key={i}
          size={size}
          color={color}
          angle={i * (360 / petalCount)}
          delay={delay + i * 0.06}
        />
      ))}
      <div
        className="flower-center"
        style={{
          width: size * 0.3,
          height: size * 0.3,
          background: `radial-gradient(circle at 35% 30%, ${centerColor}, ${centerColor}CC)`,
          animationDelay: `${delay + 0.35}s`,
        }}
      />
    </div>
  );
}

function StatCard({ label, value, icon, featured = false }) {
  return (
    <div className={`stat-card${featured ? " featured" : ""}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ---------- Bloom-reveal wrapper: signature "mekar saat discroll" motion ---------- */
function Bloom({ as: Tag = "div", className = "", children, ...rest }) {
  const [ref, inView] = useReveal(0.18);
  return (
    <Tag ref={ref} className={`bloom${inView ? " in-view" : ""} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/* ---------- Divider ornament antar section ---------- */
function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <span className="divider-line" />
      <Sparkles size={14} />
      <span className="divider-line" />
    </div>
  );
}

/* ---------- Kembang api saat lilin ditiup ---------- */
function Fireworks({ bursts }) {
  if (!bursts.length) return null;
  return (
    <div className="fireworks-layer" aria-hidden="true">
      {bursts.map((b) => (
        <div key={b.id} className="firework-burst" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
          {b.particles.map((p, i) => (
            <span
              key={i}
              className="firework-particle"
              style={{
                background: p.color,
                color: p.color,
                ["--fx"]: `${p.dx}px`,
                ["--fy"]: `${p.dy}px`,
                animationDelay: `${b.delay}s`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function BirthdayWebsite() {
  const [now, setNow] = useState(new Date());
  const [blown, setBlown] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [fireworks, setFireworks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // sedikit delay biar transisi CSS sempat "ready" sebelum kelas is-loaded aktif
    const raf = requestAnimationFrame(() => {
      const t = setTimeout(() => setLoaded(true), 60);
      return () => clearTimeout(t);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const petals = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 18,
        duration: 13 + Math.random() * 12,
        size: 16 + Math.random() * 18,
        emoji: PETAL_EMOJI[Math.floor(Math.random() * PETAL_EMOJI.length)],
        spin: 8 + Math.random() * 10,
      })),
    []
  );

  const stars = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3,
      })),
    []
  );

  const diffMs = Math.max(0, now - BIRTH_DATE);
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalDays = Math.floor(totalSeconds / 86400);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalWeeks = Math.floor(totalDays / 7);
  const heartbeats = Math.floor((totalSeconds / 60) * 75);
  const fullMoons = Math.floor(totalDays / 29.53);

  const { years, months, days } = diffYMD(BIRTH_DATE, now);

  const isToday =
    now.getMonth() === BIRTH_DATE.getMonth() && now.getDate() === BIRTH_DATE.getDate();

  let nextBirthday = new Date(now.getFullYear(), BIRTH_DATE.getMonth(), BIRTH_DATE.getDate());
  if (nextBirthday < now && !isToday) {
    nextBirthday = new Date(now.getFullYear() + 1, BIRTH_DATE.getMonth(), BIRTH_DATE.getDate());
  }
  const cdMs = Math.max(0, nextBirthday - now);
  const cdDays = Math.floor(cdMs / 86400000);
  const cdHours = Math.floor((cdMs % 86400000) / 3600000);
  const cdMinutes = Math.floor((cdMs % 3600000) / 60000);
  const cdSeconds = Math.floor((cdMs % 60000) / 1000);

  function handleBlow() {
    const pieces = Array.from({ length: 70 }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      left: 50 + (Math.random() * 90 - 45),
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      delay: Math.random() * 0.35,
      duration: 1.8 + Math.random() * 1.4,
      rotate: Math.random() * 360,
      drift: Math.random() * 220 - 110,
      size: 6 + Math.random() * 7,
    }));
    setConfetti(pieces);

    const burstOrigins = [
      { x: 28, y: 32, delay: 0 },
      { x: 72, y: 24, delay: 0.18 },
      { x: 50, y: 42, delay: 0.34 },
    ];
    const bursts = burstOrigins.map((origin, bi) => ({
      id: `${Date.now()}-${bi}`,
      x: origin.x,
      y: origin.y,
      delay: origin.delay,
      particles: Array.from({ length: 22 }).map((_, i) => {
        const angle = (i / 22) * Math.PI * 2;
        const radius = 60 + Math.random() * 50;
        return {
          dx: Math.cos(angle) * radius,
          dy: Math.sin(angle) * radius,
          color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        };
      }),
    }));
    setFireworks(bursts);
    setTimeout(() => setFireworks([]), 1800);
    setBlown(true);
  }

  return (
    <div className={`app${loaded ? " is-loaded" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Quicksand:wght@400;500;600;700&family=Caveat:wght@600;700&display=swap');

        * { box-sizing: border-box; }

        .app {
          --bg-deep: #1C1130;
          --bg-deep2: #2A1A47;
          --bg-glow: #3D2361;
          --pink: #FF6F9C;
          --pink-light: #FFA3C0;
          --violet: #B183F4;
          --marigold: #FFD166;
          --leaf: #6BCB77;
          --cream: #FFF6EA;
          --cream-dim: rgba(255, 246, 234, 0.72);
          --cream-dim2: rgba(255, 246, 234, 0.5);

          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
          background:
            radial-gradient(ellipse 90% 50% at 14% 12%, rgba(107,203,119,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 70% 45% at 88% 62%, rgba(255,111,156,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 120% 60% at 50% 0%, var(--bg-glow) 0%, transparent 60%),
            linear-gradient(180deg, var(--bg-deep) 0%, var(--bg-deep2) 45%, var(--bg-deep) 100%);
          color: var(--cream);
          font-family: 'Quicksand', sans-serif;
          cursor: default;
          -webkit-tap-highlight-color: transparent;
        }

        /* subtle film-grain + vignette for depth, sits above bg, below content */
        .app::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.5;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
        }
        .app::after {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(ellipse 80% 65% at 50% 45%, transparent 55%, rgba(12,6,24,0.55) 100%);
        }

        .app h1, .app h2, .app h3, .app .display {
          font-family: 'Fredoka', sans-serif;
          margin: 0;
        }

        /* ---------- Ambient layers ---------- */
        .stars-layer, .petals-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 1;
          opacity: 0;
          transition: opacity 2.4s ease;
        }
        .app.is-loaded .stars-layer, .app.is-loaded .petals-layer {
          opacity: 1;
          transition-delay: 0.4s;
        }

        /* ---------- Intro reveal: hero masuk bertahap, bukan langsung "meledak" ---------- */
        .hero > * {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity .85s ease, transform .85s ease;
        }
        .app.is-loaded .hero > * { opacity: 1; transform: translateY(0); }
        .app.is-loaded .hero > *:nth-child(1) { transition-delay: .05s; }
        .app.is-loaded .hero > *:nth-child(2) { transition-delay: .35s; }
        .app.is-loaded .hero > *:nth-child(3) { transition-delay: .5s; }
        .app.is-loaded .hero > *:nth-child(4) { transition-delay: .68s; }
        .app.is-loaded .hero > *:nth-child(5) { transition-delay: .82s; }
        .app.is-loaded .hero > *:nth-child(6) { transition-delay: .95s; }
        
        /* ---------- Bloom reveal: setiap section "mekar" saat masuk viewport ---------- */
        .bloom {
          opacity: 0;
          transform: translateY(26px) scale(0.965) rotate(-0.6deg);
          transition: opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1);
          will-change: transform, opacity;
        }
        .bloom.in-view {
          opacity: 1;
          transform: translateY(0) scale(1) rotate(0deg);
        }

        /* ---------- Divider ornament ---------- */
        .divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.9rem;
          max-width: 320px;
          margin: 0 auto;
          padding: 0 1.5rem;
          color: var(--marigold);
          opacity: 0.75;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,209,102,0.45), transparent);
        }

        .star {
          position: absolute;
          border-radius: 50%;
          background: var(--cream);
          animation: twinkle linear infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.9; }
        }
        .petal-fall {
          position: absolute;
          top: -10vh;
          animation: fall linear infinite;
          will-change: transform;
        }
        @keyframes fall {
          from { transform: translateY(-10vh) rotate(0deg); }
          to { transform: translateY(115vh) rotate(360deg); }
        }

        /* ---------- Flower bloom ---------- */
        .flower-bloom {
          animation: bloomIn 0.7s cubic-bezier(.34,1.56,.64,1) backwards, sway 6s ease-in-out infinite;
        }
        @keyframes bloomIn {
          from { transform: scale(0) rotate(-15deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(calc(var(--wobble, 0deg) * -1)); }
          50% { transform: rotate(var(--wobble, 0deg)); }
        }
        .petal-shape {
          width: 100%;
          height: 100%;
          border-radius: 50% 50% 50% 50% / 65% 65% 35% 35%;
          animation: petalPop .5s cubic-bezier(.34,1.56,.64,1) backwards;
          transform-origin: 50% 100%;
          box-shadow: 0 0 10px rgba(255,255,255,0.08);
        }
        @keyframes petalPop {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .flower-center {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: centerPop .4s ease-out forwards;
          animation-fill-mode: forwards;
          box-shadow: 0 0 14px rgba(255, 209, 102, 0.6);
        }
        @keyframes centerPop {
          from { transform: translate(-50%, -50%) scale(0); }
          to { transform: translate(-50%, -50%) scale(1); }
        }

        /* ---------- Layout ---------- */
        section {
          position: relative;
          z-index: 2;
          padding: clamp(2.5rem, 6vw, 6rem) clamp(1.25rem, 5vw, 3rem);
          max-width: 1100px;
          margin: 0 auto;
        }

        .hero {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: clamp(1rem, 3vw, 1.75rem);
        }
        .bouquet {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: clamp(-10px, -1vw, 4px);
          margin-bottom: clamp(0.5rem, 2vw, 1rem);
          flex-wrap: wrap;
        }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: clamp(0.75rem, 2vw, 0.95rem);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--pink-light);
          font-weight: 600;
        }
        .hero h1 {
          font-size: clamp(2.4rem, 8vw, 5rem);
          font-weight: 700;
          line-height: 1.08;
          background: linear-gradient(100deg, var(--cream) 20%, var(--pink-light) 55%, var(--marigold) 90%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-wrap: balance;
        }
        .hero .name {
          display: block;
          color: var(--marigold);
          -webkit-text-fill-color: var(--marigold);
        }
        .hero p.sub {
          max-width: 42ch;
          font-size: clamp(1rem, 2.4vw, 1.2rem);
          color: var(--cream-dim);
          line-height: 1.6;
        }
        .date-pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1.3rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.16);
          backdrop-filter: blur(6px);
          font-weight: 600;
          font-size: clamp(0.85rem, 2vw, 1rem);
          isolation: isolate;
        }

        .scroll-cue {
          margin-top: clamp(1.5rem, 4vw, 3rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          color: var(--cream-dim2);
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Quicksand', sans-serif;
          font-size: 0.85rem;
        }
        .scroll-cue svg { animation: bounce 1.6s ease-in-out infinite; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }

        /* ---------- Section headers ---------- */
        .section-head {
          text-align: center;
          margin-bottom: clamp(2rem, 5vw, 3rem);
        }
        .section-head h2 {
          font-size: clamp(1.8rem, 5vw, 2.6rem);
          font-weight: 600;
          color: var(--cream);
        }
        .section-head p {
          color: var(--cream-dim);
          margin-top: 0.5rem;
          font-size: clamp(0.95rem, 2vw, 1.05rem);
        }
        .section-head .accent { color: var(--pink-light); }

        /* ---------- Stats ---------- */
        .big-age {
          text-align: center;
          margin-bottom: clamp(2rem, 5vw, 3rem);
        }
        .big-age .num {
          font-size: clamp(3rem, 12vw, 6.5rem);
          font-weight: 700;
          line-height: 1;
          color: var(--marigold);
          text-shadow: 0 0 30px rgba(255,209,102,0.35);
        }
        .big-age .label {
          font-size: clamp(1rem, 2.4vw, 1.3rem);
          color: var(--cream-dim);
          margin-top: 0.5rem;
        }
        .stats-featured {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: clamp(0.9rem, 2.4vw, 1.4rem);
          margin-bottom: clamp(0.8rem, 2vw, 1.2rem);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: clamp(0.7rem, 1.8vw, 1rem);
        }
        /* ---------- Glassmorphism: stat cards ---------- */
        .stat-card {
          position: relative;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 22px;
          padding: clamp(1.1rem, 2.6vw, 1.5rem) 1rem;
          text-align: center;
          overflow: hidden;
          backdrop-filter: blur(22px) saturate(160%);
          -webkit-backdrop-filter: blur(22px) saturate(160%);
          box-shadow: 0 8px 40px rgba(20, 8, 40, 0.3), inset 0 1px 0 rgba(255,255,255,0.14);
          transition: transform .25s ease, background .25s ease, box-shadow .25s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.12);
          box-shadow: 0 12px 44px rgba(20, 8, 40, 0.34), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .stat-card.featured {
          padding: clamp(1.6rem, 4vw, 2.1rem) 1.2rem;
          background: linear-gradient(160deg, rgba(255,111,156,0.2), rgba(177,131,244,0.16));
          border: 1px solid rgba(255,255,255,0.26);
        }
        .stat-card.featured .stat-value {
          font-size: clamp(1.7rem, 4.6vw, 2.4rem);
          text-shadow: 0 0 24px rgba(255,209,102,0.25);
        }
        .stat-icon { color: var(--pink-light); margin-bottom: 0.5rem; display: flex; justify-content: center; }
        .stat-value {
          font-family: 'Fredoka', sans-serif;
          font-size: clamp(1.3rem, 3.4vw, 1.8rem);
          font-weight: 600;
          color: var(--cream);
        }
        .stat-label {
          font-size: 0.8rem;
          color: var(--cream-dim2);
          margin-top: 0.3rem;
          letter-spacing: 0.03em;
        }

        /* ---------- Countdown ---------- */
        .countdown-wrap {
          text-align: center;
        }
        .countdown-grid {
          display: flex;
          justify-content: center;
          gap: clamp(0.6rem, 3vw, 1.5rem);
          flex-wrap: wrap;
          margin-top: 1.5rem;
        }
        .cd-box {
          background: linear-gradient(160deg, rgba(177,131,244,0.18), rgba(255,111,156,0.14));
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 18px;
          padding: clamp(1rem, 3vw, 1.5rem) clamp(0.9rem, 3vw, 1.4rem);
          min-width: 80px;
        }
        .cd-box .cd-num {
          font-family: 'Fredoka', sans-serif;
          font-size: clamp(1.6rem, 5vw, 2.4rem);
          font-weight: 700;
          color: var(--cream);
        }
        .cd-box .cd-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--cream-dim2);
          margin-top: 0.3rem;
        }
        .today-banner {
          font-size: clamp(1.4rem, 4vw, 2rem);
          font-weight: 700;
          color: var(--marigold);
          display: flex;
          align-items: center;
          gap: 0.6rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* ---------- Letter (glassmorphism) ---------- */
        .letter {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 28px;
          padding: clamp(1.8rem, 5vw, 3.5rem);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(22px) saturate(160%);
          -webkit-backdrop-filter: blur(22px) saturate(160%);
          box-shadow: 0 8px 40px rgba(20, 8, 40, 0.3), inset 0 1px 0 rgba(255,255,255,0.14);
        }
        .letter::before {
          content: '"';
          position: absolute;
          top: -0.5rem;
          left: 1.2rem;
          font-family: 'Fredoka', sans-serif;
          font-size: 8rem;
          color: rgba(255,111,156,0.15);
          line-height: 1;
        }
        .letter-para {
          font-family: 'Caveat', cursive;
          font-size: clamp(1.3rem, 3.2vw, 1.75rem);
          line-height: 1.6;
          color: var(--cream);
          white-space: pre-line;
          position: relative;
          z-index: 1;
          margin: 0 0 1.1rem;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity .8s ease, transform .8s ease;
        }
        .letter-para:last-of-type { margin-bottom: 0; }
        .letter-para.in-view {
          opacity: 1;
          transform: translateY(0);
        }
        .letter .sign {
          margin-top: 1.5rem;
          text-align: right;
          font-family: 'Caveat', cursive;
          font-size: clamp(1.4rem, 3.6vw, 1.9rem);
          color: var(--pink-light);
          position: relative;
          z-index: 1;
        }

        /* ---------- Cake ---------- */
        .cake-section { text-align: center; }
        .cake-wrap {
          position: relative;
          display: inline-block;
          margin-top: 1rem;
          cursor: pointer;
          user-select: none;
          transition: transform .3s ease;
        }
        .cake-wrap::before {
          content: '';
          position: absolute;
          inset: -18%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,209,102,0.28) 0%, transparent 70%);
          animation: cakeGlow 2.6s ease-in-out infinite;
          z-index: -1;
        }
        @keyframes cakeGlow {
          0%, 100% { opacity: 0.5; transform: scale(0.92); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
        .cake-wrap:hover { transform: scale(1.03); }
        .cake-svg { width: clamp(180px, 45vw, 260px); height: auto; display: block; }
        .flame {
          transform-origin: bottom center;
          animation: flicker 0.6s ease-in-out infinite alternate;
        }
        @keyframes flicker {
          from { transform: scaleY(1) rotate(-2deg); }
          to { transform: scaleY(1.15) rotate(2deg); }
        }
        .cake-hint {
          margin-top: 1rem;
          color: var(--cream-dim2);
          font-size: 0.9rem;
        }
        .blown-msg {
          margin-top: 1.2rem;
          font-family: 'Fredoka', sans-serif;
          font-size: clamp(1.1rem, 3vw, 1.4rem);
          color: var(--marigold);
        }
        .reply-cta {
          margin-top: 1.2rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.4rem;
          border-radius: 999px;
          background: rgba(255,111,156,0.16);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
          color: var(--cream);
          font-weight: 600;
          font-size: 0.92rem;
          text-decoration: none;
          transition: transform .2s ease, background .2s ease;
        }
        .reply-cta:hover {
          transform: translateY(-2px);
          background: rgba(255,111,156,0.26);
        }
        .reply-cta svg { color: var(--pink); }

        /* ---------- Confetti ---------- */
        .confetti-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 50;
          overflow: hidden;
        }
        .confetti-piece {
          position: absolute;
          top: 45%;
          border-radius: 2px;
          animation: confettiBurst ease-out forwards;
        }
        @keyframes confettiBurst {
          0% { transform: translate(0,0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--dx), 70vh) rotate(var(--rot)); opacity: 0; }
        }

        /* ---------- Fireworks ---------- */
        .fireworks-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 55;
          overflow: hidden;
        }
        .firework-burst {
          position: absolute;
          width: 0;
          height: 0;
        }
        .firework-particle {
          position: absolute;
          top: 0; left: 0;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          box-shadow: 0 0 8px 1px currentColor;
          animation: fireworkPop 1.1s cubic-bezier(.15,.7,.3,1) forwards;
        }
        @keyframes fireworkPop {
          0% { transform: translate(0,0) scale(1); opacity: 1; }
          75% { opacity: 1; }
          100% { transform: translate(var(--fx), calc(var(--fy) + 40px)) scale(0.3); opacity: 0; }
        }

        /* ---------- Footer ---------- */
        footer {
          text-align: center;
          padding: clamp(2rem, 5vw, 3rem) 1.5rem clamp(3rem, 6vw, 4rem);
          color: var(--cream-dim2);
          font-size: 0.9rem;
          position: relative;
          z-index: 2;
        }
        footer .heart { color: var(--pink); display:inline-flex; vertical-align:-3px; }

        /* ---------- Responsif: layar sangat sempit ---------- */
        @media (max-width: 420px) {
          .bouquet { transform: scale(0.8); margin-bottom: -0.5rem; }
          .stats-featured { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .countdown-grid { gap: 0.5rem; }
          .cd-box { min-width: 64px; padding: 0.8rem 0.6rem; }
          .letter { padding: 1.4rem 1.1rem; border-radius: 22px; }
          .letter::before { font-size: 5.5rem; }
          .divider { max-width: 220px; }
        }

        /* ---------- Responsif: landscape pendek (mis. HP diputar) ---------- */
        @media (max-height: 480px) and (orientation: landscape) {
          .hero { min-height: auto; padding-top: 3rem; padding-bottom: 3rem; }
          .bouquet { transform: scale(0.7); }
          .scroll-cue { margin-top: 1rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .flower-bloom, .petal-shape, .flower-center, .petal-fall, .star, .scroll-cue svg, .flame,
          .cake-wrap::before, .firework-particle {
            animation: none !important;
          }
          .hero > *, .stars-layer, .petals-layer, .letter-para, .bloom {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .fireworks-layer { display: none !important; }
        }
      `}</style>

      {/* Ambient background layers */}
      <div className="stars-layer">
        {stars.map((s) => (
          <div
            key={s.id}
            className="star"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>
      <div className="petals-layer">
        {petals.map((p) => (
          <div
            key={p.id}
            className="petal-fall"
            style={{
              left: `${p.left}%`,
              fontSize: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      <Fireworks bursts={fireworks} />

      {confetti.length > 0 && (
        <div className="confetti-layer">
          {confetti.map((c) => (
            <div
              key={c.id}
              className="confetti-piece"
              style={{
                left: `${c.left}%`,
                width: c.size,
                height: c.size * 1.6,
                background: c.color,
                animationDuration: `${c.duration}s`,
                animationDelay: `${c.delay}s`,
                ["--dx"]: `${c.drift}px`,
                ["--rot"]: `${c.rotate}deg`,
              }}
            />
          ))}
        </div>
      )}

      {/* HERO */}
      <section className="hero">
        <div className="bouquet">
          <Flower size={56} color="#B183F4" delay={0.05} wobble={4} />
          <Flower size={78} color="#FF6F9C" centerColor="#FFD166" delay={0.2} wobble={3} />
          <Flower size={64} color="#FFD166" centerColor="#FF6F9C" delay={0.12} wobble={5} />
          <Flower size={80} color="#FFA3C0" centerColor="#FFD166" delay={0.28} wobble={3} />
          <Flower size={58} color="#6BCB77" centerColor="#FFF6EA" delay={0.18} wobble={4} />
        </div>

        <span className="eyebrow">
          <Sparkles size={16} /> Hari ketika dunia kembali merayakan kehadiranmu
        </span>
        <h1>
          Selamat Ulang Tahun
          <span className="name">{NAME}!</span>
        </h1>
        <p className="sub">
          Seakan telah direncanakan sejak lama, semesta menghadirkan keindahannya hari ini untuk menyambut bertambahnya usiamu.
        </p>
        <div className="date-pill">
          <Cake size={18} color="#FFD166" />
          13 Juli 2005
        </div>

        <button
          className="scroll-cue"
          onClick={() => statsRef.current?.scrollIntoView({ behavior: "smooth" })}
        >
          Gulir ke bawah
          <ChevronDown size={20} />
        </button>
      </section>

      {/* STATS */}
      <section ref={statsRef}>
        <Bloom className="big-age">
          <div className="num">
            {years}
            <span style={{ fontSize: "0.4em", color: "var(--cream-dim)" }}> tahun</span>
          </div>
          <div className="label">
            {months} bulan, {days} hari sudah kamu jalani sejak lahir
          </div>
        </Bloom>

        <Bloom className="section-head">
          <h2>Setiap detik, kamu sedang <span className="accent">menulis cerita</span></h2>
          <p>Sejak detak pertama di 13 Juli 2005, semesta sudah mencatat semuanya.</p>
        </Bloom>

        <Bloom className="stats-featured">
          <StatCard
            label="Kali jantungmu berdetak"
            value={heartbeats.toLocaleString("id-ID")}
            icon={<Heart size={22} />}
            featured
          />
          <StatCard
            label="Purnama yang sudah kamu lewati"
            value={fullMoons.toLocaleString("id-ID")}
            icon={<Sparkles size={22} />}
            featured
          />
        </Bloom>

        <Bloom className="stats-grid">
          <StatCard label="Hari yang sudah kamu jalani" value={totalDays.toLocaleString("id-ID")} icon={<Sparkles size={18} />} />
          <StatCard label="Minggu yang sudah kamu lewati" value={totalWeeks.toLocaleString("id-ID")} icon={<Gift size={18} />} />
          <StatCard label="Jam yang sudah kamu habiskan" value={totalHours.toLocaleString("id-ID")} icon={<Sparkles size={18} />} />
          <StatCard label="Detik yang sudah kamu lalui" value={totalSeconds.toLocaleString("id-ID")} icon={<Heart size={18} />} />
        </Bloom>
      </section>

      <Divider />

      {/* COUNTDOWN */}
      <section className="countdown-wrap">
        <Bloom className="section-head">
          <h2>{isToday ? "Sekarang adalah harinya! 🎉" : "Menuju hari spesial berikutnya"}</h2>
          {!isToday && <p>Hitung mundur menuju ulang tahunmu selanjutnya.</p>}
        </Bloom>

        {isToday ? (
          <Bloom className="today-banner">
            <PartyPopper color="#FFD166" /> Selamat ulang tahun, hari ini harimu! <PartyPopper color="#FFD166" />
          </Bloom>
        ) : (
          <Bloom className="countdown-grid">
            <div className="cd-box">
              <div className="cd-num">{cdDays}</div>
              <div className="cd-label">Hari</div>
            </div>
            <div className="cd-box">
              <div className="cd-num">{pad(cdHours)}</div>
              <div className="cd-label">Jam</div>
            </div>
            <div className="cd-box">
              <div className="cd-num">{pad(cdMinutes)}</div>
              <div className="cd-label">Menit</div>
            </div>
            <div className="cd-box">
              <div className="cd-num">{pad(cdSeconds)}</div>
              <div className="cd-label">Detik</div>
            </div>
          </Bloom>
        )}
      </section>

      <Divider />

      {/* LETTER */}
      <section>
        <Bloom className="section-head">
          <h2>Sepucuk <span className="accent">surat kecil</span> untukmu</h2>
        </Bloom>
        <Bloom className="letter">
          {MESSAGE_PARAGRAPHS.map((para, i) => (
            <RevealParagraph key={i} text={para} index={i} />
          ))}
          <div className="sign">— {FROM_NAME}</div>
        </Bloom>
      </section>

      <Divider />

      {/* CAKE */}
      <section className="cake-section">
        <Bloom className="section-head">
          <h2>Tiup lilinnya, buat satu harapan 🕯️</h2>
        </Bloom>

        <div className="cake-wrap" onClick={handleBlow}>
          <svg viewBox="0 0 200 180" className="cake-svg">
            <ellipse cx="100" cy="160" rx="80" ry="14" fill="#7A4FC7" opacity="0.35" />
            <rect x="35" y="110" width="130" height="45" rx="10" fill="#FF6F9C" />
            <rect x="35" y="110" width="130" height="12" rx="6" fill="#FFA3C0" />
            <rect x="45" y="80" width="110" height="35" rx="10" fill="#B183F4" />
            <rect x="45" y="80" width="110" height="10" rx="5" fill="#CBA9FA" />
            <rect x="60" y="55" width="80" height="30" rx="9" fill="#FFD166" />
            <rect x="60" y="55" width="80" height="9" rx="4.5" fill="#FFE3A0" />
            {[70, 100, 130].map((x, i) => (
              <g key={i}>
                <rect x={x - 2.5} y="35" width="5" height="22" fill="#FFF6EA" />
                {!blown && (
                  <ellipse className="flame" cx={x} cy="30" rx="5" ry="9" fill="#FFB238">
                    <animate attributeName="fill" values="#FFB238;#FF6F3C;#FFB238" dur="0.5s" repeatCount="indefinite" />
                  </ellipse>
                )}
              </g>
            ))}
            {[55, 90, 110, 145].map((x, i) => (
              <circle key={i} cx={x} cy="130" r="4" fill={["#FFD166", "#6BCB77", "#B183F4", "#FF6F9C"][i]} />
            ))}
          </svg>
        </div>

        {!blown ? (
          <p className="cake-hint">(klik kuenya untuk meniup lilin)</p>
        ) : (
          <>
            <p className="blown-msg">✨ Semoga yang disemogakan tersemogakan, {NAME}! ✨</p>
            {REPLY_WHATSAPP && (
              <a
                className="reply-cta"
                href={`https://wa.me/${REPLY_WHATSAPP}?text=${encodeURIComponent(
                  `Makasih ya ucapannya, ${FROM_NAME}! 🥹`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Heart size={16} fill="currentColor" /> Balas ucapan ini
              </a>
            )}
          </>
        )}
      </section>

      <footer>
        Dibuat dengan seluruh niat untuk {NAME}
      </footer>
    </div>
  );
}