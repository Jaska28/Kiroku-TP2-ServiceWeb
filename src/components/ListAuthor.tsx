"use client";

import Image from "next/image";
import {useState} from "react";

export function ListAuthor({name, imageUrl}: {name: string; imageUrl: string | null}) {
    const [failedImage, setFailedImage] = useState<string | null>(null);
    const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

    return (
        <div className="flex min-w-0 items-center gap-3 py-2">
            <div className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/15">
                {imageUrl && failedImage !== imageUrl ? (
                    <Image src={imageUrl} alt="" width={36} height={36} unoptimized
                           className="size-9 object-cover" onError={() => setFailedImage(imageUrl)}/>
                ) : <span aria-hidden="true">{initials}</span>}
            </div>
            <div className="min-w-0">
                <p className="text-xs opacity-50">Créée par</p>
                <p className="truncate text-sm font-semibold" title={name}>{name}</p>
            </div>
        </div>
    );
}
