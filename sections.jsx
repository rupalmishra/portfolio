// sections.jsx — section components for the portfolio
// All components are exported to window so app.jsx can use them.

// ── Reveal-on-scroll wrapper ────────────────────────────────────────────────
function Crater({ cx, cy, r }) {
  // Realistic crater: dark basin shadow + bright rim highlight (sun upper-left).
  return (
    <g>
      {/* basin shadow offset toward sun-side, rim highlight on dark side */}
      <circle cx={cx} cy={cy} r={r} fill="rgba(0,0,0,0.45)" />
      <circle cx={cx - r * 0.18} cy={cy - r * 0.18} r={r * 0.85} fill="url(#craterShadow)" opacity="0.9" />
      <circle cx={cx + r * 0.22} cy={cy + r * 0.22} r={r * 0.5} fill="url(#craterRim)" opacity="0.7" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="0.4" />
    </g>
  );
}
function Reveal({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const reveal = () => {
      if (cancelled) return;
      // Two rAFs: ensure the opacity:0 initial state has painted before we
      // toggle .in, so the transition kicks off cleanly. Without this, some
      // browsers skip the transition entirely (computed opacity stays 0).
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled) return;
          if (delay > 0) setTimeout(() => { if (!cancelled) el.classList.add('in'); }, delay);
          else el.classList.add('in');
        });
      });
    };
    // If already in viewport at mount (common for hero), reveal right away.
    const r = el.getBoundingClientRect();
    const inView = r.top < window.innerHeight && r.bottom > 0;
    if (inView) {
      reveal();
      return () => { cancelled = true; };
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal();
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => { cancelled = true; io.disconnect(); };
  }, [delay]);
  return <Tag ref={ref} className={`reveal ${className}`} {...rest}>{children}</Tag>;
}

// ── Top nav ─────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="nav">
      <div className="brand">
        <span className="dot" />
        <span>Rupal&nbsp;Mishra</span>
      </div>
      <ul>
        <li><a href="#work">Work</a></li>
        <li><a href="#loves">Loves</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <div style={{ fontFamily: 'var(--mono)', opacity: 0.7 }}>
        Bengaluru · IST
      </div>
    </nav>
  );
}

