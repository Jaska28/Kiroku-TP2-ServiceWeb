import "server-only";

import {cache} from "react";
import {clerkClient} from "@clerk/nextjs/server";
import prisma from "./prisma";

export const getListAuthor = cache(async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {userId},
        select: {clerkId: true, username: true, firstName: true, lastName: true},
    });

    if (!user) return {name: "Utilisateur inconnu", imageUrl: null};

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
    // Older local usernames may contain an email address. Do not display it publicly.
    let name = fullName || (user.username.includes("@") ? "Utilisateur" : user.username);
    let imageUrl: string | null = null;

    if (user.clerkId.startsWith("user_")) {
        try {
            const client = await clerkClient();
            const profile = await client.users.getUser(user.clerkId);
            name = profile.username || profile.fullName || name;
            imageUrl = profile.imageUrl || null;
        } catch {
        }
    }

    return {name, imageUrl};
});
