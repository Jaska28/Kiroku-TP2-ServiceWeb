"use server";

import { MediaType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { getMediaFromAnilist, mediaAnilistToPrisma } from "@/lib/anilist";

// Retrieves a media item from Anilist and creates it in our database
export async function createMediaFromAnilist(
  value: number | string,
  searchField: "id" | "search",
  type: MediaType,
) {
  const media = await getMediaFromAnilist(value, searchField, type);

  if (!media) {
    return null;
  }

  const data = mediaAnilistToPrisma(media, type);

  const existingMedia = await prisma.media.findUnique({
    where: {
      anilistId: media.id,
    },
  });

  if (existingMedia) {
    return existingMedia;
  }

  return prisma.media.create({
    data,
  });
}

// Retrieves a media item from anilist and updates the existing db entry
export async function updateMediaFromAnilist(
  anilistId: number,
  type: MediaType,
) {
  const media = await getMediaFromAnilist(anilistId, "id", type);

  if (!media) {
    return null;
  }

  const data = mediaAnilistToPrisma(media, type);

  return prisma.media.update({
    where: {
      anilistId,
    },
    data,
  });
}

// gets a media item from our local db
export async function getMediaById(id: string) {
  return prisma.media.findUnique({
    where: {
      id,
    },
  });
}

// gets a media item using its anilist ID
export async function getMediaByAnilistId(anilistId: number) {
  return prisma.media.findUnique({
    where: {
      anilistId,
    },
  });
}

// gets all media in the database.
export async function getAllMedia() {
  return prisma.media.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

// deletes a media item
export async function deleteMedia(id: string) {
  return prisma.media.delete({
    where: {
      id,
    },
  });
}
