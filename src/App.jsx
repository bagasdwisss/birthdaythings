import { useState, useEffect, useRef, useMemo } from "react";
import { Heart, Sparkles, Cake, PartyPopper, ChevronDown, Gift } from "lucide-react";

/* ======================================================================
   PENGATURAN — ganti bagian ini sesuai teman kamu ✨
   ====================================================================== */
const NAME = "Aura";              // nama teman ulang tahun
const FROM_NAME = "Bagas";               // nama kamu (pengirim ucapan)
const BIRTH_DATE = new Date(2005, 6, 13, 0, 0, 0); // 13 Juli 2005 (bulan: 0=Jan, jadi 6=Juli)
const MESSAGE = `Selamat ulang tahun, Aura! 🥳

Semoga di umur yang baru ini kamu selalu sehat, bahagia, dan semua yang kamu usahakan bisa tercapai. Jangan terlalu takut sama hal-hal yang kamu takuti, kadang semuanya nggak seburuk yang dibayangin.

Terus, kurang-kurangin asbunnya, lebih produktif lagi, sama jangan keseringan main anonymous. Semoga tahun ini jadi tahun terbaik buat kamu. Semoga selalu dikelilingin orang baik

Happy birthday! 🎂🎉
`;

/* ====================================================================== */

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

function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function BirthdayWebsite() {
  const [now, setNow] = useState(new Date());
  const [blown, setBlown] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const statsRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
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
    const pieces = Array.from({ length: 40 }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      left: 50 + (Math.random() * 60 - 30),
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      delay: Math.random() * 0.3,
      duration: 1.6 + Math.random() * 1.2,
      rotate: Math.random() * 360,
      drift: Math.random() * 140 - 70,
      size: 6 + Math.random() * 6,
    }));
    setConfetti(pieces);
    setBlown(true);
  }

  return (
    <div className="app">
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
            radial-gradient(ellipse 120% 60% at 50% 0%, var(--bg-glow) 0%, transparent 60%),
            linear-gradient(180deg, var(--bg-deep) 0%, var(--bg-deep2) 45%, var(--bg-deep) 100%);
          color: var(--cream);
          font-family: 'Quicksand', sans-serif;
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
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1.3rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(6px);
          font-weight: 600;
          font-size: clamp(0.85rem, 2vw, 1rem);
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
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: clamp(0.8rem, 2vw, 1.2rem);
        }
        .stat-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: clamp(1.2rem, 3vw, 1.6rem) 1rem;
          text-align: center;
          transition: transform .25s ease, background .25s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.08);
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

        /* ---------- Letter ---------- */
        .letter {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 28px;
          padding: clamp(1.8rem, 5vw, 3.5rem);
          position: relative;
          overflow: hidden;
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
        .letter p {
          font-family: 'Caveat', cursive;
          font-size: clamp(1.3rem, 3.2vw, 1.75rem);
          line-height: 1.6;
          color: var(--cream);
          white-space: pre-line;
          position: relative;
          z-index: 1;
        }
        .letter .sign {
          margin-top: 1.5rem;
          text-align: right;
          font-family: 'Caveat', cursive;
          font-size: clamp(1.4rem, 3.6vw, 1.9rem);
          color: var(--pink-light);
        }

        /* ---------- Cake ---------- */
        .cake-section { text-align: center; }
        .cake-wrap {
          position: relative;
          display: inline-block;
          margin-top: 1rem;
          cursor: pointer;
          user-select: none;
        }
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

        @media (prefers-reduced-motion: reduce) {
          .flower-bloom, .petal-shape, .flower-center, .petal-fall, .star, .scroll-cue svg, .flame {
            animation: none !important;
          }
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
          <Sparkles size={16} /> hari yang sudah lama ditunggu
        </span>
        <h1>
          Selamat Ulang Tahun
          <span className="name">{NAME}!</span>
        </h1>
        <p className="sub">
          Sebuah taman kecil penuh bunga, khusus ditanam untuk merayakan hari kelahiranmu.
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
        <div className="big-age">
          <div className="num">
            {years}
            <span style={{ fontSize: "0.4em", color: "var(--cream-dim)" }}> tahun</span>
          </div>
          <div className="label">
            {months} bulan, {days} hari sudah kamu jalani sejak lahir
          </div>
        </div>

        <div className="section-head">
          <h2>Perjalanan hidupmu <span className="accent">sejauh ini</span></h2>
          <p>Dihitung langsung dari detik ke detik, sejak 13 Juli 2005.</p>
        </div>

        <div className="stats-grid">
          <StatCard label="Total hari" value={totalDays.toLocaleString("id-ID")} icon={<Sparkles size={20} />} />
          <StatCard label="Total minggu" value={totalWeeks.toLocaleString("id-ID")} icon={<Gift size={20} />} />
          <StatCard label="Total jam" value={totalHours.toLocaleString("id-ID")} icon={<Sparkles size={20} />} />
          <StatCard label="Total detik" value={totalSeconds.toLocaleString("id-ID")} icon={<Heart size={20} />} />
          <StatCard label="Perkiraan detak jantung" value={heartbeats.toLocaleString("id-ID")} icon={<Heart size={20} />} />
          <StatCard label="Purnama yang terlewati" value={fullMoons.toLocaleString("id-ID")} icon={<Sparkles size={20} />} />
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="countdown-wrap">
        <div className="section-head">
          <h2>{isToday ? "Sekarang adalah harinya! 🎉" : "Menuju hari spesial berikutnya"}</h2>
          {!isToday && <p>Hitung mundur menuju ulang tahunmu selanjutnya.</p>}
        </div>

        {isToday ? (
          <div className="today-banner">
            <PartyPopper color="#FFD166" /> Selamat ulang tahun, hari ini harimu! <PartyPopper color="#FFD166" />
          </div>
        ) : (
          <div className="countdown-grid">
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
          </div>
        )}
      </section>

      {/* LETTER */}
      <section>
        <div className="section-head">
          <h2>Sepucuk <span className="accent">surat kecil</span> untukmu</h2>
        </div>
        <div className="letter">
          <p>{MESSAGE}</p>
          <div className="sign">— {FROM_NAME}</div>
        </div>
      </section>

      {/* CAKE */}
      <section className="cake-section">
        <div className="section-head">
          <h2>Tiup lilinnya, buat satu harapan 🕯️</h2>
        </div>

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
          <p className="blown-msg">✨ Semoga yang disemogakan tersemogakan, {NAME}! ✨</p>
        )}
      </section>

      <footer>
        Dibuat dengan <span className="heart"><Heart size={14} fill="currentColor" /></span> untuk {NAME}
      </footer>
    </div>
  );
}
