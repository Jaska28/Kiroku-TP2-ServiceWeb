"use server";

import prisma from "../lib/prisma";
import { getMediaFromAnilist, mediaAnilistToPrisma } from "../lib/anilist";

// Retrieves a media item from Anilist and creates it in our database
export async function createMediaFromAnilist(
  value: number | string,
  searchField: "id" | "search",
) {
  const media = await getMediaFromAnilist(value, searchField);

  if (!media) {
    return null;
  }

  const data = mediaAnilistToPrisma(media);

  const existingMedia = await prisma.media.findUnique({
    where: {
      anilistId: media.anilistId,
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
export async function updateMediaFromAnilist(anilistId: number) {
  const media = await getMediaFromAnilist(anilistId, "id");

  if (!media) {
    return null;
  }

  const data = mediaAnilistToPrisma(media);

  return prisma.media.update({
    where: {
      anilistId,
    },
    data,
  });
}

// gets a media item from our local db
export async function getMediaById(mediaId: string) {
  return prisma.media.findUnique({
    where: {
      mediaId,
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
export async function deleteMedia(mediaId: string) {
  return prisma.media.delete({
    where: {
      mediaId,
    },
  });
}
