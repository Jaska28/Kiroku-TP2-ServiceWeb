import {MediaCard} from "@/src/components/MediaCard";
import {anilistToMediaCard, getMediaPageFromAnilist} from "@/src/lib/anilist";
import {MediaType} from "@/generated/prisma/enums";


export default async function CatalogPage() {
    const mediaPage = await getMediaPageFromAnilist(MediaType.ANIME);

    if (!mediaPage) {
        return <p className="p-8">Impossible de charger le catalogue.</p>;
    }

    const medias = mediaPage.media.map((media) =>
        anilistToMediaCard(media, MediaType.ANIME),
    );

    return (
        <main className="p-8">
            <h1 className="mb-6 text-3xl font-bold">Catalogue d&apos;animes</h1>

            <section className="grid gap-6 xl:grid-cols-3">
                {medias.map((media) => (
                    <MediaCard key={media.id} media={media}/>
                ))}
            </section>
        </main>
    );
}
