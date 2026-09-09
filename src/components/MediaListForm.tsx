"use client";

import {useActionState, useState} from "react";
import {
    createMediaListFromForm,
    updateMediaListFromForm,
    type CreateMediaListFormState,
} from "@/src/actions/mediaList.actions";

const initialState: CreateMediaListFormState = {
    success: false,
    message: "",
};

type Props = {
    list?: {mediaListId: string; name: string; desc: string | null; isPublic: boolean | null};
};

export function MediaListForm({list}: Props) {
    const [name, setName] = useState(list?.name ?? "");
    const [description, setDescription] = useState(list?.desc ?? "");
    const [isPublic, setIsPublic] = useState(list?.isPublic ?? false);
    const [state, formAction, isPending] = useActionState(
        list ? updateMediaListFromForm : createMediaListFromForm,
        initialState,
    );

    return (
        <form action={formAction} className="space-y-4">
            <h2 className="text-xl font-bold">{list ? "Modifier la liste" : "Créer une liste"}</h2>
            {list && <input type="hidden" name="mediaListId" value={list.mediaListId}/>}
            <fieldset disabled={isPending} className="space-y-4">

            <label className="fieldset">
                <span className="fieldset-legend">Nom</span>
                <input
                    name="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    type="text"
                    className="input w-full"
                    placeholder="À voir"
                    required
                />
            </label>

            <label className="fieldset">
                <span className="fieldset-legend">Description</span>
                <textarea
                    name="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="textarea w-full"
                    placeholder="Les œuvres que je veux découvrir"
                />
            </label>

            <label className="flex items-center gap-2">
                <input
                    name="isPublic"
                    checked={isPublic}
                    onChange={(event) => setIsPublic(event.target.checked)}
                    type="checkbox"
                    className="checkbox"
                />
                Liste publique
            </label>

            <button
                type="submit"
                className="btn btn-primary"
                disabled={isPending}
            >
                {isPending ? "Enregistrement..." : list ? "Enregistrer" : "Créer"}
            </button>
            </fieldset>

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
