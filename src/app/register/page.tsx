import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-5 py-10 sm:px-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[30px] border border-[color:var(--line)] bg-white/75 shadow-[var(--shadow)] backdrop-blur-sm lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-[radial-gradient(circle_at_top,_rgba(24,136,93,0.12),_rgba(14,28,24,0.05)_35%,_rgba(255,255,255,0.2)_100%)] p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] uppercase text-[color:var(--brand-strong)]">Habit Heatmap</p>
            <h1 className="mt-4 max-w-xs text-3xl font-semibold tracking-[-0.05em] text-[color:var(--foreground)]">
              Build momentum one day at a time.
            </h1>
          </div>

          <div className="rounded-2xl border border-[color:var(--line)] bg-white/70 p-4">
            <div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
              <span>Consistency</span>
              <span className="font-semibold text-[color:var(--brand-strong)]">92%</span>
            </div>
            <div className="mt-4 flex gap-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <span
                  key={index}
                  className={`h-11 flex-1 rounded-[8px] ${index < 6 ? "bg-emerald-500" : "bg-emerald-100"}`}
                />
              ))}
            </div>
          </div>
        </div>

        <section className="p-6 sm:p-8 lg:p-10">
          <p className="text-sm font-semibold text-[color:var(--brand-strong)]">Create account</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[color:var(--foreground)]">
            Start tracking
          </h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Set up your habit log and turn daily signals into visible progress.
          </p>
          <RegisterForm />
        </section>
      </div>
    </main>
  );
}
