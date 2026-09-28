"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { HabitCreationForm } from "./habit-form";

// ─── Icon components ────────────────────────────────────────────────

function SortIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 6h18M3 12h12M3 18h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
    "relative flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--line)] bg-white/80 text-[color:var(--muted)] shadow-sm transition-all duration-200 hover:border-[color:var(--brand)] hover:text-[color:var(--brand-strong)] hover:shadow-md active:scale-95";

  return (
    <>  
      {/* ── Icon row ── */}
      <div className="flex items-center gap-2">
        
                {/* Add habit button */}
        <button
          type="button"
          id="add-habit-icon-button"
          aria-label="Add a new habit"
          className={iconButtonClass}
          onClick={() => setHabitModalOpen(true)}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
        
        {/* Sort button (placeholder) */}
        <button
          type="button"
          id="sort-habits-button"
          aria-label="Sort habits"
          className={iconButtonClass}
          title="Sort habits (coming soon)"
        >
          <SortIcon className="h-4 w-4" />
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
              className="absolute right-0 top-full z-50 mt-2 w-44 origin-top-right animate-[fadeSlideIn_150ms_ease-out] rounded-2xl border border-[color:var(--line)] bg-white p-1.5 shadow-[0_16px_40px_rgba(11,18,16,0.14)]"
              role="menu"
              aria-label="Profile options"
            >
              <button
                type="button"
                id="settings-button"
                role="menuitem"
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--brand-soft)]"
                onClick={() => {
                  setProfileOpen(false);
                  // Settings functionality not yet implemented
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4 text-[color:var(--muted)]"
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

              <div className="my-1 h-px bg-[color:var(--line)]" role="separator" />

              <button
                type="button"
                id="sign-out-menu-button"
                role="menuitem"
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12211d]/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[30px] border border-[color:var(--line)] bg-white p-4 shadow-[0_30px_70px_rgba(11,18,16,0.18)] sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[color:var(--brand-strong)]">
                  New habit
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[color:var(--foreground)]">
                  Add a habit
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setHabitModalOpen(false)}
                className="rounded-full border border-[color:var(--line)] bg-white px-3 py-1.5 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--brand)]"
              >
                Close
              </button>
            </div>

            <HabitCreationForm onSuccessClose={() => setHabitModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
