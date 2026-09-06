"use client";

import {useState} from "react";
import {deleteRatingFromCard, saveRatingFromCard} from "@/src/actions/review.actions";
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
    const [isPending, setIsPending] = useState(false);

    async function handleRatingChange(newRating: number) {
        if (isPending) return;
        setIsPending(true);
        setMessage("");
        try {
            const result = await saveRatingFromCard(anilistId, type, newRating);
            if (result.success) setRating(newRating);
            setMessage(result.success ? "" : result.message);
        } catch {
            setMessage("Impossible d’enregistrer ta note.");
        } finally {
            setIsPending(false);
        }
    }

    async function handleCancelRating(){
        if (isPending) return;
        setIsPending(true);
        setMessage("");
        try {
            const result = await deleteRatingFromCard(anilistId);
            if (result.success) setRating(0);
            setMessage(result.success ? "" : result.message);
        } catch {
            setMessage("Impossible de supprimer ta note.");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <>
            <MediaRating
                mediaId={String(anilistId)}
                value={rating}
                onRatingChange={handleRatingChange}
                onCancelRating={handleCancelRating}
                disabled={isPending}
            />
            <PopupMessage message={message}/>
        </>
    );
}
