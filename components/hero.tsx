import { SearchBar } from "@/components/search-bar";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { professionOptions, projectStageOptions } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/80 bg-[radial-gradient(circle_at_top_left,_rgba(116,182,174,0.22),_transparent_32%),linear-gradient(145deg,_#FFFFFF_0%,_#EEF2FF_55%,_#F8FBFF_100%)] px-6 py-10 shadow-[0_28px_90px_rgba(15,23,42,0.08)] sm:px-8 md:px-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div className="space-y-6">
          <Badge className="bg-white/80 text-[#2E43A3]">Sélection privée réservée aux membres et visiteurs validés</Badge>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#2D355A] sm:text-5xl md:text-6xl">
              Les projets IA des membres, enfin au même endroit.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#5D6884] md:text-lg">
              Découvrez, filtrez, testez et soutenez les apps, sites et outils créés avec l’IA par la communauté du QG.
            </p>
          </div>

          <form action="/catalogue" className="max-w-2xl space-y-4">
            <SearchBar />
            <div className="flex flex-wrap gap-3">
              {["applications", "agents IA", "automatisations", "marketplaces"].map((item) => (
                <button
                  key={item}
                  type="submit"
                  name="category"
                  value={item}
                  className="rounded-full border border-white/90 bg-white/80 px-4 py-2 text-sm font-medium text-[#52607C] transition hover:bg-white"
                >
                  {item}
                </button>
              ))}
            </div>
          </form>

          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/proposer-un-projet">Proposer un projet</ButtonLink>
            <ButtonLink href="/catalogue" variant="secondary">
              Parcourir le catalogue
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.07)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6A84B5]">Filtres utiles</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {professionOptions.slice(0, 6).map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-white/80 bg-[#2E43A3] p-6 text-white shadow-[0_18px_60px_rgba(46,67,163,0.24)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Niveaux suivis</p>
            <div className="mt-4 grid gap-3">
              {projectStageOptions.map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
