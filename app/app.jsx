// app.jsx — root component, starfield, parallax, tweaks panel.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "dusk",
  "typography": "elegant",
  "density": "regular",
  "moonSize": 420,
  "starDensity": 1,
  "showOrbit": true,
  "useNasaMoon": false,
  "cursorTilt": true
}/*EDITMODE-END*/;

const PALETTES = {
  dusk: {
    label: 'Dusk (default)',
    '--night-1': '#0a0a18',
    '--night-2': '#131330',
    '--night-3': '#1f1d4a',
    '--moon': '#f5e6c8',
    '--moon-cool': '#e8e4f5',
    '--cream': '#f4ecdc',
    '--cream-soft': '#d9d3c4',
    '--muted': '#8a85a8',
    '--accent': '#f5e6c8',
    '--line': 'rgba(245, 230, 200, 0.14)',
  },
  midnight: {
    label: 'Midnight indigo',
    '--night-1': '#04050d',
    '--night-2': '#0c0e22',
    '--night-3': '#161a3d',
    '--moon': '#e8e4f5',
    '--moon-cool': '#cfc8ed',
    '--cream': '#ece9f5',
    '--cream-soft': '#bfb8d4',
    '--muted': '#6f6a8a',
    '--accent': '#a59cff',
    '--line': 'rgba(232, 228, 245, 0.12)',
  },
  eclipse: {
    label: 'Eclipse (warm)',
    '--night-1': '#100a14',
    '--night-2': '#1d1320',
    '--night-3': '#3a2236',
    '--moon': '#ffd49b',
    '--moon-cool': '#f6c4c2',
    '--cream': '#f6e4d3',
    '--cream-soft': '#d8c2ad',
    '--muted': '#9a7e7c',
    '--accent': '#ffb877',
    '--line': 'rgba(255, 212, 155, 0.16)',
  },
  aurora: {
    label: 'Aurora',
    '--night-1': '#04141a',
    '--night-2': '#0a232a',
    '--night-3': '#0f3a3a',
    '--moon': '#c4f5d8',
    '--moon-cool': '#a4e6df',
    '--cream': '#e6f5ec',
    '--cream-soft': '#b5d3c5',
    '--muted': '#5e8c84',
    '--accent': '#7fe6c2',
    '--line': 'rgba(196, 245, 216, 0.14)',
  },
};

const TYPOGRAPHY = {
  elegant: {
    label: 'Elegant (Cormorant + Inter)',
    '--serif': '"Cormorant Garamond", "Times New Roman", serif',
    '--sans': '"Inter", system-ui, sans-serif',
    '--mono': '"JetBrains Mono", ui-monospace, monospace',
  },
  modern: {
    label: 'Editorial (Fraunces + Inter)',
    '--serif': '"Fraunces", "Times New Roman", serif',
    '--sans': '"Inter", system-ui, sans-serif',
    '--mono': '"JetBrains Mono", ui-monospace, monospace',
  },
  classic: {
    label: 'Classic (Instrument + Inter)',
    '--serif': '"Instrument Serif", "Times New Roman", serif',
    '--sans': '"Inter", system-ui, sans-serif',
    '--mono': '"JetBrains Mono", ui-monospace, monospace',
  },
};

