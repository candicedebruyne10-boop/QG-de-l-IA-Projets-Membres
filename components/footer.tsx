import Link from "next/link";
import { footerLinks, siteConfig } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-[#E3E8F0] bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">

        {/* Bloc gauche */}
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-lg font-semibold text-[#2D355A]">{siteConfig.name}</p>
            <p className="max-w-xl text-sm leading-7 text-[#6B7280]">
              Une bibliothèque crédible et sélective pour mettre en lumière les projets IA conçus par les membres du QG, créer de la traction et favoriser les premiers retours terrain.
            </p>
          </div>

          {/* Signature */}
          <div className="space-y-1 pt-2">
            <p className="text-sm font-medium text-[#2D355A]">
              Un projet issu du QG de l'IA
            </p>
            <p className="text-sm text-[#6B7280]">
              Imaginé par{" "}
              <span className="font-semibold text-[#2D355A]">
                Arnaud Vernon
              </span>{" "}
              — conçu et créé par{" "}
              <span className="font-semibold text-[#2D355A]">
                Candice Debruyne
              </span>
            </p>
          </div>
        </div>

        {/* Bloc droite */}
        <div className="grid gap-3 sm:justify-end">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#52607C] transition hover:text-[#2E43A3]"
            >
              {link.label}
            </Link>
          ))}
        </div>

      </div>
    </footer>
  );
}