import {MediaCard} from "@/src/components/MediaCard";
import {anilistToMediaCard, getMediaPageFromAnilist} from "@/src/lib/anilist";
import {MediaType} from "../../lib/types";
import Link from "next/link";
import {getMediaListChoices} from "@/src/actions/mediaList.actions";
import {getCurrentUserRatings} from "@/src/actions/review.actions";

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
    const [mediaPage, lists] = await Promise.all([
        getMediaPageFromAnilist(selectedType),
        getMediaListChoices(),
    ]);

    if (!mediaPage) {
        return <p className="p-8">Impossible de charger le catalogue.</p>;
    }

    const medias = mediaPage.media.map((media) =>
        anilistToMediaCard(media, selectedType),
    );
    const ratings = await getCurrentUserRatings(
        medias.map((media) => Number(media.id)),
    );

    return (
        <main className="min-h-screen bg-base-200/60">
            <header className="border-b border-base-300 bg-base-100">
                <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                    <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-primary">Explorer</p>
                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Catalogue</h1>
                    <p className="mt-3 max-w-2xl text-lg opacity-60">
                        Découvre les œuvres les plus populaires et garde tes favorites à portée de main.
                    </p>

                    <div role="tablist" className="tabs tabs-box mt-7 w-fit bg-base-200 p-1">
                        <Link role="tab" href="/catalog?type=anime" className={`tab px-6 ${!isManga ? "tab-active font-bold" : ""}`}>Animes</Link>
                        <Link role="tab" href="/catalog?type=manga" className={`tab px-6 ${isManga ? "tab-active font-bold" : ""}`}>Mangas</Link>
                    </div>
                </div>
            </header>

            <section className="mx-auto grid max-w-7xl gap-6 px-6 py-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:px-8">
                {medias.map((media) => (
                    <MediaCard
                        key={`${media.type}-${media.id}`}
                        media={media}
                        lists={lists}
                        initialRating={ratings[Number(media.id)] ?? 0}
                    />
                ))}
            </section>
        </main>
    );
}
