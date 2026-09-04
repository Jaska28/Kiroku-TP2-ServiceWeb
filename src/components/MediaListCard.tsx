import Link from "next/link";
import type {Prisma} from "@/generated/prisma/client";
import {deleteMediaListItemFromForm} from "@/src/actions/mediaListItem.actions";
import {deleteMediaListFromForm} from "@/src/actions/mediaList.actions";
import {getMediaFromAnilist} from "@/src/lib/anilist";

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
    const mediaItems = await Promise.all(
        list.mediaListItems.map(async ({media}) => {
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
            };
        }),
    );

    return (
        <article className="card h-full bg-base-100 bg-gradient-to-r from-purple-400 to-purple-700 shadow-sm">
            <div className="card-body ">
                <div className="flex items-start justify-between gap-4">
                    <h2 className="card-title">{list.name}</h2>
                    <span className={`badge ${list.isPublic ? "badge-success" : "badge-ghost"}`}>
                        {list.isPublic ? "Publique" : "Privée"}
                    </span>
                </div>

                <p className="text-sm opacity-70">{list.desc}</p>

                <ul className="my-3 space-y-2">
                    {mediaItems.map((media) => (
                        <li
                            key={media.databaseId}
                            className="flex items-center justify-between rounded-lg bg-base-200 px-3 py-2"
                        >
                            <span className="font-medium">{media.title}</span>
                            <span className="badge badge-outline badge-sm">{media.type}</span>
                            <form action={deleteMediaListItemFromForm}>
                                <input type="hidden" name="mediaListId" value={list.mediaListId}/>
                                <input type="hidden" name="mediaId" value={media.databaseId}/>
                                <button
                                    type="submit"
                                    className="btn btn-error btn-square btn-sm"
                                    aria-label={`Retirer ${media.title} de ${list.name}`}
                                    title="Retirer de la liste"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="size-6" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                    </svg>
                                </button>
                            </form>
                        </li>
                    ))}
                </ul>

                <div className="card-actions items-center justify-between">
                    <span className="text-sm opacity-60">
                        {list.mediaListItems.length} œuvre
                        {list.mediaListItems.length > 1 ? "s" : ""}
                    </span>
                    <Link href={`/lists/${list.mediaListId}`} className="btn btn-primary btn-sm">
                        Voir la liste
                    </Link>
                    <form action={deleteMediaListFromForm}>
                        <input type="hidden" name="mediaListId" value={list.mediaListId}/>
                        <button
                            type="submit"
                            className="btn btn-error btn-sm"
                            aria-label={`Supprimer la liste ${list.name}`}
                        >
                            Supprimer
                        </button>
                    </form>
                </div>
            </div>
        </article>
    )
}