// ── Hero ────────────────────────────────────────────────────────────────────
function Hero({ parallaxY, tilt, useNasaMoon }) {
  const tx = (tilt?.x || 0) * 24;
  const ty = (tilt?.y || 0) * 24;
  const rx = (tilt?.y || 0) * -8;
  const ry = (tilt?.x || 0) * 8;
  return (
    <header className="hero" data-screen-label="01 Hero">
      <div className="hero-text">
        <Reveal as="div" className="greet">— Hello, I&apos;m Rupal</Reveal>
        <Reveal as="h1" className="hero-stack">
          <span className="line line-1">
            <span className="word">UX</span>
            <span className="word">Designer</span>
          </span>
          <span className="line line-2">
            <span className="word small-and">and</span>
            <span className="word big">Researcher</span>
          </span>
          <span className="line line-3">
            <span className="stamp stamp-empath">
              <span className="stamp-label">Empath</span>
            </span>
          </span>
        </Reveal>
        <Reveal as="p" className="sub" delay={120}>
          Forms have feelings. Dropdowns have opinions. I just try to listen to both&nbsp;—
          and make enterprise software feel a little more&nbsp;
          <span className="serif-italic" style={{ color: 'var(--moon)' }}>human</span>.
        </Reveal>
      </div>

      <div
        className="moon-stage"
        style={{
          transform: `translateY(${parallaxY * 0.15}px)`,
          perspective: '1200px',
        }}
      >
        <div className="orbit-2" style={{ transform: `translate(${tx * 0.3}px, ${ty * 0.3}px)` }} />
        <div className="orbit" style={{ transform: `translate(${tx * 0.5}px, ${ty * 0.5}px) rotate(var(--orbit-angle, 0deg))` }} />
        <div
          className={`moon ${useNasaMoon ? 'moon-photo' : 'moon-svg'}`}
          style={{
            transform: `translate(${tx}px, ${ty}px) rotateX(${rx}deg) rotateY(${ry}deg)`,
            transition: 'transform 0.18s cubic-bezier(.2,.8,.2,1)',
          }}
        >
          {useNasaMoon ? (
            <div className="moon-photo-inner" />
          ) : (
            <svg className="moon-surface" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                {/* Pale pearly sphere with soft warm core */}
                <radialGradient id="moonGlow" cx="38%" cy="34%" r="72%">
                  <stop offset="0%" stopColor="#fffaf0" />
                  <stop offset="35%" stopColor="#f5ecd8" />
                  <stop offset="70%" stopColor="#dccfa8" />
                  <stop offset="100%" stopColor="#9b8d68" />
                </radialGradient>
                {/* Crescent shadow on the dark side gives volume */}
                <radialGradient id="moonShadow" cx="78%" cy="76%" r="80%">
                  <stop offset="0%" stopColor="#1a1538" stopOpacity="0.6" />
                  <stop offset="55%" stopColor="#1a1538" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#1a1538" stopOpacity="0" />
                </radialGradient>
                {/* Outer halo */}
                <radialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="58%" stopColor="#fff5d8" stopOpacity="0" />
                  <stop offset="76%" stopColor="#fff5d8" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#fff5d8" stopOpacity="0" />
                </radialGradient>
                {/* Soft maria — the dreamy "seas" — barely-there washes */}
                <radialGradient id="maria" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#9d8c66" stopOpacity="0.42" />
                  <stop offset="60%" stopColor="#9d8c66" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#9d8c66" stopOpacity="0" />
                </radialGradient>
                {/* Soft crater shadow — a kiss of darker tone */}
                <radialGradient id="craterSoft" cx="38%" cy="35%" r="55%">
                  <stop offset="0%" stopColor="#7a6d4d" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#7a6d4d" stopOpacity="0" />
                </radialGradient>
                {/* Crater highlight rim — soft, painted feel */}
                <radialGradient id="craterRimSoft" cx="65%" cy="65%" r="55%">
                  <stop offset="0%" stopColor="#fff8e0" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#fff8e0" stopOpacity="0" />
                </radialGradient>
                {/* Subtle painterly grain */}
                <filter id="dreamGrain">
                  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
                  <feColorMatrix values="0 0 0 0 0.55
                                         0 0 0 0 0.5
                                         0 0 0 0 0.38
                                         0 0 0 0.1 0" />
                  <feComposite in2="SourceGraphic" operator="in" />
                </filter>
                <clipPath id="moonClip"><circle cx="200" cy="200" r="190" /></clipPath>
              </defs>

              {/* Outer halo */}
              <circle cx="200" cy="200" r="200" fill="url(#moonHalo)" opacity="0.95" />

              <g clipPath="url(#moonClip)">
                {/* Base glowing sphere */}
                <circle cx="200" cy="200" r="190" fill="url(#moonGlow)" />

                {/* Maria — soft dreamy seas, real positions but painted dreamily */}
                <g opacity="0.7">
                  {/* Imbrium + Procellarum cluster (upper-left) */}
                  <ellipse cx="148" cy="156" rx="58" ry="44" fill="url(#maria)" />
                  <ellipse cx="118" cy="200" rx="46" ry="62" fill="url(#maria)" opacity="0.85" />
                  {/* Serenitatis + Tranquillitatis (right of center) */}
                  <ellipse cx="240" cy="158" rx="42" ry="34" fill="url(#maria)" />
                  <ellipse cx="262" cy="194" rx="36" ry="30" fill="url(#maria)" opacity="0.9" />
                  {/* Crisium (right edge) */}
                  <ellipse cx="306" cy="170" rx="22" ry="18" fill="url(#maria)" opacity="0.95" />
                  {/* Nubium / Humorum (lower) */}
                  <ellipse cx="170" cy="262" rx="44" ry="28" fill="url(#maria)" />
                  <ellipse cx="216" cy="240" rx="22" ry="20" fill="url(#maria)" opacity="0.7" />
                </g>

                {/* Painterly grain on the surface */}
                <rect width="400" height="400" filter="url(#dreamGrain)" opacity="0.55" />

                {/* Soft craters — readable as craters but painted, not stamped */}
                <g>
                  {/* Tycho-ish (south, bright) */}
                  <circle cx="186" cy="296" r="11" fill="url(#craterSoft)" />
                  <circle cx="186" cy="296" r="6" fill="rgba(255,248,224,0.32)" />
                  {/* Copernicus-ish */}
                  <circle cx="158" cy="208" r="8" fill="url(#craterSoft)" />
                  <circle cx="158" cy="208" r="4" fill="rgba(255,248,224,0.22)" />
                  {/* A handful more, varied */}
                  <circle cx="248" cy="118" r="6" fill="url(#craterSoft)" opacity="0.85" />
                  <circle cx="98" cy="240" r="5" fill="url(#craterSoft)" opacity="0.8" />
                  <circle cx="284" cy="234" r="5" fill="url(#craterSoft)" opacity="0.7" />
                  <circle cx="220" cy="276" r="4" fill="url(#craterSoft)" opacity="0.7" />
                  <circle cx="116" cy="310" r="4" fill="url(#craterSoft)" opacity="0.65" />
                  <circle cx="294" cy="124" r="3.5" fill="url(#craterSoft)" opacity="0.7" />
                  <circle cx="68" cy="186" r="3.5" fill="url(#craterSoft)" opacity="0.6" />
                  <circle cx="200" cy="86" r="3" fill="url(#craterSoft)" opacity="0.6" />
                  <circle cx="328" cy="208" r="3" fill="url(#craterSoft)" opacity="0.6" />
                  <circle cx="138" cy="120" r="2.5" fill="url(#craterSoft)" opacity="0.55" />
                  <circle cx="252" cy="312" r="3" fill="url(#craterSoft)" opacity="0.55" />
                  <circle cx="172" cy="232" r="2" fill="url(#craterSoft)" opacity="0.5" />
                  <circle cx="206" cy="194" r="2" fill="url(#craterSoft)" opacity="0.45" />
                </g>

                {/* Crescent shadow (on top) for volume */}
                <circle cx="200" cy="200" r="190" fill="url(#moonShadow)" />

                {/* Lit-side highlight — that soft glowing kiss */}
                <ellipse cx="146" cy="142" rx="62" ry="48" fill="rgba(255,250,232,0.32)" />
                <ellipse cx="128" cy="124" rx="22" ry="16" fill="rgba(255,255,245,0.45)" />

                {/* Edge softness — fade rim into halo */}
                <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,250,232,0.15)" strokeWidth="6" />
              </g>
            </svg>
          )}
        </div>
        {/* Constellation behind the moon (Ursa Major / Big Dipper-inspired) */}
        <svg className="constellation" viewBox="0 0 600 600" aria-hidden="true">
          <g stroke="rgba(245,230,200,0.45)" strokeWidth="0.6" fill="none" strokeLinecap="round">
            {/* A simple constellation arc behind the moon */}
            <path d="M 88 158 L 156 122 L 226 152 L 280 110 L 348 138 L 412 102" />
            <path d="M 226 152 L 240 220" />
            {/* Lower-right small grouping */}
            <path d="M 442 470 L 488 442 L 530 470 L 558 432" />
            {/* Lower-left tiny */}
            <path d="M 92 482 L 132 506 L 178 482" />
          </g>
          {/* Constellation stars (slightly larger, brighter) */}
          <g fill="rgba(255,250,232,0.95)">
            <circle cx="88" cy="158" r="2.2" />
            <circle cx="156" cy="122" r="2.6" />
            <circle cx="226" cy="152" r="2.2" />
            <circle cx="280" cy="110" r="2.8" />
            <circle cx="348" cy="138" r="2.2" />
            <circle cx="412" cy="102" r="2.4" />
            <circle cx="240" cy="220" r="1.8" />
            <circle cx="442" cy="470" r="2.2" />
            <circle cx="488" cy="442" r="2.6" />
            <circle cx="530" cy="470" r="2" />
            <circle cx="558" cy="432" r="2.2" />
            <circle cx="92" cy="482" r="1.8" />
            <circle cx="132" cy="506" r="2.4" />
            <circle cx="178" cy="482" r="2" />
          </g>
          {/* Tiny sprinkled stars around the moon — varied sizes, softer opacity */}
          <g fill="rgba(245,230,200,0.7)">
            <circle cx="48" cy="240" r="1" />
            <circle cx="72" cy="306" r="1.4" />
            <circle cx="32" cy="372" r="1" />
            <circle cx="124" cy="384" r="0.9" />
            <circle cx="68" cy="58" r="1.2" />
            <circle cx="186" cy="46" r="0.9" />
            <circle cx="320" cy="42" r="1.1" />
            <circle cx="496" cy="62" r="1" />
            <circle cx="556" cy="120" r="1.3" />
            <circle cx="572" cy="206" r="0.9" />
            <circle cx="544" cy="296" r="1.1" />
            <circle cx="580" cy="358" r="1" />
            <circle cx="568" cy="558" r="1.2" />
            <circle cx="404" cy="556" r="0.9" />
            <circle cx="284" cy="568" r="1.1" />
            <circle cx="220" cy="544" r="0.9" />
            <circle cx="38" cy="540" r="1" />
            <circle cx="14" cy="446" r="0.8" />
          </g>
          {/* A few twinkling tiny sparkle stars */}
          <g fill="rgba(255,250,232,0.9)">
            <circle cx="380" cy="78" r="0.8">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="3.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="120" cy="218" r="0.8">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="510" cy="360" r="0.9">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="58" cy="170" r="0.8">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2.2s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      </div>
    </header>
  );
}

