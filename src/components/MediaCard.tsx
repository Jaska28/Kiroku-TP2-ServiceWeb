"use client"

import {MediaCardData} from "@/src/lib/types";
import Link from "next/link";
import {
    ListOfMediaLists,
    type MediaListChoice,
} from "@/src/components/ListOfMediaLists";
import {MediaRatingControl} from "@/src/components/MediaRatingControl";

type Props = {
    media: MediaCardData;
    lists: MediaListChoice[];
    initialRating?: number;
}

export function MediaCard({media, lists, initialRating = 0}: Props) {
    const modalId = `add-media-${media.id}`;

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
            <figure className="relative aspect-[2/3] overflow-hidden bg-base-300">
                <Link
                    href={`/media/${media.id}?type=${media.type.toLowerCase()}`}
                    aria-label={`Voir les détails de ${media.title}`}
                    className="absolute inset-0 block"
                >
                    <img
                        src={media.imageUrl}
                        alt={`Couverture de ${media.title}`}
                        className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                    />
                </Link>
                <span className="badge badge-neutral absolute right-3 top-3 border-0 bg-black/70 font-bold text-amber-300 backdrop-blur">
                    ★ {media.score?.toFixed(1) ?? "–"}
                </span>
                <span className="badge badge-primary absolute bottom-3 left-3 border-0 shadow">{media.type}</span>
            </figure>
            <div className="flex flex-1 flex-col p-5">
                <Link href={`/media/${media.id}?type=${media.type.toLowerCase()}`} className="hover:text-primary">
                    <h2 className="line-clamp-2 min-h-14 text-lg font-bold leading-7">{media.title}</h2>
                </Link>

                <p className="mt-1 text-sm opacity-55">{media.releaseYear ?? "Année inconnue"}</p>

                <div className="mt-4 rounded-xl bg-base-200 p-3">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wider opacity-50">Ta note</p>
                    <MediaRatingControl
                        anilistId={Number(media.id)}
                        type={media.type}
                        initialRating={initialRating}
                    />
                </div>

                <div className="my-4 flex flex-wrap gap-2">
                    {media.genres.slice(0, 3).map((genre) => (
                        <div className="badge badge-ghost badge-sm" key={genre}>
                            {genre}
                        </div>
                    ))}
                </div>

                <label htmlFor={modalId} className="btn btn-primary btn-sm mt-auto w-full">
                    Ajouter à une liste
                </label>

                <input
                    id={modalId}
                    type="checkbox"
                    className="modal-toggle"
                />

                <div className="modal" role="dialog">
                    <div className="modal-box">
                        <ListOfMediaLists media={media} lists={lists}/>

                        <div className="modal-action">
                            <label htmlFor={modalId} className="btn">
                                Fermer
                            </label>
                        </div>
                    </div>

                    <label htmlFor={modalId} className="modal-backdrop">
                        Fermer
                    </label>
                </div>
            </div>
        </article>
    )
}
