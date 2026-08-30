import {
  Show,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const navigation = [
  { href: "/catalog", label: "Catalogue" },
  { href: "/my-lists", label: "Mes listes" },
];

export default function Header() {
  return (
    <header className="border-b border-violet-800 bg-gradient-to-r from-[#f7efff] via-[#5b21b6] to-[#12043d] text-white shadow-md">
      <div className="navbar min-h-20 w-full px-2 sm:px-4">
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <button
              type="button"
              tabIndex={0}
              className="btn btn-ghost btn-square text-violet-950 hover:bg-violet-200/70"
              aria-label="Ouvrir le menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <ul
              tabIndex={-1}
              className="menu dropdown-content z-10 mt-3 w-52 rounded-box border border-violet-700 bg-[#1d0755] p-2 text-white shadow-xl"
            >
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:bg-violet-700/70">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/"
            className="rounded-lg px-1 py-1 transition hover:bg-white/40"
            aria-label="Kiroku — Accueil"
          >
            <Image
              src="/kiroku-nav-logo.png"
              alt="Kiroku"
              width={196}
              height={51}
              priority
              className="h-10 w-auto sm:h-12"
            />
          </Link>
        </div>

        <nav className="navbar-center hidden lg:flex" aria-label="Navigation principale">
          <ul className="menu menu-horizontal gap-1 px-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-medium text-white hover:bg-violet-800/70"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar-end gap-2">
          <Show
            when="signed-in"
            fallback={
              <SignInButton mode="modal">
                <button className="btn btn-sm border-0 bg-gradient-to-r from-fuchsia-600 to-orange-400 text-white shadow-sm hover:from-fuchsia-500 hover:to-orange-300">
                  Connexion
                </button>
              </SignInButton>
            }
          >
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
