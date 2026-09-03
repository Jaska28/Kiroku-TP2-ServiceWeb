"use server";

import prisma from "../lib/prisma";
import { Role } from "@/generated/prisma/enums";
import { getCurrentUser } from "./user.actions";
import { revalidatePath } from "next/cache";
import { getMediaById } from "./media.actions";

export async function createReview(
  mediaId: string,
  rating: number,
  comments: string | null,
) {
  // Only authentified user can leave reviews
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez vous pour creer un review!");
  }

  if (rating < 0 || rating > 10) {
    throw new Error("rating not in between 0 and 10!");
  }

  const results = await prisma.$transaction(async (tx) => {
    const existingReview = await tx.review.findUnique({
      where: {
        userId_mediaId: {
          userId: user.id,
          mediaId,
        },
      },
    });

    // cas 1: review existe deja
    if (existingReview) {
      throw new Error("A review for this media already exists!");
    }

    // cas 2: review n'existe pas
    if (!existingReview) {
      await tx.review.create({
        data: {
          userId: user.id,
          mediaId,
          rating,
          comments,
        },
      });

      return { action: "Ajout Review" };
    }
  });

  revalidatePath("/");
  revalidatePath("/reviews");

  return results;
}

export async function updateReview(
  reviewId: string,
  rating: number,
  comments: string | null,
) {
  // Only authentified user update a review
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez vous pour reagir!");
  }

  if (rating < 0 || rating > 10) {
    throw new Error("rating not in between 0 and 10!");
  }

  const results = await prisma.$transaction(async (tx) => {
    const existingReview = await tx.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    // cas 1: review existe
    if (existingReview) {
      // check if user owns review
      if (existingReview.userId !== user.id) {
        throw new Error("You do not have ownership of this review");
      }

      // updates the review
      await tx.review.update({
        where: {
          id: reviewId,
        },
        data: {
          rating,
          comments,
        },
      });

      return { action: "Updated Reviews" };
    }

    // cas 2: review n'existe pas
    if (!existingReview) {
      throw new Error("Non-existent review cannot be updated!");
    }
  });

  revalidatePath("/");
  revalidatePath("/reviews");

  return results;
}

export async function deleteReview(reviewId: string) {
  // Only authentified user can delete a review
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Connectez vous pour delete une review!");
  }

  const results = await prisma.$transaction(async (tx) => {
    const existingReview = await tx.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    // cas 1: review existe
    if (existingReview) {
      // check if user owns review or if admnin user is the one makinf the request
      if (existingReview.userId === user.id || user.role === Role.ADMIN) {
        // deletes the review
        await tx.review.delete({
          where: {
            id: reviewId,
          },
        });

        return { action: "Supprimer Review" };
      } else {
        throw new Error("You dont have permssions to delete this review");
      }
    }

    // cas 2: review n'existe pas
    if (!existingReview) {
      throw new Error("Non-existent review cannot be deleted!");
    }
  });

  revalidatePath("/");
  revalidatePath("/reviews");

  return results;
}

// returns a paginated list of all users review
// any user can see reviews; therefore no auth needed
export async function getReviews(page: number = 1, limit: number = 5) {
  const skip = (page - 1) * limit;

  const [reviews, total] = await await Promise.all([
    prisma.review.findMany({
      select: {
        userId: true,
        mediaId: true,
        rating: true,
        comments: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
      skip,
      take: limit,
    }),
    prisma.review.count(),
  ]);

  revalidatePath("/");
  revalidatePath("/reviews");

  return {
    reviews,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function getReviewById(reviewId: string) {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new Error("Review does not exist");
  }

  revalidatePath("/");
  revalidatePath("/reviews");

  return review;
}

export async function getReviewsByUserId(userId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      userId: userId,
    },
  });

  return reviews;
}

// returns a paginated list of all users review for a specific given media
// any user can see reviews; therefore no auth needed
export async function getReviewsByMedia(
  page: number = 1,
  limit: number = 5,
  mediaId: string,
) {
  const media = getMediaById(mediaId);

  if (!media) {
    throw new Error("Media does not exist");
  }

  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: {
        mediaId,
      },
      orderBy: { createdAt: "asc" },
      skip,
      take: limit,
    }),
    prisma.review.count({
      where: {
        mediaId,
      },
    }),
  ]);

  return {
    reviews,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}
