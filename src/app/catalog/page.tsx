import {MediaCard} from "@/src/components/MediaCard";
import type {Media} from "@/src/lib/types";

const fakeMedia: Media[] = [
    {
        id: "test-media-1", malId: 5114, title: "Fullmetal Alchemist: Brotherhood",
        description: "Deux frères cherchent à réparer les conséquences d'une transmutation interdite.",
        type:"Anime", format: 0, status: 0,
        bannerImgURL: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx121-zjmixZ428Mwv.png",
        avgScore: 8.7, malAvgScore: 91, releaseYear: 2009,
        genre: ["Action", "Adventure", "Drama", "Fantasy"],
        createAt: new Date(), mediaListItems: [], reviews: [],
    },
    {
        id: "test-media-2", malId: 1535, title: "Death Note",
        description: "Un étudiant découvre un carnet capable de tuer toute personne dont le nom y est écrit.",
        type: "Anime", format: 0, status: 0,
        bannerImgURL: "https://placehold.co/240x340/312e81/ffffff?text=Death+Note",
        avgScore: 8.4, malAvgScore: 89, releaseYear: 2006,
        genre: ["Mystery", "Psychological", "Supernatural", "Thriller"],
        createAt: new Date(), mediaListItems: [], reviews: [],
    },
    {
        id: "test-media-3", malId: 16498, title: "Attack on Titan",
        description: "L'humanité lutte pour survivre derrière d'immenses murs.",
        type: "Anime", format: 0, status: 0,
        bannerImgURL: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-buvcRTBx4NSm.jpg",
        avgScore: 9.1, malAvgScore: 84, releaseYear: 2013,
        genre: ["Action", "Drama", "Fantasy", "Mystery"],
        createAt: new Date(), mediaListItems: [], reviews: [],
    },
    {
        id: "test-media-4", malId: 9253, title: "Steins;Gate",
        description: "Un groupe d'amis découvre une façon de transmettre des messages dans le passé.",
        type: "Anime", format: 0, status: 0,
        bannerImgURL: "https://placehold.co/240x340/0f766e/ffffff?text=Steins%3BGate",
        avgScore: 8.9, malAvgScore: 90, releaseYear: 2011,
        genre: ["Drama", "Psychological", "Sci-Fi", "Thriller"],
        createAt: new Date(), mediaListItems: [], reviews: [],
    },
];

export default function CatalogPage() {
    return (
        <section className="grid gap-6 p-8 xl:grid-cols-3">
            {fakeMedia.map((media) => (
                <MediaCard key={media.id} media={media}/>
            ))}
        </section>
    );
}
