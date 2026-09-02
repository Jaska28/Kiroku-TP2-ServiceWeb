"use client"

import {Media} from "@/src/lib/types";
import {useState} from "react";
import {MediaRating} from "@/src/components/MediaRating";
import Link from "next/link";

type Props = {
    media: Media;
}

export function MediaCard({media}: Props) {

    const [rating, setRating] = useState(0);

    return (
        <div className="card card-side bg-base-100 shadow-sm bg-gradient-to-r from-purple-100 to-purple-600">
            <figure>
                <Link
                    href={`/media/${media.id}`}
                    aria-label={`Voir les détails de ${media.title}`}
                    className={"block"}
                >
                    <img
                        src={media.bannerImgURL}
                        alt="Media banner"
                        className={"shadow-xl rounded relative h-80 w-auto"}
                    />
                </Link>
            </figure>
            <div className="card-body">
                <h2 className="card-title">{media.title}</h2>
                <h3>{media.type}</h3>

                <div className={"flex flex-col gap-2"}>
                    <span className={"text-lg font-bold"}>
                        Moyenne: {media.avgScore?.toFixed(1) ?? "-"}
                    </span>
                </div>

                <MediaRating
                    mediaId={media.id}
                    value={rating}
                    onRatingChange={setRating}
                />

                <div className={"flex flex row flex-wrap gap-2"}>
                    {media.genre.map((genre) => (
                        <div className="badge badge-info" key={genre}>
                            {genre}
                        </div>
                    ))}
                </div>

                <button className={"btn btn-accent"}>Ajouter à une liste</button>

            </div>
        </div>
    )
}
