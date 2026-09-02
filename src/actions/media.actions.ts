"use server";

import prisma from "@/src/lib/prisma";
import { getCurrentUser } from "./user.actions";
import { revalidatePath } from "next/cache";
import { MediaType } from "@/src/lib/api/mediaAPI";
import { getDataAnilist } from "@/src/lib/api/mediaAPI";

export async function registerMedia(
  value: number | string,
  searchField: "id" | "search",
  type: MediaType,
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("utilisateur non authentifie");
  }

  const mediaData = await getDataAnilist(value, searchField, type);

  if (!mediaData) {
    throw new Error("Aucun media trouve");
  }

  const existingMedia = await prisma.media.findFirst({
    where: {
      malId: mediaData.malId,
    },
  });

  if (existingMedia) {
    throw new Error("Le mdeia existe deja");
  }

  const media = await prisma.media.create({
    data: mediaData,
  });

  revalidatePath("/media");

  return media;
}
