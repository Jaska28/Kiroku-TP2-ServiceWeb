import Link from "next/link";
import type {Prisma} from "@/generated/prisma/client";

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

export function MediaListCard({list}: Props) {
    return(
        <article className="card h-full bg-base-100 shadow-sm">
            <div className="card-body">
                <div className="flex items-start justify-between gap-4">
                    <h2 className="card-title">{list.name}</h2>
                    <span className={`badge ${list.isPublic ? "badge-success" : "badge-ghost"}`}>
                        {list.isPublic ? "Publique" : "Privée"}
                    </span>
                </div>

                <p className="text-sm opacity-70">{list.description}</p>

                <ul className="my-3 space-y-2">
                    {list.mediaListItems.map(({media}) => (
                        <li
                            key={`${media.type}-${media.id}`}
                            className="flex items-center justify-between rounded-lg bg-base-200 px-3 py-2"
                        >
                            <span className="font-medium">{media.title}</span>
                            <span className="badge badge-outline badge-sm">{media.type}</span>
                        </li>
                    ))}
                </ul>

                <div className="card-actions items-center justify-between">
                    <span className="text-sm opacity-60">
                        {list.mediaListItems.length} œuvre
                        {list.mediaListItems.length > 1 ? "s" : ""}
                    </span>
                    <Link href={`/lists/${list.id}`} className="btn btn-primary btn-sm">
                        Voir la liste
                    </Link>
                </div>
            </div>
        </article>
    )
}