// ── Phase divider ───────────────────────────────────────────────────────────
function PhaseDivider() {
  return (
    <div className="phase-divider" aria-hidden="true">
      <span className="phase p1" />
      <span className="phase p2" />
      <span className="phase p3" />
      <span className="phase p4" />
      <span className="phase p5" />
    </div>
  );
}

// ── About ───────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" data-screen-label="02 About">
      <Reveal as="div" className="eyebrow">About / 02</Reveal>
      <div className="about-grid">
        <Reveal>
          <div className="about-portrait">
            <img src="assets/rupal-portrait.png" alt="Rupal Mishra" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
            <span className="corner tl" /><span className="corner tr" />
            <span className="corner bl" /><span className="corner br" />
          </div>
          <div className="portrait-caption">
            <div className="portrait-caption-row">
              <span>Rupal Mishra</span>
              <span>Bengaluru</span>
            </div>
            <div className="portrait-caption-note">Chai in the rain, Hindi film music on loop.</div>
          </div>
        </Reveal>
        <Reveal as="div" className="about-text" delay={120}>
          <h2>Design that pays attention, so people don't have to.</h2>
          <p className="lead">
            Most of my work lives inside dense, high-stakes enterprise software — the kind
            people use for eight hours a day, not eight minutes.
          </p>
          <p>
            At Escriba, I'm the UX voice on enterprise workflow platforms trusted by
            companies around the world. I spend most of my time turning tangled,
            decades-old processes into something people can actually navigate.
          </p>
          <p>
            Off the clock, I'm probably gazing at the moon and dreaming about NYC.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ── Selected Work ───────────────────────────────────────────────────────────
