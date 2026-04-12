# Guide : Lier Google Sheets à Lifeline 🚀

Ce guide vous explique étape par étape comment connecter votre feuille de calcul Google Sheets à votre application. Ne vous inquiétez pas, nous allons faire cela ensemble !

## Étape 1 : Créer votre Google Sheet

1. Allez sur [Google Sheets](https://sheets.new).
2. Donnez un nom à votre fichier (ex: `Lifeline Data`).
3. Dans la **première ligne** (les en-têtes), écrivez exactement ces noms de colonnes :
   `id`, `year`, `date`, `title`, `type`, `value`, `circumstances`, `imageUrl`, `color`, `lineWidth`
4. Récupérez l'**ID de votre feuille** dans l'URL.
   * L'URL ressemble à ceci : `https://docs.google.com/spreadsheets/d/VOTRE_ID_ICI/edit`
   * Copiez la partie entre `/d/` et `/edit`.

---

## Étape 2 : Créer un Compte de Service (Google Cloud)

C'est ici que l'application obtient la "clé" pour lire votre fichier.

1. Allez sur la [Console Google Cloud](https://console.cloud.google.com/).
2. Créez un nouveau projet (cliquez sur le nom du projet en haut à gauche -> "Nouveau projet").
3. Recherchez **"Google Sheets API"** dans la barre de recherche et cliquez sur **"Activer"**.
4. Allez dans l'onglet **"Identifiants"** (Credentials) à gauche.
5. Cliquez sur **"+ Créer des identifiants"** -> **"Compte de service"**.
6. Donnez-lui un nom (ex: `lifeline-app`) et cliquez sur **"Créer et continuer"**.
7. Sautez les étapes optionnelles et cliquez sur **"OK"**.
8. Dans la liste des comptes de service, cliquez sur l'e-mail que vous venez de créer.
9. Allez dans l'onglet **"Clés"** -> **"Ajouter une clé"** -> **"Créer une clé"** -> **JSON**.
10. Un fichier sera téléchargé sur votre ordinateur. **Gardez-le précieusement !**

---

## Étape 3 : Partager la feuille avec l'application

1. Ouvrez le fichier JSON téléchargé.
2. Copiez l'adresse e-mail qui se trouve après `"client_email"`.
3. Retournez sur votre **Google Sheet**.
4. Cliquez sur le bouton **"Partager"** en haut à droite.
5. Collez l'adresse e-mail de votre compte de service.
6. Assurez-vous qu'il est en mode **"Éditeur"** et décochez "Envoyer une notification".
7. Cliquez sur **"Partager"**.

---

## Étape 4 : Configurer votre application

J'ai déjà créé un fichier `.env` pour vous. Ouvrez-le et remplissez les informations :

```env
GOOGLE_SPREADSHEET_ID="VOTRE_ID_DE_FEUILLE"
GOOGLE_SERVICE_ACCOUNT_EMAIL="VOTRE_EMAIL_DE_COMPTE_DE_SERVICE"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> [!IMPORTANT]
> Pour la `GOOGLE_PRIVATE_KEY`, copiez toute la partie `"private_key"` du fichier JSON (y compris les guillemets et les `\n`).

---

## Étape 5 : Lancer l'application

Une fois le fichier `.env` enregistré, lancez votre serveur :

1. Ouvrez un terminal dans le dossier du projet.
2. Tapez `npm run dev`.
3. L'application devrait maintenant lire et écrire directement dans votre Google Sheet !
