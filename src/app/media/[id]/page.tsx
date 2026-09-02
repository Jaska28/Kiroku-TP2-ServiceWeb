import {prisma} from "@/src/lib/prisma";
import {notFound} from "next/navigation";

type Props = {
    params: Promise<{
        id: string;
    }>;
}

export default async function MediaPage({params}: Props) {
    const {id} = await params;

    const media = await prisma.media.findUnique({
        where: {id},
    });

    if(!media) {
        notFound();
    }

    return (
        <main className={"p-8"}>
            <h1 className={"text-2xl font-bold"}>
                Page du média
            </h1>

            <p>ID : {id}</p>
        </main>
    )
};