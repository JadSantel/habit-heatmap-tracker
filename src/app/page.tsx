import Link from "next/link";

const demoCells = [
  true, true, false, true, false, true, true,
  false, true, true, false, false, true, true,
  true, false, true, false, true, true, false,
  true, false, true, true, false, true, true,
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <section className="rounded-[30px] border border-[color:var(--line)] bg-white/70 p-6 shadow-[var(--shadow)] backdrop-blur-sm sm:p-8 lg:p-10">
          <p className="text-xs font-bold tracking-[0.22em] text-[color:var(--brand-strong)] uppercase">
            MapaBit
          </p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.05em] text-[color:var(--foreground)] sm:text-5xl">
            Log the day.
            <span className="block text-[color:var(--brand-strong)]">See the pattern.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">
            Track the habits that matter and turn your consistency into a visible rhythm you can act on.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-full bg-[color:var(--brand)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(24,136,93,0.22)] transition hover:bg-[color:var(--brand-strong)]"
            >
              Create an account
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-[color:var(--line)] bg-white px-5 py-2.5 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand-strong)]"
            >
              Sign in
            </Link>
          </div>
        </section>

        <aside className="rounded-[30px] border border-[color:var(--line)] bg-[#142a24] p-5 text-white shadow-[var(--shadow)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-200/80">This week</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">6 / 7 days</p>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-100 ring-1 ring-inset ring-emerald-400/20">
              On track
            </span>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-2">
            {demoCells.map((filled, index) => (
              <span
                key={`${filled}-${index}`}
                className={`block h-9 rounded-[8px] border ${filled ? "border-emerald-400/40 bg-emerald-400" : "border-emerald-200/10 bg-emerald-950/40"}`}
              />
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-emerald-100/80">Morning run</p>
                <p className="mt-1 text-lg font-semibold text-white">3 entries this week</p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-100">
                +2 vs last week
              </span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
