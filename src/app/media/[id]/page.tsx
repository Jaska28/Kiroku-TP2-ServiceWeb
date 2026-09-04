import {notFound} from "next/navigation";
import Link from "next/link";
import {MediaType} from "@/src/lib/types";
import {getMediaFromAnilist} from "@/src/lib/anilist";
import {MediaRatingControl} from "@/src/components/MediaRatingControl";
import {getCurrentUserRatings} from "@/src/actions/review.actions";

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
        type?.toUpperCase() === MediaType.MANGA
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

    const ratings = await getCurrentUserRatings([anilistId]);
    const title = media.title.english ?? media.title.romaji ?? media.title.native ?? `AniList #${anilistId}`;
    const catalogType = mediaType.toLowerCase();
    const description = media.description
        ?.replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&#039;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&");

    const statusLabels: Record<string, string> = {
        FINISHED: "Terminé",
        RELEASING: "En cours",
        NOT_YET_RELEASED: "À venir",
        CANCELLED: "Annulé",
        HIATUS: "En pause",
    };
    const formatLabels: Record<string, string> = {
        TV: "Série télévisée",
        TV_SHORT: "Série courte",
        MOVIE: "Film",
        SPECIAL: "Spécial",
        OVA: "OVA",
        ONA: "ONA",
        MUSIC: "Clip musical",
        MANGA: "Manga",
        NOVEL: "Roman",
        ONE_SHOT: "One-shot",
    };
    const sourceLabels: Record<string, string> = {
        ORIGINAL: "Œuvre originale",
        MANGA: "Manga",
        LIGHT_NOVEL: "Light novel",
        VISUAL_NOVEL: "Visual novel",
        VIDEO_GAME: "Jeu vidéo",
        NOVEL: "Roman",
        WEB_NOVEL: "Web novel",
        OTHER: "Autre",
    };

    const stats = [
        {
            label: "Score AniList",
            value: media.averageScore != null ? `${(media.averageScore / 10).toFixed(1)}/10` : null,
        },
        {label: "Année de sortie", value: media.startDate?.year},
        {
            label: mediaType === MediaType.MANGA ? "Chapitres" : "Épisodes",
            value: mediaType === MediaType.MANGA ? media.chapters : media.episodes,
        },
        ...(mediaType === MediaType.MANGA
            ? [{label: "Volumes", value: media.volumes}]
            : [{label: "Durée par épisode", value: media.duration ? `${media.duration} min` : null}]),
        {label: "Format", value: media.format ? (formatLabels[media.format] ?? media.format) : null},
        {label: "Statut", value: media.status ? (statusLabels[media.status] ?? media.status) : null},
        {label: "Source", value: media.source ? (sourceLabels[media.source] ?? media.source.replaceAll("_", " ")) : null},
    ].filter((stat) => stat.value != null);

    return (
        <main className="min-h-screen bg-base-200">
            <section className="relative overflow-hidden bg-neutral text-neutral-content">
                {media.bannerImage && (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-105"
                        style={{backgroundImage: `url(${media.bannerImage})`}}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral via-neutral/80 to-neutral/30"/>

                <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-6 md:pt-16">
                    <Link href={`/catalog?type=${catalogType}`} className="btn btn-ghost btn-sm mb-6">
                        ← Retour aux {mediaType === MediaType.MANGA ? "mangas" : "animes"}
                    </Link>

                    <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-end">
                        <img
                            src={media.coverImage?.large ?? ""}
                            alt={`Couverture de ${title}`}
                            className="aspect-[2/3] w-44 rounded-2xl object-cover shadow-2xl md:w-full"
                        />

                        <div>
                            <div className="mb-3 flex flex-wrap gap-2">
                                <span className="badge badge-primary">{mediaType}</span>
                            </div>
                            <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">{title}</h1>
                            {media.title.romaji && media.title.romaji !== title && (
                                <p className="mt-2 text-lg opacity-70">{media.title.romaji}</p>
                            )}
                            <div className="mt-6 max-w-sm rounded-xl bg-black/25 p-4 backdrop-blur-sm">
                                <p className="mb-2 text-sm font-semibold uppercase tracking-wide opacity-70">Ta note</p>
                                <MediaRatingControl
                                    anilistId={anilistId}
                                    type={mediaType}
                                    initialRating={ratings[anilistId] ?? 0}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_280px]">
                <article className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title text-2xl">Synopsis</h2>
                        <p className="whitespace-pre-line leading-7 opacity-80">
                            {description || "Aucun synopsis disponible."}
                        </p>
                    </div>
                </article>

                <aside className="space-y-6">
                    <div className="card bg-base-100 shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title">Informations</h2>
                            <dl className="divide-y divide-base-300">
                                {stats.map((stat) => (
                                    <div className="flex items-center justify-between gap-4 py-3" key={stat.label}>
                                        <dt className="text-sm opacity-60">{stat.label}</dt>
                                        <dd className="text-right font-semibold">{stat.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                    <div className="card bg-base-100 shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title">Genres</h2>
                        <div className="flex flex-wrap gap-2">
                            {media.genres?.length
                                ? media.genres.map((genre) => <span className="badge badge-info" key={genre}>{genre}</span>)
                                : <span className="opacity-60">Non renseignés</span>}
                        </div>
                    </div>
                    </div>
                </aside>
            </section>
        </main>
    );
}
