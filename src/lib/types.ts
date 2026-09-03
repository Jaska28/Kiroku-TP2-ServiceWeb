enum MediaType {
    ANIME = "Anime",
    MANGA = "Manga",
}

enum MediaFormat {
    TV,
    TV_SHORT,
    MOVIE,
    SPECIAL,
    OVA,
    ONA,
    MUSIC,
    MANGA,
    NOVEL,
    ONE_SHOT,
}

enum MediaStatus {
    FINISHED,
    RELEASING,
    NOT_YET_RELEASED,
    CANCELLED,
    HIATUS,
}

enum Role {
    USER,
    ADMIN,
}

export type Media = {
    id: string;
    idMal: number; // Id from MyAnimeList
    title: string;
    description: string;
    type: MediaType;
    format: MediaFormat;
    status: MediaStatus;
    bannerImage: string;
    averageScore: number; // Our backend avr score
    malAvgScore: number;
    seasonYear: number;
    genres: string[];
    createAt: Date;
    mediaListItems: MediaListItem[];
    reviews: Review[];
}

export type MediaList = {
    id: string;
    userId: string;
    name: string;
    description: string;
    isPublic: boolean;
    createdAt: Date;
    user: User;
    mediaListItems: MediaListItem[];
}


type MediaListItem = {
    id: string;
    mediaListId: string;
    mediaId: string;
    addedAt: Date;
}

type Review = {
    id: string;
    userId: string;
    mediaId: string;
    rating: number;
    comments: string;
    createdAt: Date;
}

type User = {
    id: string
    username: string;
    password: string;
    role: Role;
    createdAt: Date;
    mediaLists: MediaList[];
    reviews: Review[];
}
export type MediaCardData = {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    score: number | null;
    releaseYear: number | null;
    genres: string[];
    type: "Anime" | "Manga";
};

export type MediaListPreview = {
    id: string;
    name: string;
    description: string;
    isPublic: boolean;
    media: {
        id: number;
        title: string;
        type: "Anime" | "Manga";
    }[];
};
