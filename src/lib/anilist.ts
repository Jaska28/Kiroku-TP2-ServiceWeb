"use server";

import axios from "axios";

const ANILIST_API = process.env.ANIME_API ?? "https://graphql.anilist.co";

export const anilist = axios.create({
  baseURL: ANILIST_API,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Data returned by Anilist
// represents anilist's API
export type AnilistMedia = {
  anilistId: number;
  idMal?: number | null;
  title: {
    english?: string | null;
    romaji?: string | null;
    native?: string | null;
  };
};

// GraphQl query used to retrieve media from AniList.
// Supports both: id, title
// unused variable is ignored by Anilist
const MEDIA_QUERY = `
  query ($id: Int, $search: String) {
    Media(
      id: $id
      search: $search
    ) {
      id
      idMal
      title {
        english
        romaji
        native
      }
    }
  }
`;

/**
 * Retrieves an Anime or Manga from AniList.
 *
 * @param value - The AniList ID or search term.
 * @param searchField - Whether to search by "id" or "title".
 *
 */
export async function getMediaFromAnilist(
  value: number | string,
  searchField: "id" | "search",
): Promise<AnilistMedia | null> {
  try {
    const variables =
      searchField === "id"
        ? {
            id: Number(value),
          }
        : {
            search: String(value),
          };

    const { data } = await anilist.post("", {
      query: MEDIA_QUERY,
      variables,
    });

    const media = data?.data?.Media as AnilistMedia | null;

    if (!media) {
      return null;
    }

    return media;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Anilist request failed:",
        error.response?.status,
        error.response?.data,
      );
    } else {
      console.error("Anilist request failed:", error);
    }

    return null;
  }
}

// Converts anilist media data into suitable data for prisma
// DOESNT WRITE TO DB
export function mediaAnilistToPrisma(media: AnilistMedia) {
  const title =
    media.title.english ??
    media.title.romaji ??
    media.title.native ??
    `AniList #${media.anilistId}`;

  return {
    anilistId: media.anilistId,
    idMal: media.idMal ?? null,
    title,
  };
}
