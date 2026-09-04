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
    <main>
      <section className="hero min-h-[55vh] bg-gradient-to-r from-purple-400 to-purple-700 px-6">
        <div className="hero-content text-center text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold">Bienvenue sur Kiroku</h1>
            <p className="py-6 text-lg">
              Découvre, évalue et organise tes animes et mangas.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/catalog" className="btn btn-primary">
                Explorer le catalogue
              </Link>
              <Link href="/my-lists" className="btn btn-secondary">
                Voir mes listes
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-3xl font-bold">Animes populaires</h2>
          <Link href="/catalog" className="btn btn-ghost btn-sm">
            Tout voir →
          </Link>
        </div>

        {popularMedia.length === 0 ? (
          <p className="rounded-xl bg-base-200 p-6 text-center">
            Impossible de charger les animes populaires.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popularMedia.map((media) => (
              <Link
                key={media.id}
                href={`/media/${media.id}?type=anime`}
                className="card bg-base-100 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <figure>
                  <img
                    src={media.imageUrl}
                    alt={`Couverture de ${media.title}`}
                    className="h-80 w-full object-cover"
                  />
                </figure>
                <div className="card-body p-4">
                  <h3 className="card-title text-base">{media.title}</h3>
                  <span className="badge badge-outline">ANIME</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
