import {notFound} from "next/navigation";
import {MediaType} from "@/src/lib/types";
import {getMediaFromAnilist} from "@/src/lib/anilist";

type Props = {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{
        type?: string;
    }>;
};

export default async function MediaPage(
    {
        params,
        searchParams,
    }: Props) {
    const {id} = await params;
    const {type} = await searchParams;

    const anilistId = Number(id);

    if (!Number.isInteger(anilistId)) {
        notFound();
    }

    const mediaType =
        type === "manga"
            ? MediaType.MANGA
            : MediaType.ANIME;

    const media = await getMediaFromAnilist(
        anilistId,
        "id",
        mediaType,
    );

    if (!media) {
        notFound();
    }

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold">
                {media.title.english ??
                    media.title.romaji ??
                    media.title.native}
            </h1>

            <img
                src={media.coverImage?.large ?? ""}
                alt=""
            />

            <p>{media.description}</p>
        </main>
    );
}