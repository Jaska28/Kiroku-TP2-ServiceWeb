import {MediaCard} from "@/src/components/MediaCard";
import {anilistToMediaCard, getMediaPageFromAnilist} from "@/src/lib/anilist";
import {MediaType} from "@/generated/prisma/enums";
import Link from "next/link";

type Props = {
    searchParams: Promise<{
        type?: string | string[];
    }>;
};

export default async function CatalogPage({searchParams}: Props) {
    const params = await searchParams;
    const selectedType = params.type === "manga"
        ? MediaType.MANGA
        : MediaType.ANIME;
    const isManga = selectedType === MediaType.MANGA;
    const mediaPage = await getMediaPageFromAnilist(selectedType);

    if (!mediaPage) {
        return <p className="p-8">Impossible de charger le catalogue.</p>;
    }

    const medias = mediaPage.media.map((media) =>
        anilistToMediaCard(media, selectedType),
    );

    return (
        <main className="p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">
                    Catalogue de {isManga ? "mangas" : "animes"}
                </h1>

                <Link
                    href={isManga ? "/catalog?type=anime" : "/catalog?type=manga"}
                    className="btn btn-primary"
                >
                    Voir les {isManga ? "animes" : "mangas"}
                </Link>
            </div>

            <section className="grid gap-6 xl:grid-cols-3">
                {medias.map((media) => (
                    <MediaCard key={media.id} media={media}/>
                ))}
            </section>
        </main>
    );
}
