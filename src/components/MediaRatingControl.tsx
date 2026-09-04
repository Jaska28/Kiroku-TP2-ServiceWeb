"use client";

import {useState} from "react";
import {saveRatingFromCard} from "@/src/actions/review.actions";
import {MediaRating} from "@/src/components/MediaRating";
import {PopupMessage} from "@/src/components/PopupMessage";

type Props = {
    anilistId: number;
    type: string;
    initialRating?: number;
};

export function MediaRatingControl({
    anilistId,
    type,
    initialRating = 0,
}: Props) {
    const [rating, setRating] = useState(initialRating);
    const [message, setMessage] = useState("");

    async function handleRatingChange(newRating: number) {
        setRating(newRating);
        setMessage("");

        const result = await saveRatingFromCard(anilistId, type, newRating);
        setMessage(result.success ? "" : result.message);
    }

    return (
        <>
            <MediaRating
                mediaId={String(anilistId)}
                value={rating}
                onRatingChange={handleRatingChange}
            />
            <PopupMessage message={message}/>
        </>
    );
}
