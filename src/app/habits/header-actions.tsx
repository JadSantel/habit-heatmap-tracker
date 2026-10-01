"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { HabitCreationForm } from "./habit-form";

// ─── Icon components ────────────────────────────────────────────────

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5.5 20.5c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Main component ─────────────────────────────────────────────────

export function HeaderActions() {
  const router = useRouter();

  // ── Profile dropdown state ──
  const [profileOpen, setProfileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Habit creation modal state ──
  const [habitModalOpen, setHabitModalOpen] = useState(false);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  // Close profile dropdown on Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [profileOpen]);

  async function handleSignOut() {
    setSigningOut(true);
    await authClient.signOut();
    router.replace("/");
    router.refresh();
  }

  const iconButtonClass =
    "relative flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-white/75 transition-all duration-200 hover:border-[#d8ad76]/60 hover:bg-white/[0.08] hover:text-[#e1bc89] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e1bc89] active:scale-95";

  return (
    <>  
      {/* ── Icon row ── */}
      <div className="flex items-center gap-2">
        
                {/* Add habit button */}
        <button
          type="button"
          id="add-habit-icon-button"
          aria-label="Add a new habit"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#c28a4b] px-4 text-sm font-semibold text-[#1b130a] transition hover:bg-[#d1a36a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e1bc89]"
          onClick={() => setHabitModalOpen(true)}
        >
          <PlusIcon className="h-4 w-4" />
          <span className="hidden sm:inline">New habit</span>
        </button>

        {/* Profile button */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            id="profile-menu-button"
            aria-label="Profile menu"
            aria-expanded={profileOpen}
            aria-haspopup="true"
            className={`${iconButtonClass} ${profileOpen ? "border-[color:var(--brand)] text-[color:var(--brand-strong)]" : ""}`}
            onClick={() => setProfileOpen((prev) => !prev)}
          >
            <ProfileIcon className="h-4 w-4" />
          </button>

          {/* ── Profile dropdown ── */}
          {profileOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-2 w-44 origin-top-right animate-[fadeSlideIn_150ms_ease-out] rounded-xl border border-white/[0.12] bg-[#10100f] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
              role="menu"
              aria-label="Profile options"
            >
              <button
                type="button"
                id="settings-button"
                role="menuitem"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/85 transition-colors hover:bg-white/[0.08]"
                onClick={() => {
                  setProfileOpen(false);
                  // Settings functionality not yet implemented
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4 text-white/60"
                >
                  <path
                    d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M19.622 10.395l-1.097-2.65L20 6l-2-2-1.735 1.483-2.707-1.113L12.935 2h-1.954l-.632 2.401-2.645 1.115L6 4 4 6l1.453 1.789-1.08 2.657L2 11v2l2.401.655 1.09 2.662L4 18l2 2 1.742-1.469 2.625 1.07L11 22h2l.604-2.387 2.651-1.098L18 20l2-2-1.547-1.767 1.098-2.6L22 13v-2l-2.378-.605Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
                Settings
              </button>

              <div className="my-1 h-px bg-white/[0.1]" role="separator" />

              <button
                type="button"
                id="sign-out-menu-button"
                role="menuitem"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-300 transition-colors hover:bg-red-400/10"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4"
                >
                  <path
                    d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Habit creation modal ── */}
      {habitModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setHabitModalOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-white/[0.12] bg-[#10100f] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.55)] sm:max-w-lg sm:rounded-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#d4a66d]">
                  New habit
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Add a habit
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setHabitModalOpen(false)}
                className="rounded-full border border-white/[0.14] bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-white/75 transition hover:border-[#d8ad76]/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e1bc89]"
              >
                Close
              </button>
            </div>

            <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-zinc-200 sm:hidden" aria-hidden="true" />

            <HabitCreationForm onSuccessClose={() => setHabitModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
