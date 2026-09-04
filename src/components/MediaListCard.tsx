import Link from "next/link";
import type {Prisma} from "@/generated/prisma/client";
import {getMediaFromAnilist} from "@/src/lib/anilist";
import {DeleteMediaListItemForm} from "@/src/components/DeleteMediaListItemForm";
import {DeleteMediaListForm} from "@/src/components/DeleteMediaListForm";

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
                            <DeleteMediaListItemForm
                                mediaListId={list.mediaListId}
                                mediaId={media.databaseId}
                                mediaTitle={media.title}
                                compact
                            />
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
                    <DeleteMediaListForm
                        mediaListId={list.mediaListId}
                        listName={list.name}
                    />
                </div>
            </div>
        </article>
    )
}
