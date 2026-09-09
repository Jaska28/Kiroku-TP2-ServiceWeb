import Link from "next/link";
import {
  anilistToMediaCard,
  getMediaPageFromAnilist,
} from "@/src/lib/anilist";
import { MediaType } from "@/src/lib/types";

export default async function Home() {
  const mediaPage = await getMediaPageFromAnilist(MediaType.ANIME, 1, 4);
  const popularMedia = mediaPage?.media.map((media) =>
    anilistToMediaCard(media, MediaType.ANIME),
  ) ?? [];

  return (
    <main className="min-h-screen bg-base-200/60">
      <section className="relative isolate overflow-hidden bg-neutral text-neutral-content">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(168,85,247,0.35),transparent_35%),radial-gradient(circle_at_15%_80%,rgba(217,70,239,0.18),transparent_30%)]" />
        <div className="absolute -right-24 top-10 size-80 rounded-full border border-violet-400/20" />
        <div className="absolute -right-8 top-24 size-80 rounded-full border border-fuchsia-400/10" />

        <div className="relative mx-auto flex min-h-[58vh] max-w-7xl items-center px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <span className="badge badge-primary badge-lg mb-5">Ta bibliothèque anime & manga</span>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">
              Garde une trace de chaque
              <span className="block bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">histoire qui compte.</span>
            </h1>
            <p className="max-w-2xl py-7 text-lg leading-8 text-neutral-content/70 sm:text-xl">
              Découvre de nouvelles œuvres, attribue tes notes et construis des listes qui te ressemblent.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/catalog" className="btn btn-primary btn-lg shadow-lg shadow-primary/20">
                Explorer le catalogue
              </Link>
              <Link href="/my-lists" className="btn btn-ghost btn-lg border border-white/15">
                Voir mes listes
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-primary">En ce moment</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Animes populaires</h2>
          </div>
          <Link href="/catalog" className="btn btn-ghost btn-sm">
            Tout voir <span aria-hidden="true">→</span>
          </Link>
        </div>

        {popularMedia.length === 0 ? (
          <p className="rounded-xl bg-base-200 p-6 text-center">
            Impossible de charger les animes populaires.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popularMedia.map((media) => (
              <Link
                key={media.id}
                href={`/media/${media.id}?type=anime`}
                className="group overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                <figure className="relative overflow-hidden">
                  <img
                    src={media.imageUrl}
                    alt={`Couverture de ${media.title}`}
                    className="aspect-[2/3] w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="badge badge-neutral absolute right-3 top-3 border-0 bg-black/70 text-amber-300 backdrop-blur">
                    ★ {media.score?.toFixed(1) ?? "–"}
                  </span>
                </figure>
                <div className="p-4">
                  <h3 className="line-clamp-2 min-h-12 font-bold leading-6">{media.title}</h3>
                  <div className="mt-3 flex items-center justify-between text-sm opacity-60">
                    <span>Anime</span>
                    <span>{media.releaseYear ?? "Année inconnue"}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
