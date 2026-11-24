@AGENTS.md

# Kiroku

Kiroku est une application Next.js et TypeScript de découverte d’animes et de mangas. Elle utilise Clerk, Prisma avec PostgreSQL sur Neon et AniList. Le [cahier des charges](docs/cahier-des-charges.md) spécifie le panier et la bibliothèque d’achats simulés avec Stripe en mode test.

- Lancer le projet avec `npm run dev` et vérifier le code avec `npm run lint`.
- Conserver tous les montants en cents. Calculer la TPS et la TVQ séparément sur le sous-total (RM-04).
- Confirmer un paiement à partir d’un webhook Stripe signé. Dédupliquer les événements et filtrer la bibliothèque par compte (RM-05 et RM-06).
- Appliquer le remboursement intégral sur demande dans les 14 jours suivant le paiement (RM-08).
- Garder les secrets hors du dépôt et utiliser uniquement des données fictives pour le laboratoire.
