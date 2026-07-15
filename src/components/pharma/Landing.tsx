import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Activity, Package, AlertTriangle, TrendingUp, Pill, Sparkles, Mic, ShieldCheck, Layers, Waves, ArrowUpRight, ChevronRight,
} from "lucide-react";
import { HeroScene, MoleculeScene, ShowcaseScene } from "./Scene3D";
import { AnimatedCounter } from "./AnimatedCounter";
import { BranchGlobe } from "./BranchGlobe";
import syringePhoto from "@/assets/syringe.jpg";

function ShowcaseMedia({ item, priority = false }: { item: "capsule" | "bottle" | "syringe" | "tablet"; priority?: boolean }) {
  if (item === "syringe") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={syringePhoto}
          alt="Precision-dose medical syringe"
          width={1024}
          height={1024}
          loading={priority ? undefined : "lazy"}
          className="h-full w-full object-contain drop-shadow-[0_10px_30px_oklch(0.55_0.18_240/0.25)]"
        />
      </div>
    );
  }
  return <ShowcaseScene item={item} />;
}

function GlowOrb({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} />;
}

function StockRing({ percent, color = "oklch(0.6 0.18 235)" }: { percent: number; color?: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-16 w-16">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r={r} stroke="oklch(0.55 0.18 240 / 0.12)" strokeWidth="5" fill="none" />
        <motion.circle
          cx="32" cy="32" r={r} stroke={color} strokeWidth="5" fill="none" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (c * percent) / 100 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">{percent}%</div>
    </div>
  );
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 15 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 15 });

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SparkChart({ color = "oklch(0.6 0.18 235)" }: { color?: string }) {
  const points = [8, 14, 10, 18, 15, 22, 19, 28, 24, 32, 30, 38, 34, 42];
  const max = 44;
  const w = 200, h = 60;
  const step = w / (points.length - 1);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h}`).join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={area} fill="url(#sg)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} />
      <motion.path
        d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: "easeOut" }}
      />
    </svg>
  );
}

function BarChart() {
  const bars = [42, 68, 55, 82, 74, 92, 78, 96];
  return (
    <div className="flex h-24 items-end gap-2">
      {bars.map((b, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-md"
          style={{ background: "linear-gradient(180deg, oklch(0.75 0.16 210), oklch(0.6 0.18 235))" }}
          initial={{ height: 0 }}
          whileInView={{ height: `${b}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: i * 0.05, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function AIAssistantOrb() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute h-40 w-40 rounded-full border border-[oklch(0.6_0.18_235)]/40"
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
          />
        ))}
      </div>
      <motion.div
        className="relative flex h-40 w-40 items-center justify-center rounded-full"
        style={{ background: "radial-gradient(circle at 30% 30%, oklch(0.85 0.14 215), oklch(0.55 0.18 240))", boxShadow: "0 0 60px oklch(0.6 0.18 235 / 0.6), inset 0 0 30px oklch(1 0 0 / 0.4)" }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-14 w-14 text-white" strokeWidth={1.5} />
      </motion.div>
    </div>
  );
}