const WORKS = [
  {
    num: '01',
    title: 'ECAP File Manager — eFiling',
    tags: ['Enterprise', 'B2B', 'Low-code', 'DMS'],
    link: '#',
    summary:
      'Turned research and audit findings into shipped production features — Save Draft, cross-record file movement, external file sharing, advanced filters, and the Quick Start Dashboard — each one simplifying a core file management task.',
  },
  {
    num: '02',
    title: 'Eve — Period Tracker App',
    tags: ['Mobile UX', 'UX Research', 'Interaction Design'],
    link: 'https://www.behance.net/gallery/219385749/Eve-Period-Tracker-(DTU-ILUX-Design-Hackathon)',
    summary:
      'Designed for the DTU ILUX Design Hackathon — a period tracking app with cycle tracking, mood-based recommendations, journaling, voice notes, and a gentle onboarding flow.',
  },
  {
    num: '03',
    title: 'EventSphere — Event Management Website',
    tags: ['Website', 'UI Design', 'User Flows'],
    link: 'https://www.behance.net/gallery/221368019/Event-Sphere-(VITB-Design-Hackathon-Winner)',
    summary:
      'Built for AdVITya, VIT’s annual fest, and other campus programs — a user-first event management website that stood out for its intuitive flow and accessibility.',
  },
];

