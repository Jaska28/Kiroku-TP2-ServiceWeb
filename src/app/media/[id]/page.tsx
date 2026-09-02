type Props = {
    params: Promise<{
        id: string;
    }>;
}

export default async function MediaPage({params}: Props) {
    const {id} = await params;

    return (
        <main className={"p-8"}>
            <h1 className={"text-2xl font-bold"}>
                Page du média
            </h1>

            <p>ID : {id}</p>
        </main>
    )
};