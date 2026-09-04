"use server";

import { Role } from "@/generated/prisma/enums";
import prisma from "../lib/prisma";
import { getCurrentUser } from "./user.actions";
import { revalidatePath } from "next/cache";
import { getMediaById } from "./media.actions";
import {
  createMediaListItem,
  deleteMediaListItem,
} from "./mediaListItem.actions";
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
  const description = String(formData.get("description") ?? "").trim() || null;
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
        userId: user.userId,
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

export async function getMediaListChoices() {
  return prisma.mediaList.findMany({
    where: {
      user: {
        clerkId: SEED_USER_CLERK_ID,
      },
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function createMediaList(
  name: string,
  desc: string | null,
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
          userId: user.userId,
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
          userId: user.userId,
          name,
          desc,
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
  name: string | null,
  desc: string | null,
  isPublic: boolean | null,
) {
  // only a user can create a list
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez vous pour update une liste");
  }

  // if nothing was provided just do nothing
  if ([name, desc, isPublic].every((val) => val === null)) {
    return null;
  }
  const results = await prisma.$transaction(async (tx) => {
    const existingList = await tx.mediaList.findUnique({
      where: {
        mediaListId,
      },
    });

    // cas 1 : list exists
    if (existingList) {
      // check if user owns list
      if (existingList.userId !== user.userId) {
        throw new Error("You do not have ownership of this list");
      }

      // if a null value is provided uses the current value instead of setting it to null blindly
      const nameVal = name === null ? existingList.name : name;
      const descriptionVal = desc === null ? existingList.desc : desc;
      const isPublicVal = isPublic === null ? existingList.isPublic : isPublic;

      // updates the list
      await tx.mediaList.update({
        where: {
          mediaListId,
        },
        data: {
          name: nameVal,
          desc: descriptionVal,
          isPublic: isPublicVal,
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

  return results;
}

export async function deleteMediaList(mediaListId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez vous pour delete une liste");
  }

  const results = await prisma.$transaction(async (tx) => {
    const existingList = await tx.mediaList.findUnique({
      where: {
        mediaListId,
      },
    });

    // cas 1: liste exists
    if (existingList) {
      // check if user owns list or is admin
      if (existingList.userId === user.userId || user.role === Role.ADMIN) {
        // deletes the list
        await tx.mediaList.delete({
          where: {
            mediaListId,
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

export async function deleteMediaListFromForm(
  formData: FormData,
): Promise<void> {
  const mediaListId = String(formData.get("mediaListId") ?? "");

  if (!mediaListId) {
    throw new Error("La liste est invalide.");
  }

  await prisma.$transaction(async (tx) => {
    const mediaList = await tx.mediaList.findFirst({
      where: {
        id: mediaListId,
        user: {
          clerkId: SEED_USER_CLERK_ID,
        },
      },
      select: {id: true},
    });

    if (!mediaList) {
      throw new Error("La liste est introuvable.");
    }

    await tx.mediaListItem.deleteMany({
      where: {mediaListId},
    });

    await tx.mediaList.delete({
      where: {id: mediaListId},
    });
  });

  revalidatePath("/my-lists");
  revalidatePath("/catalog");
}

export async function getMediaListById(mediaListId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez vous pour delete une liste");
  }

  const mediaList = await prisma.mediaList.findUnique({
    where: {
      mediaListId,
    },
  });

  if (!mediaList) {
    return null;
  }

  // if user owns the list, is admin or the list is public, user can see the list
  if (
    mediaList?.userId === user.userId ||
    user.role === Role.ADMIN ||
    mediaList.isPublic
  ) {
    return mediaList as MediaList;
  }

  return null;
}

// returns a paginated list of all users mediaList
// any user can see mediaLists; therefore no auth needed
// however only public lists are returned
export async function getAllMediaList(page: number = 1, limit: number = 5) {
  const skip = (page - 1) * limit;

  const [mediaLists, total] = await Promise.all([
    prisma.mediaList.findMany({
      where: {
        isPublic: true,
      },
      select: {
        mediaListId: true,
        userId: true,
        name: true,
        desc: true,
        isPublic: true,
      },
      orderBy: { createdAt: "asc" },
      skip,
      take: limit,
    }),
    prisma.mediaList.count({
      where: {
        isPublic: true,
      },
    }),
  ]);

  return {
    mediaLists,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

// return all of a users lists
// only the public ones unless the user making the request is the owner
export async function getAllUserMediaList(
  page: number = 1,
  limit: number = 5,
  userId: string,
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez vous pour delete une liste");
  }
  // if user making the request is the owner set to true, else false
  const owner = true ? user.userId === userId : false;
  // if user doesnt own a list only show the public lists
  const where = owner ? { userId } : { userId, isPublic: true };

  const skip = (page - 1) * limit;

  const [userMediaLists, total] = await Promise.all([
    prisma.mediaList.findMany({
      where,
      orderBy: { createdAt: "asc" },
      skip,
      take: limit,
    }),
    prisma.mediaList.count({
      where,
    }),
  ]);

  return {
    userMediaLists,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function addMediaToMediaList(
  mediaId: string,
  mediaListId: string,
) {
  // only a user can add media to a list
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez vous pour ajouter a votre liste");
  }

  const results = await prisma.$transaction(async (tx) => {
    const existingList = await tx.mediaList.findUnique({
      where: {
        mediaListId,
      },
    });

    // cas 1 : liste existe
    if (existingList) {
      // check if the user owns the list
      if (existingList.userId !== user.userId) {
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
        mediaListId,
      },
    });

    // cas 1 : liste existe
    if (existingList) {
      // check if the user owns the list
      if (existingList.userId !== user.userId) {
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
