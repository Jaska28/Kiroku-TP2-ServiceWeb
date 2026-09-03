import axios from "axios";

import {
    Genre,
    MediaFormat,
    MediaStatus,
    MediaType,
} from "@/generated/prisma/enums";

import {MediaCardData} from "@/src/lib/types";

const ANILIST_API = process.env.ANIME_API ?? "https://graphql.anilist.co";
const ANILIST_GRAPHQL_ENDPOINT = "https://graphql.anilist.co";

export const anilist = axios.create({
    baseURL:
        ANILIST_API.includes("graphql.anilist.co")
            ? ANILIST_GRAPHQL_ENDPOINT
            : ANILIST_API,
    timeout: 10_000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Data returned by Anilist
// represents anilist's API
export type AnilistMedia = {
    id: number;
    idMal?: number | null;
    title: {
        english?: string | null;
        romaji?: string | null;
        native?: string | null;
    };
    format?: string | null;
    status?: string | null;
    description?: string | null;
    coverImage?: {
        large?: string | null;
    };
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
      id
      idMal

      title {
        english
        romaji
        native
      }

      format
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
`;

const MEDIA_PAGE_QUERY = `
  query ($page: Int!, $perPage: Int!, $type: MediaType!) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
      }
      media(type: $type, sort: POPULARITY_DESC) {
        id
        idMal
        title {
          english
          romaji
          native
        }
        format
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

// Converts anilist genre into a prisma Genre value
function toGenre(value: string): Genre | null {
    const normalized = value.toUpperCase().replace(/-/g, "_").replace(/ /g, "_");

    if (normalized in Genre) {
        return normalized as Genre;
    }

    return null;
}

// Converts an array of anilisit genres into prisma genre
function mapGenres(genres: string[]): Genre[] {
    return genres.map(toGenre).filter((genre): genre is Genre => genre !== null);
}

// converts anilist format into prisma MediaFormat enum
function toMediaFormat(value?: string | null): MediaFormat {
    if (value && value in MediaFormat) {
        return value as MediaFormat;
    }

    return MediaFormat.TV;
}

// Converts anilist status into prisma MediaStatus enum
function toMediaStatus(value?: string | null): MediaStatus {
    if (value && value in MediaStatus) {
        return value as MediaStatus;
    }

    return MediaStatus.RELEASING;
}

/**
 * Retrieves an Anime or Manga from AniList.
 *
 * @param value - The AniList ID or search term.
 * @param searchField - Whether to search by "id" or "search".
 * @param type - ANIME or MANGA.
 */
export async function getMediaFromAnilist(
    value: number | string,
    searchField: "id" | "search",
    type: MediaType,
): Promise<AnilistMedia | null> {
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

        const {data} = await anilist.post("", {
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
    type: MediaType,
    page = 1,
    perPage = 12,
): Promise<AnilistMediaPage | null> {
    try {
        const {data} = await anilist.post("", {
            query: MEDIA_PAGE_QUERY,
            variables: {page, perPage, type},
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
export function mediaAnilistToPrisma(media: AnilistMedia, type: MediaType) {
    const title =
        media.title.english ??
        media.title.romaji ??
        media.title.native ??
        `AniList #${media.id}`;

    return {
        anilistId: media.id,
        idMal: media.idMal ?? null,
        title,
        description: media.description ?? null,
        type,
        format: toMediaFormat(media.format),
        status: toMediaStatus(media.status),
        bannerImgURL: media.coverImage?.large ?? null,
        malAvgScore: media.averageScore != null ? media.averageScore / 10 : null,
        releaseYear: media.startDate?.year ?? new Date().getFullYear(),
        genre: mapGenres(media.genres ?? []),
    };
}


export function anilistToMediaCard(
    media: AnilistMedia,
    type: MediaType,
):MediaCardData {
    return {
        id: String(media.id),
        title:
            media.title.english ??
            media.title.romaji ??
            media.title.native ??
            `AniList #${media.id}`,
        description: media.description ?? null,
        imageUrl: media.coverImage?.large ?? "",
        score:
            media.averageScore != null
                ? media.averageScore / 10
                : null,
        releaseYear: media.startDate?.year ?? null,
        genres: media.genres ?? [],
        type: type === MediaType.ANIME ? "Anime" : "Manga",    };
}