function SelectedWork() {
  return (
    <section id="work" data-screen-label="03 Work">
      <div className="work-header">
        <Reveal>
          <div className="eyebrow">Selected work / 03</div>
          <h2>Proof,<br /><span className="serif-italic" style={{ color: 'var(--moon)' }}>not&nbsp;just&nbsp;process.</span></h2>
        </Reveal>
        <Reveal style={{ textAlign: 'right' }} delay={120}>
          <p style={{ fontSize: 14, opacity: 0.7, maxWidth: 320 }}>
            More work lives on <a href="https://www.behance.net/rupalmishra1" target="_blank" rel="noreferrer" style={{ color: 'var(--moon)', borderBottom: '1px solid rgba(245,230,200,0.4)' }}>Behance</a>
          </p>
        </Reveal>
      </div>

      <div className="work-list">
        {WORKS.map((w, i) => (
          <Reveal key={w.num} delay={i * 80}>
            <a className="work-item" href={w.link} target={w.link === '#' ? undefined : '_blank'} rel="noreferrer">
              <div className="work-num">[ {w.num} ]</div>
              <div>
                <div className="work-title">{w.title}</div>
                <p className="work-summary">{w.summary}</p>
              </div>
              <div className="work-meta">
                {w.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      {/* Case studies carousel */}
      <CaseStudyCarousel />
    </section>
  );
}

const CASE_STUDIES = [
  {
    title: 'Empowering Artists with Lok Katha',
    summary:
      'Lok Katha is an app aimed at empowering artists and preserving local art forms. The platform addresses key challenges faced by artists — lack of job opportunities, inadequate recognition, and unfair compensation. By eliminating middlemen, Lok Katha ensures transparent, fair payment directly between artists and clients, while giving new and hidden talent a platform to showcase their work and gain recognition.',
    problems: ['Lack of job opportunities', 'Unfair compensation for artists', 'Limited exposure for local and hidden talent', 'Restricted artist–client direct connections'],
    solutions: ['Direct artist–client connections', 'Job opportunities for artists', 'Empowering local art', 'Fair pay for artists'],
    tags: ['App Design', 'Product Design', 'UX Research'],
    cover: 'assets/cs-lokkatha.jpg',
  },
  {
    title: 'Instagram Stories — A Feature Enhancement Case Study',
    summary:
      'Instagram Stories are popular for sharing moments, but a few limitations hold back the experience — stories vanish after 24 hours, lack editing tools, don\u2019t allow highlight archiving, and often lose quality on upload. This case study proposes enhancements to make stories more engaging, flexible, and visually appealing, grounded in an online survey of 75+ participants.',
    problems: ['Stories disappear after 24 hours', 'No in-app editing tools', 'No highlight archiving', 'Quality loss on upload'],
    solutions: ['Personalized story duration option', 'Basic in-app editing tools', 'Option to archive highlights'],
    tags: ['Feature Design', 'UX Research', 'Survey · 75+ participants'],
  },
];

function CaseStudyCarousel() {
  const [i, setI] = React.useState(0);
  const n = CASE_STUDIES.length;
  const go = (dir) => setI((v) => (v + dir + n) % n);
  return (
    <Reveal>
      <div className="cs-carousel">
        <div className="cs-track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {CASE_STUDIES.map((c, idx) => (
            <div className="cs-card" key={idx}>
              <div className="cs-cover">
                <image-slot id={`cs-cover-${idx}`} placeholder={`${c.title} — cover image`}></image-slot>
              </div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>{`Case study / ${idx + 1} of ${n}`}</div>
              <h3>{c.title}</h3>
              <p style={{ marginTop: 16, fontSize: 15 }}>{c.summary}</p>
              <div className="cs-lists">
                <div>
                  <h4>Problems</h4>
                  <ul className="cs-list">{c.problems.map((p) => <li key={p}>{p}</li>)}</ul>
                </div>
                <div>
                  <h4>Solutions</h4>
                  <ul className="cs-list">{c.solutions.map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="cs-nav cs-prev" onClick={() => go(-1)} aria-label="Previous case study">←</button>
        <button className="cs-nav cs-next" onClick={() => go(1)} aria-label="Next case study">→</button>
        <div className="cs-dots">
          {CASE_STUDIES.map((_, idx) => (
            <span key={idx} className={`cs-dot ${idx === i ? 'active' : ''}`} onClick={() => setI(idx)} />
          ))}
        </div>
      </div>
    </Reveal>
  );
}

// ── Things I Love ───────────────────────────────────────────────────────────
function Loves() {
  return (
    <section id="loves" data-screen-label="04 Loves">
      <Reveal as="div" className="eyebrow">Things I love / 04</Reveal>
      <Reveal as="h2">
        A short, non-comprehensive<br />
        <span className="serif-italic" style={{ color: 'var(--moon)' }}>list of obsessions.</span>
      </Reveal>

      <div className="loves-grid">
        <Reveal as="div" className="love moon-card span-6 tall">
          <div className="love-cap">001 / Sky</div>
          <div>
            <div className="love-title">The moon, persistently.</div>
            <div className="love-sub">
              I keep a folder called "moon_again.heic". It is 2.1&nbsp;GB. I am not sorry.
            </div>
          </div>
        </Reveal>

        <Reveal as="div" className="love travel-card span-6 tall" delay={80}>
          <div className="love-cap">002 / Travel</div>
          <div>
            <div className="love-title">Haven't travelled much. Dream about it constantly.</div>
            <div className="love-sub">
              A running list of places, mostly picked for the way the sky looks there.
            </div>
          </div>
        </Reveal>

        <Reveal as="div" className="love span-4" delay={140}>
          <div className="love-cap">003 / Fiction</div>
          <div>
            <div className="love-title">Novels, and getting a little too attached to their characters.</div>
            <div className="love-sub">
              I finish books and then think about the people in them for weeks.
            </div>
          </div>
        </Reveal>

        <Reveal as="div" className="love span-4" delay={200}>
          <div className="love-cap">004 / Sound</div>
          <div>
            <div className="love-title">Bollywood music, unapologetically on loop.</div>
            <div className="love-sub">
              There's a playlist for every mood, and most of them are old Hindi film songs.
            </div>
          </div>
        </Reveal>

        <Reveal as="div" className="love span-4" delay={260}>
          <div className="love-cap">005 / Games</div>
          <div>
            <div className="love-title">Chess and badminton.</div>
            <div className="love-sub">One for patience, one for taking it out on something.</div>
          </div>
        </Reveal>

        <Reveal as="div" className="love span-12" delay={320}>
          <div className="love-cap">006 / Small things</div>
          <div>
            <div className="love-title">Will travel across town for the right plate of food.</div>
            <div className="love-sub">Good food is the one thing I never compromise on.</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Experience timeline ─────────────────────────────────────────────────────
const TIMELINE = [
  {
    date: 'Apr 2026 — Now',
    role: 'Junior UX Designer',
    co: 'Escriba · Bengaluru · Full-time',
    desc: 'Owned end-to-end UX (research → wireframes → prototypes) for 30+ feature redesigns on ECAP File Manager, used by 1,000+ users across companies in Germany including Siemens and Schindler, partnering closely with 5–6 engineers, 2–3 PMs, and QA across 10–15 releases. Also worked on branding and visual assets, and contributed to other Escriba products including a license management system and a certification app.',
    current: true,
  },
  {
    date: 'Jun 2025 — Mar 2026',
    role: 'UX Design Intern',
    co: 'Escriba · Bengaluru · Internship',
    desc: 'Explored the ECAP platform as-is, then ran user research — personas, journey mapping, competitor analysis — to identify usability gaps across core workflows, and proposed solutions for the team to build on.',
  },
];

function Experience() {
  return (
    <section id="experience" data-screen-label="05 Experience">
      <Reveal as="div" className="eyebrow">Experience / 05</Reveal>
      <Reveal as="h2">
        A small constellation<br />
        <span className="serif-italic" style={{ color: 'var(--moon)' }}>of jobs and detours.</span>
      </Reveal>

      <div className="timeline">
        {TIMELINE.map((t, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className={`timeline-item ${t.current ? 'current' : ''}`}>
              <div className="timeline-date">{t.date}</div>
              <div>
                <div className="timeline-role">{t.role}</div>
                <div className="timeline-co">{t.co}</div>
              </div>
              <div className="timeline-desc">{t.desc}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ── Contact ─────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" className="contact" data-screen-label="06 Contact">
      <Reveal as="div" className="eyebrow" style={{ justifyContent: 'center' }}>Contact / 06</Reveal>
      <Reveal as="h2">
        Let's make<br /><span className="it">something quietly&nbsp;good.</span>
      </Reveal>
      <Reveal delay={120}>
        <p style={{ margin: '0 auto', textAlign: 'center', maxWidth: '46ch', marginTop: 24 }}>
          Open to full-time roles, kind freelance projects, and long emails about
          design systems. Chai and street food chats also welcome — preferably after sunset.
        </p>
      </Reveal>
      <Reveal delay={200}>
        <a className="email" href="mailto:rupalmishra.2003@gmail.com">rupalmishra.2003@gmail.com</a>
      </Reveal>
      <Reveal as="div" className="contact-links" delay={280}>
        <a href="https://www.linkedin.com/in/rupal-mishra-/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        <a href="https://www.behance.net/rupalmishra1" target="_blank" rel="noreferrer">Behance ↗</a>
      </Reveal>
    </section>
  );
}

// ── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer>
      <span>© 2026 · Rupal Mishra · Made under the moon</span>
      <span>v 1.0 · Bengaluru → everywhere</span>
    </footer>
  );
}

Object.assign(window, {
  Reveal, Nav, Hero, PhaseDivider, About, SelectedWork, Loves, Experience, Contact, Footer, CaseStudyCarousel,
});
