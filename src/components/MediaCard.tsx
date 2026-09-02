"use client"

import {Media} from "@/src/lib/types";

type Props = {
    media: Media;
}

export function MediaCard({media}: Props) {

    return (
        <div className="card card-side bg-base-100 shadow-sm">
            <figure>
                <img
                    src={media.bannerImgURL}
                    alt="Media banner"/>
            </figure>
            <div className="card-body">
                <h2 className="card-title">{media.title}</h2>

                {media.genre.map((g) => (
                    <div className="badge badge-info" key={g}>
                        {g}
                    </div>
                ))}
            </div>
        </div>
    )
}