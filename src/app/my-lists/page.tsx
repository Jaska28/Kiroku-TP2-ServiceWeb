import {getDemoUserMediaLists} from "@/src/actions/mediaList.actions";
import {MediaListCard} from "@/src/components/MediaListCard";
import {CreateListForm} from "@/src/components/CreateListForm";

export default async function MyListsPage() {
    const lists = await getDemoUserMediaLists();

    return (
        <main className="p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Mes listes</h1>
                    <p className="mt-1 opacity-70">Organise les œuvres que tu veux suivre.</p>
                </div>
            </div>

            <label htmlFor="create-list-modal" className="btn btn-primary">
                Créer une liste
            </label>

            <input
                id="create-list-modal"
                type="checkbox"
                className="modal-toggle"
            />

            <div className="modal" role="dialog">
                <div className="modal-box">
                    <CreateListForm/>

                    <div className="modal-action">
                        <label htmlFor="create-list-modal" className="btn">
                            Fermer
                        </label>
                    </div>
                </div>

                <label
                    htmlFor="create-list-modal"
                    className="modal-backdrop"
                >
                    Fermer
                </label>
            </div>

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {lists.map((list) => (
                    <MediaListCard key={list.mediaListId} list={list}/>
                ))}
            </section>
        </main>
    );
}
