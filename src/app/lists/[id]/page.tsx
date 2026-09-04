import Link from "next/link";
import {notFound} from "next/navigation";
import {getMediaListDetails} from "@/src/actions/mediaList.actions";
import {deleteMediaListItemFromForm} from "@/src/actions/mediaListItem.actions";

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

    return (
        <main className="p-8">
            <Link href="/my-lists" className="btn btn-ghost btn-sm mb-6">
                ← Retour aux listes
            </Link>

            <header className="mb-8 rounded-2xl bg-gradient-to-r from-purple-400 to-purple-700 p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">{list.name}</h1>
                        {list.description && (
                            <p className="mt-2 opacity-80">{list.description}</p>
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
                    {list.mediaListItems.map(({media}) => (
                        <article key={media.id} className="card bg-base-100 shadow-sm">
                            {media.bannerImgURL && (
                                <figure>
                                    <img
                                        src={media.bannerImgURL}
                                        alt={`Couverture de ${media.title}`}
                                        className="h-72 w-full object-cover"
                                    />
                                </figure>
                            )}

                            <div className="card-body">
                                <div className="flex items-start justify-between gap-3">
                                    <h2 className="card-title">{media.title}</h2>
                                    <span className="badge badge-outline">{media.type}</span>
                                </div>

                                <p className="line-clamp-3 text-sm opacity-70">
                                    {media.description ?? "Aucune description disponible."}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {media.genre.map((genre) => (
                                        <span key={genre} className="badge badge-info badge-sm">
                                            {genre}
                                        </span>
                                    ))}
                                </div>

                                <div className="card-actions mt-3 items-center justify-between">
                                    <Link
                                        href={`/media/${media.anilistId}?type=${media.type.toLowerCase()}`}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Voir le média
                                    </Link>

                                    <form action={deleteMediaListItemFromForm}>
                                        <input type="hidden" name="mediaListId" value={list.id}/>
                                        <input type="hidden" name="mediaId" value={media.id}/>
                                        <button type="submit" className="btn btn-error btn-sm">
                                            Retirer
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}
