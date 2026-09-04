"use client";

import {useActionState} from "react";
import {
    deleteMediaListItemFromForm,
    type DeleteListItemState,
} from "@/src/actions/mediaListItem.actions";
import {PopupMessage} from "@/src/components/PopupMessage";

const initialState: DeleteListItemState = {
    success: false,
    message: "",
};

type Props = {
    mediaListId: string;
    mediaId: string;
    mediaTitle: string;
    compact?: boolean;
};

export function DeleteMediaListItemForm({
    mediaListId,
    mediaId,
    mediaTitle,
    compact = false,
}: Props) {
    const [state, formAction, isPending] = useActionState(
        deleteMediaListItemFromForm,
        initialState,
    );

    return (
        <form action={formAction}>
            <input type="hidden" name="mediaListId" value={mediaListId}/>
            <input type="hidden" name="mediaId" value={mediaId}/>

            <button
                type="submit"
                className={compact
                    ? "btn btn-error btn-square btn-sm"
                    : "btn btn-error btn-sm"}
                disabled={isPending}
                aria-label={`Retirer ${mediaTitle} de la liste`}
            >
                {isPending ? "..." : compact ? "×" : "Retirer"}
            </button>
            <PopupMessage message={state.message}/>
        </form>
    );
}
