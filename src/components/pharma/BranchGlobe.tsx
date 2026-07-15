import { motion } from "framer-motion";

const branches = [
  { name: "New York", x: 26, y: 38, active: true },
  { name: "London", x: 48, y: 32, active: true },
  { name: "Dubai", x: 60, y: 46, active: true },
  { name: "Singapore", x: 74, y: 56, active: true },
  { name: "Tokyo", x: 82, y: 40, active: true },
  { name: "São Paulo", x: 34, y: 68, active: false },
  { name: "Sydney", x: 84, y: 74, active: true },
  { name: "Cape Town", x: 54, y: 72, active: false },
];

export function BranchGlobe() {
  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden rounded-3xl glass shadow-float">
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <radialGradient id="grad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="oklch(0.75 0.16 210 / 0.4)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="line" x1="0%" x2="100%">
            <stop offset="0%" stopColor="oklch(0.6 0.18 235 / 0)" />
            <stop offset="50%" stopColor="oklch(0.6 0.18 235 / 0.7)" />
            <stop offset="100%" stopColor="oklch(0.6 0.18 235 / 0)" />
          </linearGradient>
        </defs>
        <rect width="100" height="60" fill="url(#grad)" />
        {/* Latitude/longitude grid */}
        {[10, 20, 30, 40, 50].map((y) => (
          <line key={`h${y}`} x1="0" x2="100" y1={y} y2={y} stroke="oklch(0.55 0.18 240 / 0.08)" strokeWidth="0.15" />
        ))}
        {[10, 25, 40, 55, 70, 85].map((x) => (
          <line key={`v${x}`} x1={x} x2={x} y1="0" y2="60" stroke="oklch(0.55 0.18 240 / 0.08)" strokeWidth="0.15" />
        ))}
        {/* Dotted continents feel */}
        {Array.from({ length: 260 }).map((_, i) => {
          const x = (i * 37) % 100;
          const y = (i * 53) % 60;
          return <circle key={i} cx={x} cy={y} r="0.25" fill="oklch(0.55 0.18 240 / 0.18)" />;
        })}
        {/* Connections */}
        {branches.slice(0, 5).map((b, i) => {
          const next = branches[(i + 1) % 5];
          return (
            <line key={i} x1={b.x} y1={b.y} x2={next.x} y2={next.y} stroke="url(#line)" strokeWidth="0.25" />
          );
        })}
      </svg>
      {branches.map((b, i) => (
        <div key={b.name} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
          <div className="relative">
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ background: b.active ? "oklch(0.75 0.16 210 / 0.5)" : "oklch(0.7 0.02 250 / 0.4)" }}
              animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.25 }}
            />
            <div className={`relative h-2.5 w-2.5 rounded-full ${b.active ? "bg-[oklch(0.6_0.18_235)] shadow-[0_0_12px_oklch(0.6_0.18_235)]" : "bg-muted-foreground/60"}`} />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-medium text-foreground/80">{b.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
