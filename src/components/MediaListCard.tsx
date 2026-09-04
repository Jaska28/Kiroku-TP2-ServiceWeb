import Link from "next/link";
import type {Prisma} from "@/generated/prisma/client";
import {getMediaFromAnilist} from "@/src/lib/anilist";
import {DeleteMediaListItemForm} from "@/src/components/DeleteMediaListItemForm";
import {DeleteMediaListForm} from "@/src/components/DeleteMediaListForm";
import {getCurrentUserRatings} from "@/src/actions/review.actions";

type MediaListWithItems = Prisma.MediaListGetPayload<{
    include: {
        mediaListItems: {
            include: {
                media: true;
            };
        };
    };
}>;

type Props = {
    list: MediaListWithItems;
}

export async function MediaListCard({list}: Props) {
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
                type: anilistMedia?.type ?? "Inconnu",
                imageUrl: anilistMedia?.coverImage?.large ?? null,
            };
        })),
        getCurrentUserRatings(
            list.mediaListItems.map(({media}) => media.anilistId),
        ),
    ]);

    return (
        <article className="card h-full overflow-hidden border border-base-300 bg-base-100 shadow-sm transition duration-300 hover:border-primary/25 hover:shadow-lg">
            <div className="h-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-500"/>
            <div className="card-body p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="card-title text-2xl">{list.name}</h2>
                        <p className="mt-1 text-sm opacity-50">{list.mediaListItems.length} œuvre{list.mediaListItems.length !== 1 ? "s" : ""}</p>
                    </div>
                    <span className={`badge badge-sm ${list.isPublic ? "badge-success" : "badge-ghost"}`}>
                        {list.isPublic ? "Publique" : "Privée"}
                    </span>
                </div>

                {list.desc && <p className="line-clamp-2 min-h-10 text-sm leading-5 opacity-60">{list.desc}</p>}

                {mediaItems.length > 0 && (
                    <div className="flex -space-x-4 py-2">
                        {mediaItems.slice(0, 4).map((media) => (
                            media.imageUrl ? (
                                <img
                                    key={media.databaseId}
                                    src={media.imageUrl}
                                    alt=""
                                    className="aspect-[2/3] w-16 rounded-lg border-2 border-base-100 object-cover shadow"
                                />
                            ) : null
                        ))}
                    </div>
                )}

                <ul className="space-y-2">
                    {mediaItems.slice(0, 3).map((media) => (
                        <li
                            key={media.databaseId}
                            className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 rounded-xl bg-base-200/70 px-3 py-2.5"
                        >
                            <span className="min-w-0 truncate font-medium">{media.title}</span>
                            <span className="text-center text-sm font-semibold text-amber-600">
                                {ratings[media.anilistId] != null
                                    ? `★ ${ratings[media.anilistId]}/10`
                                    : "—"}
                            </span>
                            <DeleteMediaListItemForm
                                mediaListId={list.mediaListId}
                                mediaId={media.databaseId}
                                mediaTitle={media.title}
                                compact
                            />
                        </li>
                    ))}
                </ul>

                {mediaItems.length > 3 && <p className="text-center text-xs opacity-45">+ {mediaItems.length - 3} autre{mediaItems.length - 3 > 1 ? "s" : ""}</p>}

                <div className="card-actions mt-auto items-center border-t border-base-300 pt-4">
                    <Link href={`/lists/${list.mediaListId}`} className="btn btn-primary btn-sm flex-1">
                        Voir la liste
                    </Link>
                    <DeleteMediaListForm
                        mediaListId={list.mediaListId}
                        listName={list.name}
                    />
                </div>
            </div>
        </article>
    )
}
