"use client"

import {Media} from "@/src/lib/types";
import {useState} from "react";
import {MediaRating} from "@/src/components/MediaRating";

type Props = {
    media: Media;
}

export function MediaCard({media}: Props) {

    const [rating, setRating] = useState(0);

    return (
        <div className="card card-side bg-base-100 shadow-sm">
            <figure>
                <img
                    src={media.bannerImgURL}
                    alt="Media banner"/>
            </figure>
            <div className="card-body">
                <h2 className="card-title">{media.title}</h2>

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

                {media.genre.map((genre) => (
                    <div className="badge badge-info" key={genre}>
                        {genre}
                    </div>
                ))}
            </div>
        </div>
    )
}
