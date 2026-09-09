# Kiroku — Guide de test

Application d’évaluation d’œuvres avec Next.js (autorisé par le professeur), Prisma/Neon, Clerk et AniList avec Axios.

## 1. Installer et lancer

Prérequis : Node.js 24 LTS, npm, une base Neon et les clés d’une application Clerk dont vous pouvez consulter les utilisateurs dans le tableau de bord. Une connexion Internet est nécessaire.

Créer `.env` à la racine avec votre configuration :

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
ADMIN_USR_ID=
```

Les clés Clerk doivent appartenir à la même application. Ne pas committer `.env`. Utiliser ce même fichier pour le serveur et le seed afin de cibler la même base.

À la racine du dépôt :

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## 2. Devenir admin

1. S’inscrire dans Kiroku, puis se connecter.
2. Dans le tableau de bord de l’application Clerk utilisée, ouvrir **Users**, sélectionner votre compte et copier son **User ID** (`user_...`).
3. Mettre cet identifiant dans `.env` :

   ```env
   ADMIN_USR_ID=user_votre_identifiant
   ```

4. Arrêter le serveur avec `Ctrl+C`, puis relancer `npm run dev`.
5. Ouvrir **Mes listes** avec ce compte connecté. Cela crée ou met à jour l’utilisateur Prisma avec le rôle `ADMIN`. Le titre **Toutes les listes** et le badge **Admin** confirment le rôle.

Changer `ADMIN_USR_ID` ne retire pas le rôle des anciens admins. Le seed ne crée pas votre compte Clerk : effectuer ces étapes avant de le lancer.

## 3. Générer les exemples

Script : [prisma/seed.ts](prisma/seed.ts).

Pour tester les deux rôles avec ce même compte, ajouter `DEMO_MODE=true` dans
`.env` et redémarrer `npm run dev`. Le bouton **Test : Admin / User**, à gauche
de l’avatar, affiche le rôle actuel et permet de basculer vers l’autre rôle.
Il change le rôle dans Prisma et actualise les permissions. Il est réservé au
compte `ADMIN_USR_ID` et fonctionne uniquement en développement.
En mode démo, le rôle choisi est conservé lors de la synchronisation.
Pour quitter ce mode, retirer `DEMO_MODE=true` et redémarrer le serveur :
le compte configuré redevient admin à la prochaine synchronisation.

Dans un deuxième terminal, à la racine du dépôt :

```bash
npm run db:seed
```

**Chaque exécution supprime toutes les listes et leurs éléments, pour tous les utilisateurs**, puis crée les quatre exemples ci-dessous. Les comptes, œuvres et évaluations sont conservés. En cas d’échec, la transaction annule les changements.

| Liste | Propriétaire | Visibilité |
|---|---|---|
| Demo 1 | Utilisateur fictif | Publique |
| Demo 2 | Utilisateur fictif | Publique |
| Demo 3 | Votre compte (`ADMIN_USR_ID`) | Publique |
| Demo 4 | Votre compte (`ADMIN_USR_ID`) | Privée |

L’utilisateur fictif `kiroku_demo_fictif` a le rôle `USER` et existe uniquement dans Prisma : il ne peut pas se connecter. `SEED_USER_CLERK_ID` n’est pas nécessaire.

La base modifiée dépend de `DATABASE_URL`, pas de l’ordinateur utilisé. Avec la même
base Neon que l’équipe, le seed supprime aussi les listes de l’équipe, puis attribue
`Demo 3` et `Demo 4` au compte indiqué par `ADMIN_USR_ID` dans votre `.env`.
Avec une base Neon distincte, les données de l’équipe ne sont pas touchées.

Si le seed indique que le compte est absent de Prisma, vérifier `ADMIN_USR_ID`, puis ouvrir **Mes listes** avec ce compte connecté avant de relancer la commande.

## 4. Tester

1. **Afficher** : actualiser **Mes listes** comme admin; les quatre listes apparaissent avec leur créateur.
2. **Créer et modifier** : créer une liste, puis modifier son nom, sa description et sa visibilité. Recharger pour vérifier la sauvegarde.
3. **Gérer les œuvres** : depuis le catalogue, ajouter une œuvre à une liste personnelle, la noter, retirer la note puis noter à nouveau. Retirer ensuite l’œuvre de la liste.
4. **Supprimer comme admin** : supprimer `Demo 1`, qui appartient à l’utilisateur fictif. L’admin peut supprimer les listes des autres; leur modification reste réservée au propriétaire.
5. **Vérifier la confidentialité** : copier l’URL de `Demo 4`, se déconnecter et l’ouvrir. La liste privée doit être inaccessible; les listes publiques restent consultables.
6. **Comparer les rôles** : créer un deuxième compte Clerk sans changer `ADMIN_USR_ID`. Il peut gérer ses listes, mais ne voit pas de bouton pour supprimer celles des autres. Le serveur vérifie aussi cette permission.

Relancer le seed pour rétablir les exemples si nécessaire.
