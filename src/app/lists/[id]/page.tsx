import Link from "next/link";
import {notFound} from "next/navigation";
import {getMediaListDetails} from "@/src/actions/mediaList.actions";
import {DeleteMediaListItemForm} from "@/src/components/DeleteMediaListItemForm";
import {getMediaFromAnilist} from "@/src/lib/anilist";
import {getCurrentUserRatings} from "@/src/actions/review.actions";
import {MediaRatingControl} from "@/src/components/MediaRatingControl";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function MediaListPage({params}: Props) {
    const {id} = await params;
    const list = await getMediaListDetails(id);

    if (!list) {
        notFound();
    }

    const [mediaItems, ratings] = await Promise.all([
        Promise.all(list.mediaListItems.map(async ({media}) => {
            const anilistMedia = await getMediaFromAnilist(
                media.anilistId,
                "id",
            );

            return {
                databaseId: media.mediaId,
                anilistId: media.anilistId,
                title:
                    anilistMedia?.title.english ??
                    anilistMedia?.title.romaji ??
                    anilistMedia?.title.native ??
                    media.title,
                type: anilistMedia?.type ?? null,
                description: anilistMedia?.description
                    ?.replace(/<br\s*\/?>/gi, " ")
                    .replace(/<[^>]*>/g, "")
                    .replace(/&nbsp;/g, " ")
                    .replace(/&#039;/g, "'")
                    .replace(/&quot;/g, '"')
                    .replace(/&amp;/g, "&") ?? null,
                imageUrl: anilistMedia?.coverImage?.large ?? null,
                genres: anilistMedia?.genres ?? [],
                score: anilistMedia?.averageScore ?? null,
                releaseYear: anilistMedia?.startDate?.year ?? null,
            };
        })),
        getCurrentUserRatings(
            list.mediaListItems.map(({media}) => media.anilistId),
        ),
    ]);

    return (
        <main className="min-h-screen bg-base-200/60">
            <header className="border-b border-base-300 bg-base-100">
                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                    <Link href="/my-lists" className="btn btn-ghost btn-sm -ml-3 mb-5">
                        ← Retour aux listes
                    </Link>

                    <div className="flex flex-wrap items-start justify-between gap-5">
                        <div>
                            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-primary">Ma liste</p>
                            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{list.name}</h1>
                        {list.desc && (
                                <p className="mt-3 max-w-2xl text-lg leading-7 opacity-60">{list.desc}</p>
                        )}
                            <p className="mt-5 text-sm font-medium opacity-50">
                                {list.mediaListItems.length} œuvre{list.mediaListItems.length !== 1 ? "s" : ""}
                            </p>
                        </div>

                        <span className={`badge badge-lg ${list.isPublic ? "badge-success" : "badge-ghost"}`}>
                            {list.isPublic ? "Publique" : "Privée"}
                        </span>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                {list.mediaListItems.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-primary/30 bg-base-100 px-6 py-20 text-center">
                        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-primary/10 text-2xl text-primary">◇</div>
                        <h2 className="text-2xl font-bold">Cette liste est vide</h2>
                        <p className="mt-2 opacity-60">Parcours le catalogue pour y ajouter une première œuvre.</p>
                        <Link href="/catalog" className="btn btn-primary mt-6">Explorer le catalogue</Link>
                    </div>
                ) : (
                <section className="grid gap-6 xl:grid-cols-2">
                    {mediaItems.map((media) => (
                        <article key={media.databaseId} className="group overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition duration-300 hover:border-primary/25 hover:shadow-lg sm:grid sm:grid-cols-[160px_1fr]">
                            {media.imageUrl && (
                                <figure className="relative overflow-hidden bg-base-300">
                                    <img
                                        src={media.imageUrl}
                                        alt={`Couverture de ${media.title}`}
                                        className="aspect-[2/3] h-full max-h-80 w-full object-cover transition duration-500 group-hover:scale-105 sm:max-h-none"
                                    />
                                    {media.score != null && (
                                        <span className="badge badge-neutral absolute right-3 top-3 border-0 bg-black/70 font-bold text-amber-300 backdrop-blur">
                                            ★ {(media.score / 10).toFixed(1)}
                                        </span>
                                    )}
                                </figure>
                            )}

                            <div className="flex min-w-0 flex-col p-5">
                                <div className="flex flex-wrap items-center gap-2">
                                    {media.type && <span className="badge badge-primary badge-sm">{media.type}</span>}
                                    {media.releaseYear && <span className="text-sm opacity-50">{media.releaseYear}</span>}
                                </div>
                                <h2 className="mt-3 line-clamp-2 text-xl font-bold leading-7">{media.title}</h2>

                                <p className="mt-3 line-clamp-3 text-sm leading-6 opacity-60">
                                    {media.description ?? "Aucune description disponible."}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {media.genres.slice(0, 3).map((genre) => (
                                        <span key={genre} className="badge badge-ghost badge-sm">
                                            {genre}
                                        </span>
                                    ))}
                                </div>

                                {media.type && (
                                    <div className="mt-4 rounded-xl bg-base-200/70 p-3">
                                        <p className="mb-1 text-xs font-bold uppercase tracking-wider opacity-50">Ta note</p>
                                        <MediaRatingControl
                                            anilistId={media.anilistId}
                                            type={media.type}
                                            initialRating={ratings[media.anilistId] ?? 0}
                                        />
                                    </div>
                                )}

                                <div className="mt-auto flex items-center gap-2 border-t border-base-300 pt-4">
                                    {media.type && (
                                        <Link
                                            href={`/media/${media.anilistId}?type=${media.type.toLowerCase()}`}
                                            className="btn btn-primary btn-sm flex-1"
                                        >
                                            Voir les détails
                                        </Link>
                                    )}

                                    <DeleteMediaListItemForm
                                        mediaListId={list.mediaListId}
                                        mediaId={media.databaseId}
                                        mediaTitle={media.title}
                                    />
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
                )}
            </div>
        </main>
    );
}
