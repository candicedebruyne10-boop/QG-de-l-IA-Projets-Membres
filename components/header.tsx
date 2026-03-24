import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/constants";
import { getCurrentProfile } from "@/lib/queries";
import { ButtonLink } from "@/components/ui/button";

export async function Header() {
  const profile = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-[#F5F6F8]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="max-w-[16rem] text-sm font-semibold leading-tight text-[#2D355A] sm:text-base">
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-[#52607C] transition hover:text-[#2E43A3]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {profile ? (
            <>
              <ButtonLink href="/espace-membre" variant="secondary" className="hidden sm:inline-flex">
                Espace membre
              </ButtonLink>
              {profile.role === "admin" ? (
                <ButtonLink href="/admin" variant="subtle" className="hidden md:inline-flex">
                  Admin
                </ButtonLink>
              ) : null}
            </>
          ) : (
            <ButtonLink href="/connexion" variant="secondary">
              Connexion
            </ButtonLink>
          )}
        </div>
      </div>
    </header>
  );
}
