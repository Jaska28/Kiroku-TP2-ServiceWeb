import axios from "axios";

import { MediaCardData } from "@/src/lib/types";

const ANILIST_API = process.env.ANIME_API ?? "https://graphql.anilist.co";
const ANILIST_GRAPHQL_ENDPOINT = "https://graphql.anilist.co";

export const anilist = axios.create({
  baseURL: ANILIST_API.includes("graphql.anilist.co")
    ? ANILIST_GRAPHQL_ENDPOINT
    : ANILIST_API,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// AniList currently exposes these two MediaType values. Keeping them locally
// avoids making the whole application depend on a schema request at startup.
export const mediaTypes: string[] = ["ANIME", "MANGA"];

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
  format?: string | null;
  type?: string | null;
  status?: string | null;
  episodes?: number | null;
  chapters?: number | null;
  volumes?: number | null;
  duration?: number | null;
  source?: string | null;
  description?: string | null;
  coverImage?: {
    large?: string | null;
  };
  bannerImage?: string | null;
  genres?: string[];
  averageScore?: number | null;
  startDate?: {
    year?: number | null;
  };
};

// GraphQl query used to retrieve media from AniList.
// Supports both: id, title
// unused variable is ignored by Anilist
const MEDIA_QUERY = `
  query ($id: Int, $search: String, $type: MediaType) {
    Media(
      id: $id
      search: $search
      type: $type
    ) {
      anilistId:id
      idMal
      title {
        english
        romaji
        native
      }
      type
      format
      status
      episodes
      chapters
      volumes
      duration
      source
      description
      coverImage {
        large
      }
      bannerImage
      genres
      averageScore
      startDate {
        year
      }
    }
  }
`;

const MEDIA_PAGE_QUERY = `
  query ($page: Int!, $perPage: Int!, $type: MediaType) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
      }
      media(type: $type, sort: POPULARITY_DESC) {
        anilistId:id
        idMal
        title {
          english
          romaji
          native
        }
        format
        type
        status
        description
        coverImage {
          large
        }
        genres
        averageScore
        startDate {
          year
        }
      }
    }
  }
`;

export type AnilistMediaPage = {
  media: AnilistMedia[];
  pageInfo: {
    currentPage: number;
    hasNextPage: boolean;
  };
};

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
  type?: string,
): Promise<AnilistMedia | null> {
  if (type && !mediaTypes.includes(type)) {
    throw new Error("Type doesnt exist");
  }

  try {
    const variables =
      searchField === "id"
        ? {
            id: Number(value),
            type,
          }
        : {
            search: String(value),
            type,
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
        {
          configuredApi: ANILIST_API,
          resolvedBaseUrl: anilist.defaults.baseURL,
        },
        error.response?.status,
        error.response?.data,
      );
    } else {
      console.error("Anilist request failed:", error);
    }

    return null;
  }
}

/** Retrieves one page of popular Anime or Manga from AniList. */
export async function getMediaPageFromAnilist(
  type: string,
  page = 1,
  perPage = 12,
): Promise<AnilistMediaPage | null> {
  if (!mediaTypes.includes(type)) {
    throw new Error("Type doesnt exist");
  }
  try {
    const { data } = await anilist.post("", {
      query: MEDIA_PAGE_QUERY,
      variables: { page, perPage, type },
    });

    const mediaPage = data?.data?.Page as AnilistMediaPage | null;

    if (!mediaPage) {
      return null;
    }

    return mediaPage;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "AniList page request failed:",
        error.response?.status,
        error.response?.data,
      );
    } else {
      console.error("AniList page request failed:", error);
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

export function anilistToMediaCard(
  media: AnilistMedia,
  type: string,
): MediaCardData {
  if (!mediaTypes.includes(type)) {
    throw new Error("Type doesnt exist");
  }

  return {
    id: String(media.anilistId),
    title:
      media.title.english ??
      media.title.romaji ??
      media.title.native ??
      `AniList #${media.anilistId}`,
    description: media.description ?? null,
    imageUrl: media.coverImage?.large ?? "",
    score: media.averageScore != null ? media.averageScore / 10 : null,
    releaseYear: media.startDate?.year ?? null,
    genres: media.genres ?? [],
    type: type,
  };
}
