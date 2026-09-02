"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./user.actions";
import { revalidatePath } from "next/cache";
import { get } from "http";

export async function createReview(
  mediaId: string,
  rating: string,
  comments: string | null,
) {
  // Only authentified user can leave reviews
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez vous pour reagir!");
  }

  const results = await prisma.$transaction(async (tx) => {
    const
  })
}
