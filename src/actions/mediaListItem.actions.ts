"use server";

import prisma from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";
import { getCurrentUser } from "./user.actions";
import { getMediaListById } from "./mediaList.actions";
import { revalidatePath } from "next/cache";
import { getMediaById } from "./media.actions";
import { th } from "zod/locales";
import { error } from "console";

export async function createMediaListItem(
  mediaListId: string,
  mediaId: string,
) {
  // Only authentified user can create new medialistitems
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez vous pour ajouter un media a votre liste");
  }

  const results = await prisma.$transaction(async (tx) => {
    const existingMediaListItem = await tx.mediaListItem.findUnique({
      where: {
        mediaListId_mediaId: {
          mediaListId,
          mediaId,
        },
      },
    });
    // checks if user has ownership of the list
    const mediaList = await getMediaListById(mediaListId);

    if (!mediaList) {
      throw new Error("List doesnt exist");
    }

    if (mediaList.userId !== user.id || user.role !== Role.ADMIN) {
      throw new Error("You cant add media to a list you dont own");
    }

    if (existingMediaListItem) {
      // cas 1 : mli existe deja
      throw new Error("This media is already in this list");
    }

    // cas 2 : mli n'existe pas
    if (!existingMediaListItem) {
      await tx.mediaListItem.create({
        data: {
          mediaListId,
          mediaId,
        },
      });

      return { action: "Created MediaListItem" };
    }
  });

  revalidatePath("/");
  revalidatePath("/medialistitem");

  return results;
}

export async function deleteMediaListItem(
  mediaListId: string,
  mediaId: string,
) {
  // Only authentified user can create new medialistitems
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez vous pour enlever un media de votre liste");
  }

  const results = await prisma.$transaction(async (tx) => {
    const existingMediaListItem = await tx.mediaListItem.findUnique({
      where: {
        mediaListId_mediaId: {
          mediaListId,
          mediaId,
        },
      },
    });
    // checks if user has ownership of the list
    const mediaList = await getMediaListById(mediaListId);

    if (!mediaList) {
      throw new Error("List doesnt exist");
    }

    if (mediaList.userId !== user.id || user.role !== Role.ADMIN) {
      throw new Error("You cant remove media to a list you dont own");
    }

    if (existingMediaListItem) {
      // cas 1 : mli existe
      await tx.mediaListItem.delete({
        where: {
          mediaListId_mediaId: {
            mediaListId,
            mediaId,
          },
        },
      });

      return { action: "Deleted MediaListItem" };
    }

    // cas 2 : mli n'existe pas
    if (!existingMediaListItem) {
      throw new Error("Cant delete non-existing medialistitems");
    }
  });
  revalidatePath("/");
  revalidatePath("/medialistitem");

  return results;
}