// ── Starfield canvas ────────────────────────────────────────────────────────
function useStarfield(densityMultiplier = 1) {
  React.useEffect(() => {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;
    let stars = [];
    let raf = null;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      seed();
    }

    function seed() {
      const area = window.innerWidth * window.innerHeight;
      const count = Math.floor((area / 4500) * densityMultiplier);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: (Math.random() * 1.4 + 0.2) * dpr,
        a: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.85 ? 'cream' : 'cool',
      }));
    }

    function draw(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const tw = Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.3 + 0.7;
        const a = s.a * tw;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.hue === 'cool'
          ? `rgba(232, 228, 245, ${a})`
          : `rgba(245, 230, 200, ${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener('resize', resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [densityMultiplier]);
}

// ── Parallax scroll value ───────────────────────────────────────────────────
function useParallax() {
  const [y, setY] = React.useState(0);
  React.useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setY(window.scrollY);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return y;
}

// ── Cursor tilt (parallax based on mouse position) ──────────────────────────
function useCursorTilt(enabled) {
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    if (!enabled) { setTilt({ x: 0, y: 0 }); return; }
    let raf = null;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;   // -1..1
        const y = (e.clientY / window.innerHeight) * 2 - 1;  // -1..1
        setTilt({ x, y });
        raf = null;
      });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);
  return tilt;
}

// ── App ─────────────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const parallaxY = useParallax();
  const tilt = useCursorTilt(t.cursorTilt);
  useStarfield(t.starDensity);

  // Apply palette + typography vars on :root
  React.useEffect(() => {
    const palette = PALETTES[t.palette] || PALETTES.dusk;
    const typo = TYPOGRAPHY[t.typography] || TYPOGRAPHY.elegant;
    const root = document.documentElement;
    Object.entries(palette).forEach(([k, v]) => { if (k.startsWith('--')) root.style.setProperty(k, v); });
    Object.entries(typo).forEach(([k, v]) => { if (k.startsWith('--')) root.style.setProperty(k, v); });
  }, [t.palette, t.typography]);

  React.useEffect(() => {
    document.body.dataset.density = t.density;
  }, [t.density]);

  // Apply moon size + orbit visibility via CSS vars
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--moon-size', t.moonSize + 'px');
  }, [t.moonSize]);

  return (
    <>
      <style>{`
        .moon { width: var(--moon-size, 420px); height: var(--moon-size, 420px); }
        .orbit { display: ${t.showOrbit ? 'block' : 'none'}; }
        .orbit-2 { display: ${t.showOrbit ? 'block' : 'none'}; }
      `}</style>

      <Nav />
      <Hero parallaxY={parallaxY} tilt={tilt} useNasaMoon={t.useNasaMoon} />
      <PhaseDivider />
      <About />
      <PhaseDivider />
      <Experience />
      <PhaseDivider />
      <SelectedWork />
      <PhaseDivider />
      <Loves />
      <PhaseDivider />
      <Contact />
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette" />
        <TweakSelect
          label="Color theme"
          value={t.palette}
          options={Object.entries(PALETTES).map(([v, p]) => ({ value: v, label: p.label }))}
          onChange={(v) => setTweak('palette', v)}
        />

        <TweakSection label="Typography" />
        <TweakSelect
          label="Font pairing"
          value={t.typography}
          options={Object.entries(TYPOGRAPHY).map(([v, p]) => ({ value: v, label: p.label }))}
          onChange={(v) => setTweak('typography', v)}
        />

        <TweakSection label="Layout" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={['cozy', 'regular', 'airy']}
          onChange={(v) => setTweak('density', v)}
        />

        <TweakSection label="Moon" />
        <TweakToggle
          label="Use NASA photo"
          value={t.useNasaMoon}
          onChange={(v) => setTweak('useNasaMoon', v)}
        />
        <TweakToggle
          label="Cursor tilt"
          value={t.cursorTilt}
          onChange={(v) => setTweak('cursorTilt', v)}
        />
        <TweakSlider
          label="Moon size"
          value={t.moonSize}
          min={240}
          max={520}
          step={20}
          unit="px"
          onChange={(v) => setTweak('moonSize', v)}
        />
        <TweakToggle
          label="Show orbit lines"
          value={t.showOrbit}
          onChange={(v) => setTweak('showOrbit', v)}
        />

        <TweakSection label="Stars" />
        <TweakSlider
          label="Density"
          value={t.starDensity}
          min={0.3}
          max={2}
          step={0.1}
          onChange={(v) => setTweak('starDensity', v)}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
