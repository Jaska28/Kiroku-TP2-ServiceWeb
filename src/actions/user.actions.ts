"use server";

import prisma from "../lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Role } from "@/generated/prisma/enums";
import {canSwitchDemoRole} from "@/src/lib/demoMode";
import {revalidatePath} from "next/cache";

export async function syncUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Utilisateur non authentifie");
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (existingUser) {
    if (clerkUser.id === process.env.ADMIN_USR_ID && existingUser.role !== Role.ADMIN
        && !canSwitchDemoRole(clerkUser.id)) {
      return prisma.user.update({
        where: {userId: existingUser.userId},
        data: {role: Role.ADMIN},
      });
    }
    return existingUser;
  }

  const newUser = await prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      username:
        clerkUser.username ??
        clerkUser.emailAddresses[0]?.emailAddress ??
        clerkUser.id,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      // this specific line checks if the clerk auth user is the admin account created and if it is it creates that user in the db and gives it the admin Role
      // Maybe I'll change how its done to be more conveniant later but for now this will work
      role: clerkUser.id === process.env.ADMIN_USR_ID ? Role.ADMIN : Role.USER,
    },
  });

  return newUser;
}

export async function getCurrentUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  return syncUser();
}

export async function switchDemoRole(
    _previousState: {message: string},
    formData: FormData,
): Promise<{message: string}> {
    const clerkUser = await currentUser();
    if (!clerkUser || !canSwitchDemoRole(clerkUser.id)) {
        return {message: "Changement de rôle non autorisé."};
    }

    const role = formData.get("role");
    if (role !== Role.USER && role !== Role.ADMIN) {
        return {message: "Rôle invalide."};
    }

    try {
        const user = await syncUser();
        await prisma.user.update({where: {userId: user.userId}, data: {role}});
    } catch {
        return {message: "Impossible de changer le rôle."};
    }

    revalidatePath("/", "layout");
    return {message: ""};
}
