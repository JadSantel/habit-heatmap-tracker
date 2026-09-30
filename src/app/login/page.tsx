import Link from "next/link";
import { LoginForm } from "./login-form";

/* ── Demo data matching landing page bronze scale ── */
const previewCells = [
  3, 3, 2, 3, 3, 3, 3,
  3, 2, 3, 1, 3, 3, 3,
  2, 3, 3, 2, 3, 3, 3,
  3, 3, 2, 3, 3, 2, 3,
];

const intensityStyles = [
  "rgba(255, 255, 255, 0.04)", /* empty */
  "rgba(194, 134, 72, 0.22)",  /* light bronze */
  "rgba(210, 155, 85, 0.42)",  /* mid bronze */
  "rgba(218, 172, 104, 0.68)", /* warm gold */
] as const;

export default function LoginPage() {
  return (
    <main className="landing-page relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* ── Background ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[#050505]"
      />

      {/* Warm organic shapes matching landing page */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-20%] right-[-15%] -z-10 h-[80vh] w-[60vh] rotate-[-30deg] rounded-full opacity-[0.14] blur-[100px]"
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
        className="pointer-events-none absolute top-[30%] left-1/2 -z-10 h-[30vh] w-[40vh] -translate-x-1/2 rounded-full opacity-[0.07] blur-[80px]"
        style={{
          background: "radial-gradient(circle, #d4a06a 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[10%] left-[20%] -z-10 h-[35vh] w-[35vh] rounded-full opacity-[0.05] blur-[100px]"
        style={{
          background: "radial-gradient(circle, #4a6670 0%, transparent 70%)",
        }}
      />

      {/* ── Mobile top branding bar ── */}
      <div className="mb-6 flex w-full max-w-md items-center justify-between px-1 lg:hidden">
        <Link
          href="/"
          className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/70 hover:text-white transition-colors"
        >
          MapaBit
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Home
        </Link>
      </div>

      {/* ── Main card container ── */}
      <div className="landing-glass-card relative mx-auto w-full max-w-4xl">
        {/* Warm glow behind the card */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[36px] opacity-[0.14] blur-3xl"
          style={{ background: "radial-gradient(ellipse, #c2703a 0%, transparent 70%)" }}
        />

        <div className="grid overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.035] shadow-[0_8px_64px_rgba(0,0,0,0.6)] backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]">
          {/* Left panel: Product visual proof & momentum */}
          <div className="hidden border-r border-white/[0.07] bg-[radial-gradient(ellipse_at_top,_rgba(194,112,58,0.12),_rgba(5,5,5,0.4)_60%)] p-8 lg:flex lg:flex-col lg:justify-between">
            <div className="flex items-center justify-between">
              <Link href="/" className="group inline-flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/70 group-hover:text-white transition-colors">
                  MapaBit
                </span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to home
              </Link>
            </div>

            <div className="my-auto py-8">
              <h1 className="text-3xl font-bold tracking-[-0.03em] text-white">
                Make your streak
                <br />
                <span className="text-white/60">unbroken.</span>
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/40">
                Pick up right where you left off. Every day logged strengthens your consistency rhythm.
              </p>

              {/* Mini Heatmap Preview Card */}
              <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/30">
                    Consistency
                  </span>
                  <span className="text-xl font-bold tracking-tight text-white">
                    96<span className="text-xs font-medium text-white/30">%</span>
                  </span>
                </div>

                <div className="mt-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5">
                  <div className="mb-2.5 flex items-center justify-between text-xs">
                    <span className="text-white/30">Last 28 days</span>
                    <span className="font-semibold" style={{ color: "rgba(218, 172, 104, 0.8)" }}>
                      26 logged
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {previewCells.map((intensity, index) => (
                      <span
                        key={index}
                        className="block aspect-square rounded-[4px]"
                        style={{ backgroundColor: intensityStyles[intensity] }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-3.5 flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.015] px-3 py-2 text-xs text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#daac68]" />
                  <span>Your streak is waiting for today&apos;s log</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/20">
              Personal Habit Tracker
            </p>
          </div>

          {/* Right panel: Login form */}
          <section className="p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl">
              Welcome back
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/45">
              Sign in to continue building the habits that matter most.
            </p>

            <LoginForm />
          </section>
        </div>
      </div>
    </main>
  );
}
