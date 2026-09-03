"use client";

import {useActionState} from "react";
import {
    createMediaListFromForm,
    type CreateMediaListFormState,
} from "@/src/actions/mediaList.actions";

const initialState: CreateMediaListFormState = {
    success: false,
    message: "",
};

export function CreateListForm() {
    const [state, formAction, isPending] = useActionState(
        createMediaListFromForm,
        initialState,
    );

    return (
        <form action={formAction} className="space-y-4">
            <h2 className="text-xl font-bold">Créer une liste</h2>

            <label className="fieldset">
                <span className="fieldset-legend">Nom</span>
                <input
                    name="name"
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
                    className="textarea w-full"
                    placeholder="Les œuvres que je veux découvrir"
                />
            </label>

            <label className="flex items-center gap-2">
                <input
                    name="isPublic"
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
                {isPending ? "Création..." : "Créer"}
            </button>

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
