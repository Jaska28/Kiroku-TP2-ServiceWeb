"use client";

import {useActionState} from "react";
import {
    addMediaToListFromForm,
    type AddMediaToListState,
} from "@/src/actions/mediaListItem.actions";
import type {MediaCardData} from "@/src/lib/types";

export type MediaListChoice = {
    mediaListId: string;
    name: string;
};

type Props = {
    media: MediaCardData;
    lists: MediaListChoice[];
};

const initialState: AddMediaToListState = {
    success: false,
    message: "",
};

export function ListOfMediaLists({media, lists}: Props) {
    const [state, formAction, isPending] = useActionState(
        addMediaToListFromForm,
        initialState,
    );

    return (
        <form action={formAction} className="space-y-4">
            <div>
                <h2 className="text-xl font-bold">Ajouter à une liste</h2>
                <p className="mt-1 text-sm opacity-70">{media.title}</p>
            </div>

            <input type="hidden" name="anilistId" value={media.id}/>
            <input type="hidden" name="mediaType" value={media.type}/>

            {lists.length === 0 ? (
                <p className="rounded-lg bg-base-200 p-3">
                    Crée d&apos;abord une liste pour ajouter ce média.
                </p>
            ) : (
                <div className="space-y-2">
                    {lists.map((list) => (
                        <button
                            key={list.mediaListId}
                            type="submit"
                            name="mediaListId"
                            value={list.mediaListId}
                            className="btn btn-outline w-full justify-start"
                            disabled={isPending}
                        >
                            {isPending ? "Ajout..." : list.name}
                        </button>
                    ))}
                </div>
            )}

            {state.message && (
                <div
                    role="alert"
                    className={`alert ${state.success ? "alert-success" : "alert-error"}`}
                >
                    <span>{state.message}</span>
                </div>
            )}
        </form>
    );
}
