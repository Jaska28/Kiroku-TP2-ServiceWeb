import {getCurrentUserMediaLists} from "@/src/actions/mediaList.actions";
import {MediaListCard} from "@/src/components/MediaListCard";
import {CreateListForm} from "@/src/components/CreateListForm";

export default async function MyListsPage() {
    const lists = await getCurrentUserMediaLists();

    return (
        <main className="min-h-screen bg-base-200/60">
            <header className="border-b border-base-300 bg-base-100">
                <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-6 py-10 lg:px-8">
                    <div>
                        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-primary">Ta collection</p>
                        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Mes listes</h1>
                        <p className="mt-3 text-lg opacity-60">Organise les œuvres que tu veux suivre.</p>
                    </div>
                    <label htmlFor="create-list-modal" className="btn btn-primary shadow-lg shadow-primary/20">
                        <span className="text-lg" aria-hidden="true">+</span> Créer une liste
                    </label>
                </div>

            </header>

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

            <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                {lists.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-primary/30 bg-base-100 px-6 py-20 text-center">
                        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-primary/10 text-3xl text-primary">+</div>
                        <h2 className="text-2xl font-bold">Ta bibliothèque est encore vide</h2>
                        <p className="mx-auto mt-2 max-w-md opacity-60">Crée une première liste pour regrouper les œuvres à voir, tes favorites ou celles que tu as terminées.</p>
                        <label htmlFor="create-list-modal" className="btn btn-primary mt-6">Créer ma première liste</label>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {lists.map((list) => (
                            <MediaListCard key={list.mediaListId} list={list}/>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
