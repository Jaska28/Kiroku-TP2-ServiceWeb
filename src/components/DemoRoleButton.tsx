"use client";

import {useActionState} from "react";
import {switchDemoRole} from "@/src/actions/user.actions";

export function DemoRoleButton({role}: {role: "USER" | "ADMIN"}) {
    const [state, action, pending] = useActionState(switchDemoRole, {message: ""});
    const isAdmin = role === "ADMIN";

    return (
        <form action={action} className="relative">
            <input type="hidden" name="role" value={isAdmin ? "USER" : "ADMIN"}/>
            <button type="submit" disabled={pending}
                    title={`Passer en mode ${isAdmin ? "utilisateur" : "admin"}`}
                    aria-label={`Mode test actuel : ${isAdmin ? "admin" : "utilisateur"}. Passer en mode ${isAdmin ? "utilisateur" : "admin"}.`}
                    className="btn btn-sm border-white/30 bg-white/10 px-2 text-white shadow-none hover:bg-white/20 sm:px-3">
                {pending ? "Changement..." : `Test : ${isAdmin ? "Admin" : "User"}`}
            </button>
            {state.message && <p role="alert" className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg bg-base-100 p-3 text-sm text-error shadow-lg">{state.message}</p>}
        </form>
    );
}
