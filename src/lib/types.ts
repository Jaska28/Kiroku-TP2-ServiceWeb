enum MediaType {
    ANIME,
    MANGA,
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

enum Genre {
    ACTION,
    ADVENTURE,
    COMEDY,
    DRAMA,
    FANTASY,
    HORROR,
    MAGICAL_GIRL,
    MECHA,
    MUSIC,
    MYSTERY,
    PSYCHOLOGICAL,
    ROMANCE,
    SCI_FI,
    SLICE_OF_LIFE,
    SPORTS,
    SUPERNATURAL,
    THRILLER,
}

enum Role {
    USER,
    ADMIN,
}

export type Media = {
    id: string;
    malId: number; // Id from MyAnimeList
    title: string;
    description: string;
    type: MediaType;
    format: MediaFormat;
    status: MediaStatus;
    bannerImgURL: string;
    avgScore: number;
    malAvgScore: number;
    releaseYear: number;
    genre: Genre[];
    createAt: Date;
    mediaListItems: MediaListItem[];
    reviews: Review[];
}

type MediaList = {
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