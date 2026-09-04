"use client";

import {useActionState} from "react";
import {
    deleteMediaListFromForm,
    type DeleteMediaListState,
} from "@/src/actions/mediaList.actions";
import {PopupMessage} from "@/src/components/PopupMessage";

const initialState: DeleteMediaListState = {
    success: false,
    message: "",
};

type Props = {
    mediaListId: string;
    listName: string;
};

export function DeleteMediaListForm({mediaListId, listName}: Props) {
    const [state, formAction, isPending] = useActionState(
        deleteMediaListFromForm,
        initialState,
    );

    return (
        <form action={formAction}>
            <input type="hidden" name="mediaListId" value={mediaListId}/>
            <button
                type="submit"
                className="btn btn-error btn-sm"
                aria-label={`Supprimer la liste ${listName}`}
                disabled={isPending}
            >
                {isPending ? "Suppression..." : "Supprimer"}
            </button>
            <PopupMessage message={state.message}/>
        </form>
    );
}
