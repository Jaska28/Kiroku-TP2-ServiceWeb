"use server";

import prisma from "../lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Role } from "@/generated/prisma/enums";

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
      username: clerkUser.username!,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      // this specific line checks if the clerk auth user is the admin account created and if it is it creates that user in the db and gives it the admin Role
      // Maybe I'll change how its done to be more conveniant later but for now this will work
      role: clerkUser.id === process.env.ADMIN_USR_ID ? Role.ADMIN : Role.USER,
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
