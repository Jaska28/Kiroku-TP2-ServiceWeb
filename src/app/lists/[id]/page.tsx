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
                description: anilistMedia?.description ?? null,
                imageUrl: anilistMedia?.coverImage?.large ?? null,
                genres: anilistMedia?.genres ?? [],
            };
        })),
        getCurrentUserRatings(
            list.mediaListItems.map(({media}) => media.anilistId),
        ),
    ]);

    return (
        <main className="p-8">
            <Link href="/my-lists" className="btn btn-ghost btn-sm mb-6">
                ← Retour aux listes
            </Link>

            <header className="mb-8 rounded-2xl bg-gradient-to-r from-purple-400 to-purple-700 p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">{list.name}</h1>
                        {list.desc && (
                            <p className="mt-2 opacity-80">{list.desc}</p>
                        )}
                    </div>

                    <span className={`badge ${list.isPublic ? "badge-success" : "badge-ghost"}`}>
                        {list.isPublic ? "Publique" : "Privée"}
                    </span>
                </div>

                <p className="mt-4 text-sm opacity-70">
                    {list.mediaListItems.length} œuvre
                    {list.mediaListItems.length > 1 ? "s" : ""}
                </p>
            </header>

            {list.mediaListItems.length === 0 ? (
                <div className="rounded-xl bg-base-200 p-8 text-center">
                    Cette liste ne contient encore aucune œuvre.
                </div>
            ) : (
                <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {mediaItems.map((media) => (
                        <article key={media.databaseId} className="card bg-base-100 shadow-sm">
                            {media.imageUrl && (
                                <figure className="bg-base-200 p-4">
                                    <img
                                        src={media.imageUrl}
                                        alt={`Couverture de ${media.title}`}
                                        className="aspect-[2/3] h-72 w-48 rounded-lg object-cover shadow-md"
                                    />
                                </figure>
                            )}

                            <div className="card-body">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h2 className="card-title">{media.title}</h2>
                                        {media.type && (
                                            <div className="mt-2">
                                                <MediaRatingControl
                                                    anilistId={media.anilistId}
                                                    type={media.type}
                                                    initialRating={ratings[media.anilistId] ?? 0}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {media.type && (
                                            <span className="badge badge-outline">{media.type}</span>
                                        )}
                                        <span className="badge badge-primary">
                                            {ratings[media.anilistId] != null
                                                ? `${ratings[media.anilistId]}/10`
                                                : "Non noté"}
                                        </span>
                                    </div>
                                </div>

                                <p className="line-clamp-3 text-sm opacity-70">
                                    {media.description ?? "Aucune description disponible."}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {media.genres.map((genre) => (
                                        <span key={genre} className="badge badge-info badge-sm">
                                            {genre}
                                        </span>
                                    ))}
                                </div>

                                <div className="card-actions mt-3 items-center justify-between">
                                    {media.type && (
                                        <Link
                                            href={`/media/${media.anilistId}?type=${media.type.toLowerCase()}`}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Voir le média
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
        </main>
    );
}
