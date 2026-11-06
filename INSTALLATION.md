# Installer JMedia sur un serveur Linux, pas à pas

Ce guide est fait pour quelqu'un qui n'a jamais utilisé de terminal. Comptez une dizaine de minutes.
Chaque commande se copie-colle telle quelle : vous n'avez à remplacer que les parties entre `< >`.

> **Usage légal.** N'utilisez JMedia qu'avec des contenus que vous avez le droit de lire et de partager :
> vos propres vidéos, des achats sans protection, des œuvres libres ou du domaine public.

## Avant de commencer

Il vous faut :

1. **Un compte JMedia** : créez-le sur [account.jmedia.cc](https://account.jmedia.cc) si ce n'est pas fait.
2. **Un serveur Linux** (hébergement mutualisé, VPS ou machine chez vous) sur lequel se trouvent déjà vos
   vidéos.
3. **Ses informations de connexion SSH**, fournies par votre hébergeur (souvent dans l'e-mail de bienvenue
   ou dans son espace client) :
   - l'**adresse** du serveur, par exemple `mon-serveur.exemple.com` ;
   - votre **nom d'utilisateur**, par exemple `marie` ;
   - votre **mot de passe**.

## Étape 1 : ouvrir un terminal

Le terminal est une fenêtre dans laquelle on tape des commandes. On valide chaque commande avec la touche
**Entrée**.

- **Windows 10 ou 11** : appuyez sur la touche **Windows**, tapez `Terminal` (ou `PowerShell`), puis
  **Entrée**.
- **macOS** : appuyez sur **Cmd + Espace**, tapez `Terminal`, puis **Entrée**.
- **Linux** : appuyez sur **Ctrl + Alt + T**.

**Pour coller une commande dans le terminal** : clic droit (Windows), **Cmd + V** (macOS) ou
**Ctrl + Maj + V** (Linux).

## Étape 2 : se connecter au serveur

Tapez la commande suivante en remplaçant `<utilisateur>` et `<adresse-du-serveur>` par vos informations,
puis **Entrée** :

```bash
ssh <utilisateur>@<adresse-du-serveur>
```

Exemple : `ssh marie@mon-serveur.exemple.com`.

- **À la première connexion**, le terminal demande si vous faites confiance au serveur
  (`Are you sure you want to continue connecting (yes/no/[fingerprint])?`) : tapez `yes`, puis **Entrée**.
- Il demande ensuite votre **mot de passe** : tapez-le, puis **Entrée**. **Rien ne s'affiche pendant que
  vous tapez, c'est normal** (pas même des étoiles).

Vous êtes connecté quand la ligne du terminal commence par votre nom d'utilisateur et celui du serveur,
par exemple `marie@mon-serveur:~$`. Toutes les commandes suivantes s'exécutent désormais **sur le
serveur**.

## Étape 3 : télécharger JMedia

Copiez-collez cette commande, puis **Entrée** (une barre de progression s'affiche, environ 150 Mo) :

```bash
wget https://github.com/juan5987/jmedia-releases/releases/download/v0.1.2/jmedia-0.1.2-linux-x86_64.tar.gz
```

## Étape 4 : installer JMedia

Copiez-collez cette commande, puis **Entrée** :

```bash
tar xzf jmedia-0.1.2-linux-x86_64.tar.gz -C ~ && ~/jmedia/bin/jmedia install
```

L'installation vous pose **une seule question** :

```
Où sont vos films et vos séries ?
Indiquez le dossier qui les contient : vous choisirez ensuite vos bibliothèques dans JMedia.
Dossier des vidéos [Entrée pour /home/marie/media] :
```

- Si le dossier proposé entre crochets est le bon, appuyez simplement sur **Entrée**.
- Sinon, tapez le chemin de votre dossier de vidéos, puis **Entrée**. Si vous ne le connaissez pas,
  ouvrez un second terminal connecté au serveur et tapez `ls ~` : la liste de vos dossiers s'affiche. Le
  chemin s'écrit alors `/home/<utilisateur>/<dossier>`, par exemple `/home/marie/videos`.
- Si le dossier n'existe pas, JMedia vous le dit et repose la question.

## Étape 5 : associer le serveur à votre compte

JMedia démarre (jusqu'à une minute), puis le terminal affiche :

```
Dernière étape : associez ce serveur à votre compte JMedia.
Ouvrez ce lien dans votre navigateur (valable 10 minutes) :

    https://account.jmedia.cc/serveurs/associer?code=ABCD-EFGH

Votre serveur JMedia sera ensuite à cette adresse :

    https://<adresse de votre serveur JMedia>
```

1. **Ouvrez le lien d'association** : sélectionnez-le, copiez-le et collez-le dans votre navigateur (dans
   certains terminaux, **Ctrl + clic** l'ouvre directement).
2. Connectez-vous à votre compte JMedia si besoin : le code est **déjà rempli**. Donnez un nom à votre
   serveur, puis validez.
3. **Ouvrez votre serveur** à l'adresse affichée sous « Votre serveur JMedia sera ensuite à cette adresse », puis cliquez sur
   **Se connecter avec JMedia**.
4. Choisissez vos bibliothèques : le premier scan démarre et vos films apparaissent au fur et à mesure.

Vous pouvez fermer la connexion au serveur en tapant `exit` puis **Entrée** : JMedia continue de tourner.

## En cas de problème

- **Le lien d'association a expiré ou a disparu** : reconnectez-vous au serveur (étape 2), puis tapez
  `~/jmedia/bin/jmedia status` : un nouveau lien s'affiche. Vous pouvez aussi ouvrir votre serveur, puis
  **Paramètres → Compte JMedia**.
- **`ssh` n'est pas reconnu (Windows)** : installez le client OpenSSH dans
  **Paramètres → Applications → Fonctionnalités facultatives**, ou utilisez le Terminal de Windows 11.
- **`Permission denied`** à la connexion : le nom d'utilisateur, l'adresse ou le mot de passe est
  inexact. Vérifiez les informations de votre hébergeur.
- **L'adresse de votre serveur JMedia ne s'ouvre pas** : tapez `~/jmedia/bin/jmedia status` pour vérifier
  que JMedia tourne, puis `~/jmedia/bin/jmedia logs` pour voir ses derniers messages. Écrivez-nous à
  [contact@jmedia.cc](mailto:contact@jmedia.cc) avec ces messages si besoin.

## Mettre à jour JMedia

Quand une nouvelle version sort, connectez-vous au serveur (étape 2) puis lancez, en remplaçant
`<version>` par son numéro (par exemple `0.1.3`) :

```bash
wget https://github.com/juan5987/jmedia-releases/releases/download/v<version>/jmedia-<version>-linux-x86_64.tar.gz
```

```bash
tar xzf jmedia-<version>-linux-x86_64.tar.gz -C ~ && ~/jmedia/bin/jmedia install
```

Vos réglages, votre bibliothèque et votre association au compte sont conservés.

## Installer sur un NAS (Docker)

Sur un NAS (Synology, QNAP, Unraid…), JMedia s'installe avec l'image Docker `ghcr.io/juan5987/jmedia`
depuis l'interface Docker du NAS. Le lien d'association s'affiche dans les journaux du conteneur, ou avec
`docker exec jmedia cat /data/pairing-link`. Un guide détaillé pour chaque NAS est en préparation.
