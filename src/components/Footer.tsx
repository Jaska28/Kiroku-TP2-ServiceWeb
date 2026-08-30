import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-violet-200 bg-[#f7efff] text-violet-950">
      <div className="flex min-h-20 flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-md transition-opacity hover:opacity-75"
            aria-label="Kiroku — Accueil"
          >
            <Image
              src="/kiroku-nav-logo.png"
              alt="Kiroku"
              width={137}
              height={36}
              className="h-9 w-auto"
            />
          </Link>
          <span className="hidden h-5 w-px bg-violet-300 sm:block" />
          <p className="text-sm text-violet-900/70">
            © {new Date().getFullYear()} Kiroku
          </p>
        </div>

        <nav className="flex gap-1 text-sm font-medium" aria-label="Navigation secondaire">
          <Link href="/catalog" className="rounded-lg px-3 py-2 hover:bg-violet-200/70">
            Catalogue
          </Link>
          <Link href="/my-lists" className="rounded-lg px-3 py-2 hover:bg-violet-200/70">
            Mes listes
          </Link>
        </nav>
      </div>
    </footer>
  );
}
