"use server";

import prisma from "../lib/prisma";
import { Role } from "@/generated/prisma/enums";
import { getCurrentUser } from "./user.actions";
import { getMediaListById } from "./mediaList.actions";
import { revalidatePath } from "next/cache";
import { getMediaFromAnilist, mediaAnilistToPrisma } from "@/src/lib/anilist";

const SEED_USER_CLERK_ID = "seed-user-kiroku";

export type AddMediaToListState = {
  success: boolean;
  message: string;
};

export async function addMediaToListFromForm(
  _previousState: AddMediaToListState,
  formData: FormData,
): Promise<AddMediaToListState> {
  const mediaListId = String(formData.get("mediaListId") ?? "");
  const anilistId = Number(formData.get("anilistId"));
  const type =
    formData.get("mediaType") === "Manga" ? MediaType.MANGA : MediaType.ANIME;

  if (!mediaListId || !Number.isInteger(anilistId) || anilistId <= 0) {
    return {
      success: false,
      message: "La liste ou le média est invalide.",
    };
  }

  const anilistMedia = await getMediaFromAnilist(anilistId, "id", type);

  if (!anilistMedia) {
    return {
      success: false,
      message: "Impossible de récupérer ce média depuis AniList.",
    };
  }

  const mediaData = mediaAnilistToPrisma(anilistMedia, type);

  try {
    const wasCreated = await prisma.$transaction(async (tx) => {
      const mediaList = await tx.mediaList.findFirst({
        where: {
          id: mediaListId,
          user: {
            clerkId: SEED_USER_CLERK_ID,
          },
        },
        select: { id: true },
      });

      if (!mediaList) {
        throw new Error("MEDIA_LIST_NOT_FOUND");
      }

      const media = await tx.media.upsert({
        where: { anilistId },
        update: mediaData,
        create: mediaData,
      });

      const existingItem = await tx.mediaListItem.findUnique({
        where: {
          mediaListId_mediaId: {
            mediaListId,
            mediaId: media.id,
          },
        },
        select: { id: true },
      });

      if (existingItem) {
        return false;
      }

      await tx.mediaListItem.create({
        data: {
          mediaListId,
          mediaId: media.id,
        },
      });

      return true;
    });

    if (!wasCreated) {
      return {
        success: false,
        message: "Ce média est déjà dans cette liste.",
      };
    }

    revalidatePath("/my-lists");

    return {
      success: true,
      message: "Le média a été ajouté à la liste.",
    };
  } catch {
    return {
      success: false,
      message: "Impossible d’ajouter le média à cette liste.",
    };
  }
}

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

    if (mediaList.userId !== user.userId || user.role !== Role.ADMIN) {
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
  // Only authentified user can delete medialistitems
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

    if (mediaList.userId !== user.userId || user.role !== Role.ADMIN) {
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
