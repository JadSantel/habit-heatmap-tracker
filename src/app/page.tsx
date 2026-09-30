import Link from "next/link";

/* ── Demo data ── */
const demoCells = [
  3, 3, 0, 2, 0, 3, 3,
  0, 2, 3, 1, 0, 3, 2,
  3, 0, 2, 0, 3, 3, 1,
  2, 1, 3, 3, 0, 2, 3,
];

const intensityStyles = [
  "rgba(255, 255, 255, 0.04)",   /* empty */
  "rgba(194, 134, 72, 0.22)",    /* light bronze */
  "rgba(210, 155, 85, 0.42)",    /* mid bronze */
  "rgba(218, 172, 104, 0.68)",   /* warm gold */
] as const;

const habits = [
  { label: "Reading", value: "6/7", pct: 86 },
  { label: "Workout", value: "5/7", pct: 71 },
  { label: "Meditation", value: "4/7", pct: 57 },
] as const;

export default function Home() {
  return (
    <main className="landing-page relative flex min-h-screen flex-col items-center overflow-hidden px-5 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
      {/* ── Background ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[#050505]"
      />

      {/* Warm organic shapes — the amber that bleeds through the glass */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-20%] right-[-15%] -z-10 h-[80vh] w-[60vh] rotate-[-30deg] rounded-full opacity-[0.15] blur-[100px]"
        style={{
          background:
            "radial-gradient(ellipse, #c2703a 0%, #8b4513 40%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-10%] left-[-10%] -z-10 h-[50vh] w-[50vh] rounded-full opacity-[0.12] blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, #b8860b 0%, #6b3a00 50%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[35%] left-1/2 -z-10 h-[30vh] w-[40vh] -translate-x-1/2 rounded-full opacity-[0.08] blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, #d4a06a 0%, transparent 70%)",
        }}
      />
      {/* Subtle cool counter-glow for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[10%] left-[20%] -z-10 h-[35vh] w-[35vh] rounded-full opacity-[0.05] blur-[100px]"
        style={{
          background: "radial-gradient(circle, #4a6670 0%, transparent 70%)",
        }}
      />

      {/* ── Hero text ── */}
      <section className="relative mx-auto max-w-2xl text-center">
        <h1 className="text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.08] font-bold tracking-[-0.03em] text-white">
          Log the day.
          <br />
          <span className="text-white/60">See the pattern.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-md text-base leading-7 text-white/40 sm:text-lg sm:leading-8">
          Track the habits that matter and turn your consistency into a visible
          rhythm you can act on.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            id="cta-register"
            className="group relative inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-neutral-900 shadow-[0_0_40px_rgba(255,255,255,0.08)] transition-all duration-300 hover:shadow-[0_0_56px_rgba(255,255,255,0.14)]"
          >
            Create an account
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/login"
            id="cta-login"
            className="rounded-full border border-white/[0.1] bg-white/[0.04] px-7 py-3 text-sm font-semibold text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-white/90"
          >
            Sign in
          </Link>
        </div>

      </section>

      {/* ── Floating glass demo card ── */}
      <aside className="landing-glass-card relative mx-auto mt-20 w-full max-w-lg">
        {/* Warm glow behind the card */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[36px] opacity-[0.12] blur-3xl"
          style={{ background: "radial-gradient(ellipse, #c2703a 0%, transparent 70%)" }}
        />

        <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.04] p-6 shadow-[0_8px_64px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-8">
          {/* Card header */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/30">
              Consistency
            </span>
            <span className="text-2xl font-bold tracking-tight text-white">
              82<span className="text-sm font-medium text-white/30">%</span>
            </span>
          </div>

          {/* Heatmap */}
          <div className="mt-6 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-white/25">Last 28 days</span>
              <span className="font-semibold" style={{ color: "rgba(218, 172, 104, 0.8)" }}>21 logged</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {demoCells.map((intensity, index) => (
                <span
                  key={index}
                  className="block aspect-square rounded-[5px]"
                  style={{ backgroundColor: intensityStyles[intensity] }}
                />
              ))}
            </div>
          </div>

          {/* Habit rows */}
          <div className="mt-5 space-y-2.5">
            {habits.map((item) => (
              <div
                key={item.label}
                className="group flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 transition-colors duration-200 hover:bg-white/[0.04]"
              >
                <span className="text-sm font-medium text-white/60">{item.label}</span>
                <div className="mx-auto h-1 max-w-[80px] flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: "rgba(210, 155, 85, 0.5)",
                      width: `${item.pct}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold tabular-nums" style={{ color: "rgba(218, 172, 104, 0.7)" }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Bottom brand anchor ── */}
      <p className="mt-20 text-[11px] font-bold tracking-[0.25em] uppercase text-white/15">
        MapaBit
      </p>
    </main>
  );
}
