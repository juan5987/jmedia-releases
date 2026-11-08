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

## Méthode recommandée : en un copier-coller

### Étape 3 : obtenir la commande

1. Sur [account.jmedia.cc](https://account.jmedia.cc), connecté à votre compte, ouvrez **Mes serveurs**,
   puis cliquez sur **Ajouter un serveur**.
2. Donnez un nom à ce serveur (par exemple « Maison »), puis cliquez sur **Obtenir la commande**.
3. Cliquez sur **Copier** : la commande est dans votre presse-papiers.

Laissez la page ouverte : elle attend votre serveur et vous préviendra dès qu'il sera prêt.

### Étape 4 : coller la commande dans le terminal

Dans le terminal connecté au serveur, collez la commande, puis **Entrée**. Elle ressemble à :

```bash
curl -fsSL https://account.jmedia.cc/install.sh | sh -s -- --jeton ABCD1234EFGH5678
```

Une barre de progression s'affiche (environ 150 Mo) : JMedia se télécharge, vérifie son archive,
s'installe et s'associe tout seul. Comptez deux ou trois minutes, sans rien à répondre. Le jeton de
la commande ne sert qu'une fois et vaut 30 minutes ; s'il a expiré, la page en donne une nouvelle.

À la fin, le terminal affiche `Serveur associé à votre compte JMedia : retournez sur la page du compte
pour l'ouvrir.`, puis le code de secours, qui ouvre l'administration sans le compte JMedia. Sur un serveur
chez vous ou un VPS, il rappelle aussi le port à ouvrir : `redirigez le port <N>, en TCP et en UDP, de
votre box vers cette machine` (voir [Serveur chez vous : rediriger un port de la box](#serveur-chez-vous--rediriger-un-port-de-la-box)).

### Étape 5 : ouvrir votre serveur et ajouter vos bibliothèques

1. Revenez sur la page du compte : elle affiche **Votre serveur « Maison » démarre…**, puis, dès que le
   serveur a contacté JMedia, **Votre serveur « Maison » est prêt**, avec un bouton **Ouvrir JMedia**.
   Cliquez dessus. Si vous avez fermé la page, ouvrez [account.jmedia.cc](https://account.jmedia.cc),
   **Mes serveurs**, puis votre serveur. Si la page indique **Votre serveur n'est pas joignable depuis
   Internet**, redirigez le port qu'elle donne depuis votre box (voir
   [Serveur chez vous : rediriger un port de la box](#serveur-chez-vous--rediriger-un-port-de-la-box)),
   puis cliquez sur **Revérifier**.
2. Connectez-vous avec votre compte JMedia si besoin, puis **ajoutez vos bibliothèques** : cliquez sur
   **Ajouter une bibliothèque**, donnez-lui un nom (par exemple « Films ») et son type, puis cliquez sur
   **Ajouter un dossier**. Le sélecteur s'ouvre sur votre dossier personnel : cliquez sur les dossiers
   pour descendre jusqu'à celui de vos films, puis sur **Choisir ce dossier**, et enfin **Créer la
   bibliothèque**. Faites de même pour vos séries.
   Si vos vidéos sont ailleurs (un NAS ou un disque monté sous `/mnt` ou `/media`, par exemple),
   remontez avec **Dossier parent** ou en cliquant sur `/` dans le chemin, ou collez le chemin du dossier
   dans le champ du haut puis cliquez sur **Ouvrir**.
3. Le premier scan démarre et vos films apparaissent au fur et à mesure.

Vous pouvez fermer la connexion au serveur en tapant `exit` puis **Entrée** : JMedia continue de tourner.

## Serveur chez vous : rediriger un port de la box

Un serveur installé chez vous (mini PC, NAS, ordinateur) est derrière votre box : depuis Internet, on ne
le joint que si la box **redirige** vers lui le port de son adresse publique. L'installeur tire ce port
(par exemple `15214`) et l'affiche à la fin de l'installation ; la page **Mes serveurs** du compte le
redonne tant que le serveur n'est pas joignable.

1. Ouvrez l'interface de votre box : souvent `http://192.168.1.1` ou `http://192.168.0.1` dans un
   navigateur d'un appareil de la maison, ou l'application de votre opérateur.
2. Cherchez **Redirection de ports**, **NAT/PAT** ou **Port forwarding** (souvent dans « Réseau » ou
   « Paramètres avancés »).
3. Ajoutez une règle : port externe `<N>`, port interne `<N>`, protocoles **TCP et UDP**, vers l'adresse
   locale de la machine où tourne JMedia (affichée par la box dans la liste des appareils connectés). Si
   les vidéos sont sur un NAS monté en partage réseau, redirigez vers la machine où JMedia est installé,
   pas vers le NAS.
4. Revenez sur **Mes serveurs** et cliquez sur **Revérifier** : le message disparaît dès que le serveur
   répond depuis Internet.

La box doit rediriger **le même numéro** que celui du serveur. Si elle n'accepte qu'une plage de ports
(Freebox à IP partagée : 40960 à 49151), choisissez un port de cette plage, par exemple `44321` :

- à l'installation, ajoutez `--port-public 44321` à la fin de la commande d'installation (après le jeton) ;
- après l'installation, reconnectez-vous au serveur et tapez
  `~/jmedia/bin/jmedia install --port-public 44321` (`/opt/jmedia/bin/jmedia` si vous l'avez installé en
  root) : JMedia note ce port dans sa configuration (`JMEDIA_PUBLIC_PORT` de
  `~/.config/jmedia/jmedia.env`, `/etc/jmedia/jmedia.env` en root) et redémarre. Modifier ce seul réglage
  à la main puis redémarrer JMedia revient au même.

Redirigez ensuite ce port depuis la box, puis cliquez sur **Revérifier**.

Chez un hébergeur (seedbox, VPS), il n'y a pas de box : le port doit simplement être ouvert dans son
pare-feu s'il en a un.

## Méthode manuelle : l'archive

### Étape 3 : télécharger JMedia

Copiez-collez cette commande, puis **Entrée** (une barre de progression s'affiche, environ 150 Mo) :

```bash
wget https://github.com/juan5987/jmedia-releases/releases/download/v0.1.16/jmedia-0.1.16-linux-x86_64.tar.gz
```

### Étape 4 : installer JMedia

Copiez-collez cette commande, puis **Entrée** :

```bash
tar xzf jmedia-0.1.16-linux-x86_64.tar.gz -C ~ && ~/jmedia/bin/jmedia install
```

Il n'y a rien à répondre : JMedia s'installe et démarre tout seul, en une minute environ. Vous
choisirez vos dossiers de films et de séries plus tard, à la souris, dans JMedia.

### Étape 5 : associer le serveur à votre compte

À la fin de l'installation, le terminal affiche :

```
Dernière étape : associez ce serveur à votre compte JMedia.
Ouvrez ce lien dans votre navigateur (valable 10 minutes) :

    https://account.jmedia.cc/serveurs/associer?code=ABCD-EFGH

Votre serveur JMedia sera ensuite à cette adresse :

    https://<adresse de votre serveur JMedia>

Puis connectez-vous et choisissez les dossiers de vos films et séries.
```

1. **Ouvrez le lien d'association** : sélectionnez-le, copiez-le et collez-le dans votre navigateur (dans
   certains terminaux, **Ctrl + clic** l'ouvre directement).
2. Connectez-vous à votre compte JMedia si besoin : le code est **déjà rempli**. Donnez un nom à votre
   serveur, puis validez.
3. **Ouvrez votre serveur** à l'adresse affichée sous « Votre serveur JMedia sera ensuite à cette adresse », puis cliquez sur
   **Se connecter avec JMedia**.
4. **Ajoutez vos bibliothèques** : cliquez sur **Ajouter une bibliothèque**, donnez-lui un nom (par
   exemple « Films ») et son type, puis cliquez sur **Ajouter un dossier**. Le sélecteur s'ouvre sur
   votre dossier personnel : cliquez sur les dossiers pour descendre jusqu'à celui de vos films, puis sur
   **Choisir ce dossier**, et enfin **Créer la bibliothèque**. Faites de même pour vos séries.
   Si vos vidéos sont ailleurs (un NAS ou un disque monté sous `/mnt` ou `/media`, par exemple),
   remontez avec **Dossier parent** ou en cliquant sur `/` dans le chemin, ou collez le chemin du dossier
   dans le champ du haut puis cliquez sur **Ouvrir**.
5. Le premier scan démarre et vos films apparaissent au fur et à mesure.

Sur un serveur chez vous, redirigez aussi depuis votre box le port affiché à la fin de l'installation
(voir [Serveur chez vous : rediriger un port de la box](#serveur-chez-vous--rediriger-un-port-de-la-box)).

Vous pouvez fermer la connexion au serveur en tapant `exit` puis **Entrée** : JMedia continue de tourner.

## En cas de problème

- **Le lien d'association a expiré ou a disparu** : reconnectez-vous au serveur (étape 2), puis tapez
  `~/jmedia/bin/jmedia status` : un nouveau lien s'affiche. Vous pouvez aussi ouvrir votre serveur, puis
  **Paramètres → Compte JMedia**.
- **La commande a expiré, ou le serveur ne se montre pas sur la page « Ajouter un serveur »** : la page
  en donne une nouvelle (un jeton ne sert qu'une fois, 30 minutes). L'installation, elle, n'a pas besoin
  d'être refaite : `~/jmedia/bin/jmedia status` affiche le lien d'association habituel.
- **`ssh` n'est pas reconnu (Windows)** : installez le client OpenSSH dans
  **Paramètres → Applications → Fonctionnalités facultatives**, ou utilisez le Terminal de Windows 11.
- **`Permission denied`** à la connexion : le nom d'utilisateur, l'adresse ou le mot de passe est
  inexact. Vérifiez les informations de votre hébergeur.
- **L'adresse de votre serveur JMedia ne s'ouvre pas** : si **Mes serveurs** indique que le serveur n'est
  pas joignable depuis Internet, redirigez son port depuis votre box (voir
  [Serveur chez vous : rediriger un port de la box](#serveur-chez-vous--rediriger-un-port-de-la-box)).
  Sinon, tapez `~/jmedia/bin/jmedia status` pour vérifier
  que JMedia tourne, puis `~/jmedia/bin/jmedia logs` pour voir ses derniers messages. Écrivez-nous à
  [contact@jmedia.cc](mailto:contact@jmedia.cc) avec ces messages si besoin.

## Mettre à jour JMedia

Quand une nouvelle version sort, connectez-vous au serveur (étape 2) puis lancez, en remplaçant
`<version>` par son numéro (par exemple `0.1.16`) :

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
`docker exec jmedia cat /data/pairing-link`. Un guide détaillé pour chaque NAS est en préparation. Pour
l'ouvrir depuis Internet, la box doit rediriger vers le NAS, en TCP et en UDP, le port publié pour
l'adresse publique du conteneur (443, ou 8421 quand le NAS garde 443 pour lui).
