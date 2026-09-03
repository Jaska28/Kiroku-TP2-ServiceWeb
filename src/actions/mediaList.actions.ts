"use server";

import { Role } from "@/generated/prisma/enums";
import prisma from "../lib/prisma";
import { getCurrentUser } from "./user.actions";
import { revalidatePath } from "next/cache";
import { getMediaById } from "./media.actions";
import { createMediaListItem, deleteMediaListItem } from "./mediaListItem.actions";
import { MediaList } from "@/generated/prisma/client";

const SEED_USER_CLERK_ID = "seed-user-kiroku";

export type CreateMediaListFormState = {
  success: boolean;
  message: string;
};

export async function createMediaListFromForm(
  _previousState: CreateMediaListFormState,
  formData: FormData,
): Promise<CreateMediaListFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const description =
    String(formData.get("description") ?? "").trim() || null;
  const isPublic = formData.get("isPublic") === "on";

  if (!name) {
    return {
      success: false,
      message: "Le nom de la liste est obligatoire.",
    };
  }

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        clerkId: SEED_USER_CLERK_ID,
      },
    });

    await prisma.mediaList.create({
      data: {
        userId: user.id,
        name,
        description,
        isPublic,
      },
    });

    revalidatePath("/my-lists");

    return {
      success: true,
      message: "La liste a été créée avec succès.",
    };
  } catch {
    return {
      success: false,
      message: "Impossible de créer la liste. Vérifie si ce nom existe déjà.",
    };
  }
}

export async function createMediaList(
  name: string,
  description: string | null,
  isPublic: boolean | true,
) {
  // only a user can create a list
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez vous pour creer une liste");
  }

  const results = await prisma.$transaction(async (tx) => {
    const existingList = await tx.mediaList.findUnique({
      where: {
        userId_name: {
          userId: user.id,
          name: name,
        },
      },
    });

    // cas 1 : review existe deja
    if (existingList) {
      throw new Error("This list already exists");
    }

    // cas 2 : review n'existe pas
    if (!existingList) {
      await tx.mediaList.create({
        data: {
          userId: user.id,
          name,
          description,
          isPublic,
        },
      });

      return { action: "Ajout Liste" };
    }
  });

  revalidatePath("/");
  revalidatePath("/medialist");

  return results;
}

export async function updateMediaList(
  mediaListId: string,
  name: string,
  description: string | null,
  isPublic: boolean | null,
) {
  // only a user can create a list
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez vous pour update une liste");
  }

  const results = await prisma.$transaction(async (tx) => {
    const existingList = await tx.mediaList.findUnique({
      where: {
        userId_name: {
          userId: user.id,
          name: name,
        },
      },
    });

    // cas 1 : list exists
    if (existingList) {
      // check if user owns list
      if (existingList.userId !== user.id) {
        throw new Error("You do not have ownership of this list");
      }

      // allows keeping the old value instead of blindly updating to default of true
      const publicIs = isPublic != null ? isPublic : existingList.isPublic;

      // updates the list
      await tx.mediaList.update({
        where: {
          id: mediaListId,
        },
        data: {
          name,
          description,
          isPublic: publicIs,
        },
      });

      return { action: "Updated List" };
    }

    // cas 2 : list doesnt exist
    if (!existingList) {
      throw new Error("Non-existent list");
    }
  });

  revalidatePath("/");
  revalidatePath("/MediaList");
}

export async function deleteMediaList(mediaListId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez vous pour delete une liste");
  }

  const results = await prisma.$transaction(async (tx) => {
    const existingList = await tx.mediaList.findUnique({
      where: {
        id: mediaListId,
      },
    });

    // cas 1: liste exists
    if (existingList) {
      // check if user owns list or is admin
      if (existingList.userId === user.id || user.role === Role.ADMIN) {
        // deletes the list
        await tx.mediaList.delete({
          where: {
            id: mediaListId,
          },
        });

        return { action: "Supprimer List" };
      } else {
        throw new Error("You dont have permssions to delete this list");
      }
    }

    // cas 2: list doesnt exist
    if (!existingList) {
      throw new Error("Non-existent list");
    }
  });

  revalidatePath("/");
  revalidatePath("/mediaList");

  return results;
}

export async function getMediaListById(mediaListId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez vous pour delete une liste");
  }

  const mediaList = await prisma.mediaList.findUnique({
    where: {
      id: mediaListId,
    },
  });

  if (!mediaList) {
    return null;
  }

  if (mediaList?.userId === user.id || user.role === Role.ADMIN) {
    return mediaList as MediaList;
  }

  return null;
}

// only public ones
export async function getAllMediaList() {}

// return all the user's lists
export async function getAllUserMediaList(userId: string) {}

export async function addMediaToMediaList(
  mediaId: string,
  mediaListId: string,
) {
  // only a user can create a list
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez vous pour ajouter a votre liste");
  }

  const results = await prisma.$transaction(async (tx) => {
    const existingList = await tx.mediaList.findUnique({
      where: {
        id: mediaListId,
      },
    });

    // cas 1 : liste existe
    if (existingList) {
      // check if the user owns the list
      if (existingList.userId !== user.id) {
        throw new Error("You dont own this list");
      }

      // checks if the media exists
      const media = await getMediaById(mediaId);

      if (!media) {
        throw new Error("Media doesnt exist");
      }

      // adds the media to the list through the junction table
      await createMediaListItem(mediaListId, mediaId);

      return { action: "Added Media to List" };
    }

    // cas 2 : liste n'existe pas
    if (!existingList) {
      throw new Error("List doesnt exist");
    }
  });

  revalidatePath("/");
  revalidatePath("/medialist");

  return results;
}

export async function removeMediaFromMediaList(
  mediaId: string,
  mediaListId: string,
) {
  // only a user can create a list
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez vous pour ajouter a votre liste");
  }

  const results = await prisma.$transaction(async (tx) => {
    const existingList = await tx.mediaList.findUnique({
      where: {
        id: mediaListId,
      },
    });

    // cas 1 : liste existe
    if (existingList) {
      // check if the user owns the list
      if (existingList.userId !== user.id) {
        throw new Error("You dont own this list");
      }

      // checks if the media exists
      const media = await getMediaById(mediaId);

      if (!media) {
        throw new Error("Media doesnt exist");
      }

      // remove the media from the list through the junction table
      await deleteMediaListItem(mediaListId, mediaId);

      return { action: "Deleted Media from List" };
    }

    // cas 2 : liste n'existe pas
    if (!existingList) {
      throw new Error("List doesnt exist");
    }
  });

  revalidatePath("/");
  revalidatePath("/medialist");

  return results;
}


export async function getDemoUserMediaLists() {
  return prisma.mediaList.findMany({
    where: {
      user: {
        clerkId: SEED_USER_CLERK_ID,
      },
    },
    include: {
      mediaListItems: {
        include: {
          media: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
