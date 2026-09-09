"use client";

import {useEffect} from "react";

type Props = {
    message: string;
};

export function PopupMessage({message}: Props) {
    useEffect(() => {
        if (message) {
            window.alert(message);
        }
    }, [message]);

    return null;
}
