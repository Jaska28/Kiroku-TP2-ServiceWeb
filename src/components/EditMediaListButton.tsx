"use client";

import {useRef, useState} from "react";
import {MediaListForm} from "./MediaListForm";

type Props = {
    list: {mediaListId: string; name: string; desc: string | null; isPublic: boolean | null};
};

export function EditMediaListButton({list}: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [formVersion, setFormVersion] = useState(0);

    function openEditor() {
        setFormVersion((version) => version + 1);
        dialogRef.current?.showModal();
    }

    return (
        <>
            <button type="button" onClick={openEditor}
                    className="btn btn-primary btn-outline btn-sm w-full sm:w-auto">
                Modifier la liste
            </button>
            <dialog ref={dialogRef} className="modal" aria-label="Modifier la liste">
                <div className="modal-box">
                    <MediaListForm key={formVersion} list={list}/>
                    <form method="dialog" className="modal-action">
                        <button className="btn">Fermer</button>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button aria-label="Fermer la fenêtre">Fermer</button>
                </form>
            </dialog>
        </>
    );
}
