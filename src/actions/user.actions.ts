"use server";

import prisma from "../lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Utilisateur non authentifie");
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (existingUser) return existingUser;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const newUser = await prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      username: clerkUser.username || `user_${clerkUser.id}`,
    },
  });
}

export async function getCurrentUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  const existingUser = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
  });

  return existingUser;
}
