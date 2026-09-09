import "dotenv/config";
import {PrismaNeon} from "@prisma/adapter-neon";
import {PrismaClient} from "../generated/prisma/client";

async function main() {
    const connectionString = process.env.DATABASE_URL;
    const adminClerkId = process.env.ADMIN_USR_ID;
    if (!connectionString || !adminClerkId) {
        throw new Error("Configure DATABASE_URL et ADMIN_USR_ID dans .env avant de lancer le seed.");
    }

    const prisma = new PrismaClient({adapter: new PrismaNeon({connectionString})});

    try {
        const examples = [
            {
                name: "Demo 1",
                desc: "Faux user, liste publique.",
                isPublic: true,
                media: [{anilistId: 1, title: "Cowboy Bebop"}, {anilistId: 20, title: "Naruto"}],
            },
            {
                name: "Demo 2",
                desc: "Faux user, liste publique de favoris.",
                isPublic: true,
                media: [{anilistId: 16498, title: "Shingeki no Kyojin"}],
            },
        ];

        await prisma.$transaction(async (tx) => {
            const admin = await tx.user.findUnique({where: {clerkId: adminClerkId}});
            if (!admin) {
                throw new Error("Compte ADMIN_USR_ID absent de Prisma : connecte-toi et ouvre Mes listes avant de relancer le seed.");
            }
            await tx.mediaListItem.deleteMany();
            await tx.mediaList.deleteMany();

            const user = await tx.user.upsert({
                where: {clerkId: "seed:kiroku:demo-user"},
                update: {role: "USER"},
                create: {
                    clerkId: "seed:kiroku:demo-user",
                    username: "kiroku_demo_fictif",
                    firstName: "Utilisateur",
                    lastName: "Démo",
                    role: "USER",
                },
            });
            const allExamples = [
                ...examples.map((example) => ({...example, userId: user.userId})),
                {
                    userId: admin.userId,
                    name: "Demo 3",
                    desc: "Mon compte, liste publique.",
                    isPublic: true,
                    media: [{anilistId: 20, title: "Naruto"}],
                },
                {
                    userId: admin.userId,
                    name: "Demo 4",
                    desc: "Mon compte, liste privée.",
                    isPublic: false,
                    media: [{anilistId: 1, title: "Cowboy Bebop"}, {anilistId: 16498, title: "Shingeki no Kyojin"}],
                },
            ];
            for (const example of allExamples) {
                const list = await tx.mediaList.create({
                    data: {
                        userId: example.userId,
                        name: example.name,
                        desc: example.desc,
                        isPublic: example.isPublic,
                    },
                });

                for (const item of example.media) {
                    const media = await tx.media.upsert({
                        where: {anilistId: item.anilistId},
                        update: {},
                        create: item,
                    });
                    await tx.mediaListItem.upsert({
                        where: {mediaListId_mediaId: {mediaListId: list.mediaListId, mediaId: media.mediaId}},
                        update: {},
                        create: {mediaListId: list.mediaListId, mediaId: media.mediaId},
                    });
                }
            }
        });
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Échec du seed.");
    process.exitCode = 1;
});
