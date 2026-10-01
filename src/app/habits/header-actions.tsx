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
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const habitDialogRef = useRef<HTMLDialogElement>(null);

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

  useEffect(() => {
    const dialog = habitDialogRef.current;
    if (!habitModalOpen || !dialog) return;

    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [habitModalOpen]);

  async function handleSignOut() {
    setSigningOut(true);
    await authClient.signOut();
    router.replace("/");
    router.refresh();
  }

  const iconButtonClass =
    "relative flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-white/75 transition-all duration-200 hover:border-[#d8ad76]/60 hover:bg-white/[0.08] hover:text-[#e1bc89] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e1bc89] active:scale-95";

  return (
    <>  
      {/* ── Icon row ── */}
      <div className="flex items-center gap-2">
        
                {/* Add habit button */}
        <button
          ref={addButtonRef}
          type="button"
          id="add-habit-icon-button"
          aria-label="Add a new habit"
          aria-haspopup="dialog"
          aria-expanded={habitModalOpen}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#c28a4b] px-4 text-sm font-semibold text-[#1b130a] transition hover:bg-[#d1a36a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e1bc89]"
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
        <dialog
          ref={habitDialogRef}
          aria-labelledby="create-habit-title"
          className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-2xl border border-white/[0.12] bg-[#10100f] p-4 text-[#f5f0e8] shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop:bg-black/75 backdrop:backdrop-blur-sm sm:inset-0 sm:m-auto sm:max-w-lg sm:rounded-2xl sm:p-6"
          onClose={() => {
            setHabitModalOpen(false);
            addButtonRef.current?.focus();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) event.currentTarget.close();
          }}
        >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#d4a66d]">
                  New habit
                </p>
                <h2 id="create-habit-title" className="mt-2 text-2xl font-semibold text-white">
                  Add a habit
                </h2>
              </div>
              <button
                type="button"
                onClick={() => habitDialogRef.current?.close()}
                className="min-h-11 rounded-full border border-white/[0.14] bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/75 transition hover:border-[#d8ad76]/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e1bc89]"
              >
                Close
              </button>
            </div>

            <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-zinc-200 sm:hidden" aria-hidden="true" />

            <HabitCreationForm onSuccessClose={() => habitDialogRef.current?.close()} />
        </dialog>
      )}
    </>
  );
}
