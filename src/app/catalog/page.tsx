import {MediaCard} from "@/src/components/MediaCard";
import {anilistToMediaCard, getMediaFromAnilist} from "@/src/lib/anilist";
import {MediaType} from "@/generated/prisma/enums";


export default async function CatalogPage() {
    const anilistMedia = await getMediaFromAnilist(10, "id", MediaType.ANIME);

    if (!anilistMedia) {
        return <p className="p-8">Impossible de charger le média.</p>;
    }

    const media = anilistToMediaCard(anilistMedia, MediaType.ANIME);

    return (
        <section className="grid gap-6 p-8 xl:grid-cols-3">
            <MediaCard media={media}/>
        </section>
    );
}
