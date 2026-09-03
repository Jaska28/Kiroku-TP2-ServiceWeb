# Laboratoire 2 — Fiche de remise

> À déposer sur Teams. Ce fichier doit contenir la **liste des membres** et le **lien du dépôt GitHub**.

## 👥 Équipe

| Nom complet    | Matricule | (Optionnel) rôle |
|----------------|-----------|------------------|
| Jean-Simon Cyr | 0000000   | Frontend         |
| Émile Valade   | 0000000   | Backend          |


## 🎯 Sujet (choisi au Laboratoire 1)

Sujet : _Évaluation d'œuvres_

## 🔗 Dépôt GitHub

Lien : [https://github.com/UTILISATEUR/NOM-DU-DEPOT](https://github.com/Jaska28/Kiroku-TP2-ServiceWeb)

## ▶️ Lancer le projet

Backend :

```bash
cd backend
npm install
npm run dev        # http://localhost:3000
```

Frontend :

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Variables d'environnement à créer (non committées) : `DATABASE_URL`, `JWT_SECRET`.

## ✅ Fonctionnalités réalisées

- [ ] Backend : CRUD complet
- [ ] Backend : authentification JWT + rôles
- [ ] Backend : intégration de l'API publique (Axios)
- [ ] Backend : CORS activé
- [ ] Frontend : affichage des données (useEffect + axios, 3 états)
- [ ] Frontend : formulaire(s) de création
- [ ] Frontend : connexion / inscription (token + AuthContext)
- [ ] Frontend : action protégée (visible seulement si connecté)

## 📝 Remarques (facultatif)
Jean-Simon: Je me suis mélangé souvent à cause que nous n'utilisions pas tout le temps les mêmes noms d'éléments à notre type.
J'ai été chercher l'information sur leur apollo et je me suis fier à leurs noms:https://studio.apollographql.com/sandbox/schema/reference/objects/Media
...