function VoiceWave() {
  return (
    <div className="flex h-10 items-center gap-1">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-[oklch(0.6_0.18_235)]"
          animate={{ height: [6, 22, 10, 30, 8, 16, 6] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function Shelf() {
  const shelves = [
    [88, 72, 95, 60, 84, 78],
    [45, 92, 68, 88, 74, 55],
    [72, 60, 88, 76, 42, 90],
  ];
  return (
    <div className="glass rounded-3xl p-6 shadow-float">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Warehouse A · Aisle 3</p>
          <h4 className="text-lg font-semibold">Live Inventory Shelves</h4>
        </div>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-xs text-muted-foreground">Sync live</span>
        </div>
      </div>
      <div className="space-y-3">
        {shelves.map((row, r) => (
          <div key={r} className="rounded-xl border border-border/60 bg-white/40 p-3">
            <div className="flex items-end justify-between gap-2">
              {row.map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <motion.div
                    className="w-full rounded-md"
                    style={{ background: "linear-gradient(180deg, oklch(0.95 0.02 220), oklch(0.75 0.16 210))" }}
                    initial={{ height: 0 }}
                    whileInView={{ height: h * 0.7 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: (r * 6 + i) * 0.04 }}
                  />
                  <span className="text-[9px] font-mono text-muted-foreground">{h}</span>
                </div>
              ))}
            </div>
            <div className="mt-1 h-[3px] rounded-full bg-[oklch(0.6_0.18_235)]/40" />
          </div>
        ))}
      </div>
    </div>
  );
}

const inventory = [
  { name: "Amoxicillin 500mg", supplier: "Pfizer", stock: 78, expiry: "312d", item: "capsule" as const, code: "AMX-500" },
  { name: "Insulin Glargine", supplier: "Sanofi", stock: 42, expiry: "94d", item: "syringe" as const, code: "INS-GLR" },
  { name: "Paracetamol 500mg", supplier: "Bayer", stock: 92, expiry: "540d", item: "tablet" as const, code: "PCM-500" },
  { name: "Vitamin D3 Drops", supplier: "Novartis", stock: 24, expiry: "48d", item: "bottle" as const, code: "VD3-25" },
];

const showcase = [
  { label: "Capsules", desc: "Time-release enteric coating", item: "capsule" as const },
  { label: "Tablets", desc: "Bioengineered film-coated", item: "tablet" as const },
  { label: "Syringes", desc: "Precision-dose auto-inject", item: "syringe" as const },
  { label: "Bottles", desc: "Sealed sterile suspensions", item: "bottle" as const },
];

export function Landing() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient background */}
      <GlowOrb className="left-[-10%] top-[-10%] h-[520px] w-[520px] bg-[oklch(0.75_0.16_210/0.35)]" />
      <GlowOrb className="right-[-15%] top-[20%] h-[600px] w-[600px] bg-[oklch(0.6_0.18_235/0.25)]" />
      <GlowOrb className="left-[30%] top-[60%] h-[480px] w-[480px] bg-[oklch(0.85_0.14_215/0.28)]" />

      {/* Nav */}
      <header className="sticky top-0 z-40 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl glass shadow-glow">
            <Pill className="h-5 w-5 text-[oklch(0.55_0.18_240)]" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Aether Pharma OS</div>
            <div className="text-[11px] text-muted-foreground">Intelligent healthcare cloud</div>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#showcase" className="hover:text-foreground">Products</a>
          <a href="#inventory" className="hover:text-foreground">Inventory</a>
          <a href="#analytics" className="hover:text-foreground">Analytics</a>
          <a href="#network" className="hover:text-foreground">Network</a>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full glass px-3 py-1.5 text-xs md:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span className="font-mono tabular-nums">{now}</span>
          </div>
          <button className="rounded-full bg-[oklch(0.18_0.02_250)] px-4 py-2 text-xs font-medium text-white shadow-float transition hover:opacity-90">
            Launch App
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 pb-16 pt-8 lg:grid-cols-12 lg:pt-16">
        <div className="absolute inset-0 -z-10 medical-grid" />
        <div className="lg:col-span-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-[oklch(0.4_0.1_240)]">
            <Sparkles className="h-3.5 w-3.5" /> AI Pharmacy OS · v12.4
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.05 }}
            className="mt-5 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
          >
            The Future of <br />
            <span className="text-gradient">Pharmacy Management</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15 }}
            className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg"
          >
            Intelligent inventory, real-time analytics, and healthcare operations —
            unified in one beautifully engineered experience.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button className="group inline-flex items-center gap-2 rounded-full bg-[oklch(0.18_0.02_250)] px-6 py-3 text-sm font-medium text-white shadow-float transition hover:translate-y-[-1px]">
              Explore Dashboard <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium">
              Watch Demo <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
            {[
              { k: "Prescriptions", v: 128430, s: "+12.4% MoM" },
              { k: "Active SKUs", v: 4820, s: "In 42 branches" },
              { k: "Uptime", v: 99.99, s: "Global SLA", decimals: 2, suffix: "%" },
            ].map((s) => (
              <div key={s.k} className="glass rounded-2xl px-4 py-3">
                <div className="text-2xl font-semibold tracking-tight">
                  <AnimatedCounter value={s.v} decimals={s.decimals ?? 0} suffix={s.suffix ?? ""} />
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.k}</div>
                <div className="text-[10px] text-[oklch(0.55_0.18_240)]">{s.s}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative aspect-square w-full">
            <HeroScene />
            {/* Holographic overlays */}
            <div className="pointer-events-none absolute left-2 top-8 rounded-2xl glass px-3 py-2 text-[11px] shadow-glow">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Compound</div>
              <div className="font-semibold">C₁₆H₁₉N₃O₅S</div>
            </div>
            <div className="pointer-events-none absolute bottom-6 right-2 rounded-2xl glass px-3 py-2 text-[11px] shadow-glow">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span className="font-medium">FDA verified · Batch #A-2049</span>
              </div>
            </div>
            <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 rounded-2xl glass px-3 py-2 text-[11px] shadow-glow">
              <div className="font-mono text-[10px] uppercase text-muted-foreground">Temp</div>
              <div className="font-semibold">2 – 8 °C</div>
            </div>
          </div>
        </div>
      </section>

      {/* ANALYTICS */}
      <section id="analytics" className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-widest text-[oklch(0.55_0.18_240)]">Live Operations</div>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Analytics that read like a heartbeat.</h2>
          </div>
          <div className="hidden gap-1.5 rounded-full glass px-3 py-1.5 text-xs md:flex">
            <Waves className="h-3.5 w-3.5" /> Streaming
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <TiltCard className="col-span-1 rounded-3xl glass p-6 shadow-float lg:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Activity className="h-4 w-4" /> Daily Sales</div>
                <div className="mt-3 text-5xl font-semibold tracking-tight">
                  $<AnimatedCounter value={284920} />
                </div>
                <div className="mt-1 text-xs text-emerald-600">▲ 18.2% vs yesterday</div>
              </div>
              <div className="rounded-full glass px-2.5 py-1 text-[10px] font-mono">24h</div>
            </div>
            <div className="mt-4"><SparkChart /></div>
          </TiltCard>

          <TiltCard className="rounded-3xl glass p-6 shadow-float">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Package className="h-4 w-4" /> Inventory Health</div>
            <div className="mt-4 flex items-center gap-4">
              <StockRing percent={87} />
              <div>
                <div className="text-3xl font-semibold">Optimal</div>
                <div className="text-xs text-muted-foreground">4,204 / 4,820 SKUs</div>
              </div>
            </div>
          </TiltCard>

          <TiltCard className="rounded-3xl glass p-6 shadow-float">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><AlertTriangle className="h-4 w-4 text-amber-500" /> Low Stock</div>
            <div className="mt-3 text-4xl font-semibold"><AnimatedCounter value={38} /></div>
            <div className="mt-3 space-y-1.5 text-xs">
              {["Insulin Glargine", "Vitamin D3 Drops", "Metformin 850mg"].map((n) => (
                <div key={n} className="flex items-center justify-between rounded-lg bg-amber-500/5 px-2 py-1">
                  <span>{n}</span><span className="font-mono text-amber-600">↓</span>
                </div>
              ))}
            </div>
          </TiltCard>

          <TiltCard className="rounded-3xl glass p-6 shadow-float lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><TrendingUp className="h-4 w-4" /> Monthly Revenue</div>
              <div className="text-xs font-medium text-[oklch(0.55_0.18_240)]">Q4 · 2035</div>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <div className="text-5xl font-semibold tracking-tight">$<AnimatedCounter value={4.82} decimals={2} />M</div>
              <div className="text-xs text-emerald-600">▲ 24.1%</div>
            </div>
            <div className="mt-4"><BarChart /></div>
          </TiltCard>

          <TiltCard className="rounded-3xl glass p-6 shadow-float lg:col-span-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Layers className="h-4 w-4" /> Expiring Products</div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[{ n: "≤ 30d", v: 12, c: "oklch(0.6 0.22 25)" }, { n: "≤ 90d", v: 46, c: "oklch(0.75 0.18 60)" }, { n: "≤ 180d", v: 128, c: "oklch(0.6 0.18 235)" }].map((e) => (
                <div key={e.n} className="rounded-2xl border border-border/60 bg-white/50 p-4">
                  <div className="text-xs text-muted-foreground">{e.n}</div>
                  <div className="mt-1 text-3xl font-semibold" style={{ color: e.c }}><AnimatedCounter value={e.v} /></div>
                  <div className="mt-2 h-1 rounded-full" style={{ background: `${e.c}30` }}>
                    <motion.div className="h-full rounded-full" style={{ background: e.c }} initial={{ width: 0 }} whileInView={{ width: `${(e.v / 128) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1.2 }} />
                  </div>
                </div>
              ))}
            </div>
          </TiltCard>
        </div>
      </section>

      {/* MOLECULE + AI */}
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 py-16 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl glass p-8 shadow-float">
          <div className="pointer-events-none absolute inset-0 medical-grid opacity-60" />
          <div className="relative">
            <div className="text-xs font-medium uppercase tracking-widest text-[oklch(0.55_0.18_240)]">Molecular Insight</div>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight">Every compound, understood.</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">Real-time molecular fingerprints, interaction modeling and safety profiles rendered directly into the operator view.</p>
          </div>
          <div className="relative -mx-4 h-[380px]">
            <MoleculeScene />
          </div>
          <div className="relative grid grid-cols-3 gap-3 text-xs">
            {[{ k: "Bonds", v: 14 }, { k: "Atoms", v: 32 }, { k: "Stability", v: "98%" }].map((s) => (
              <div key={s.k} className="rounded-xl glass-dark px-3 py-2">
                <div className="text-muted-foreground">{s.k}</div>
                <div className="text-lg font-semibold">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.18_0.02_250)] to-[oklch(0.28_0.08_260)] p-8 text-white shadow-float">
          <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(oklch(0.75 0.16 210 / 0.5) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
          <div className="relative">
            <div className="text-xs font-medium uppercase tracking-widest text-[oklch(0.82_0.15_210)]">Aether Assistant</div>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight">Your on-call<br /> healthcare intelligence.</h3>
          </div>
          <div className="relative my-8 flex items-center justify-center">
            <AIAssistantOrb />
          </div>
          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-xs text-white/70">
              <Mic className="h-4 w-4" /> Listening…
              <span className="ml-auto font-mono">02:14</span>
            </div>
            <div className="mt-3"><VoiceWave /></div>
            <div className="mt-3 text-sm">"Reorder <span className="font-semibold text-[oklch(0.82_0.15_210)]">Insulin Glargine</span> for Branch 03 — priority overnight."</div>
          </div>
        </div>
      </section>

      {/* 3D SHOWCASE */}
      <section id="showcase" className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-widest text-[oklch(0.55_0.18_240)]">Product Universe</div>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Handled in every form.</h2>
          </div>
          <p className="hidden max-w-sm text-sm text-muted-foreground md:block">From capsule to syringe — each dosage form modeled in 3D, tracked in real time.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {showcase.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-3xl glass p-4 shadow-float transition hover:-translate-y-1"
            >
              <div className="relative h-56 w-full">
                <ShowcaseMedia item={s.item} />
              </div>
              <div className="mt-2 flex items-center justify-between px-2 pb-2">
                <div>
                  <div className="text-base font-semibold">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background transition group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* INVENTORY */}
      <section id="inventory" className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-widest text-[oklch(0.55_0.18_240)]">Floating Inventory</div>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Every SKU, alive on your screen.</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2">
            {inventory.map((it, i) => (
              <motion.div
                key={it.code}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="group relative overflow-hidden rounded-3xl glass p-5 shadow-float transition hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-mono text-muted-foreground">{it.code}</div>
                    <div className="mt-0.5 text-base font-semibold">{it.name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{it.supplier}</div>
                  </div>
                  <StockRing percent={it.stock} color={it.stock < 30 ? "oklch(0.6 0.22 25)" : it.stock < 60 ? "oklch(0.75 0.18 60)" : "oklch(0.6 0.18 235)"} />
                </div>
                <div className="mt-3 h-32">
                  <ShowcaseMedia item={it.item} />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="rounded-full glass px-2 py-0.5 text-muted-foreground">Expiry · <span className="font-semibold text-foreground">{it.expiry}</span></span>
                  <span className="inline-flex items-center gap-1 text-[oklch(0.55_0.18_240)]">Trace lot <ChevronRight className="h-3 w-3" /></span>
                </div>
              </motion.div>
            ))}
          </div>
          <Shelf />
        </div>
      </section>

      {/* NETWORK */}
      <section id="network" className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-widest text-[oklch(0.55_0.18_240)]">Global Network</div>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">42 branches. One nervous system.</h2>
          </div>
          <div className="hidden gap-4 md:flex">
            {[{ k: "Live nodes", v: 38 }, { k: "In sync", v: "100%" }, { k: "Latency", v: "24ms" }].map((s) => (
              <div key={s.k} className="rounded-2xl glass px-4 py-2 text-right">
                <div className="text-xs text-muted-foreground">{s.k}</div>
                <div className="text-lg font-semibold">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <BranchGlobe />
      </section>

      {/* CTA / Footer */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[oklch(0.55_0.18_240)] to-[oklch(0.75_0.16_210)] p-10 text-white shadow-float sm:p-16">
          <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(oklch(1 0 0 / 0.4) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="relative max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-widest text-white/70">Aether Pharma OS</div>
            <h3 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">A luxury healthcare experience — engineered for the next decade.</h3>
            <p className="mt-4 text-white/80">One intelligent platform for inventory, analytics, compliance and clinical operations. Designed with the precision of medicine and the calm of great software.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[oklch(0.2_0.04_260)] shadow-float hover:opacity-95">Request Access</button>
              <button className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-medium backdrop-blur-xl">Read Whitepaper</button>
            </div>
          </div>
        </div>
        <footer className="mt-10 flex flex-col items-start justify-between gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span>© 2035 Aether Pharma OS · A concept portfolio project</span>
          </div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Compliance</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </footer>
      </section>
    </div>
  );
}
