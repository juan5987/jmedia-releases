# JMedia

Serveur multimédia personnel : vos films et séries, lus dans le navigateur, depuis votre serveur personnel,
votre NAS, un VPS ou un hébergement mutualisé. Ce dépôt publie les **versions de JMedia**, leurs **licences** et les **sources des
composants libres** qu'elles embarquent. Le code de JMedia lui-même n'y est pas publié.

> **Pré-version de test.** JMedia est une pré-version gratuite, distribuée sans garantie.

> **Usage légal.** N'utilisez JMedia qu'avec des contenus que vous avez le droit de lire et de partager :
> vos propres vidéos, des achats sans protection, des œuvres libres ou du domaine public. JMedia n'héberge,
> ne fournit ni ne recherche aucun contenu.

## Installer

**Première fois ? Suivez le [guide d'installation pas à pas](INSTALLATION.md)** : il explique tout, de
l'ouverture d'un terminal jusqu'à l'association du serveur à votre compte, sans connaissance préalable.

En bref, pour qui connaît déjà SSH :

1. Créez votre compte sur [account.jmedia.cc](https://account.jmedia.cc).
2. Connectez-vous à votre serveur Linux en SSH, puis lancez, avec le lien de l'archive de la
   [dernière version](https://github.com/juan5987/jmedia-releases/releases) :

   ```bash
   wget <lien de l'archive jmedia-<version>-linux-x86_64.tar.gz>
   tar xzf jmedia-<version>-linux-x86_64.tar.gz -C ~ && ~/jmedia/bin/jmedia install
   ```

3. Ouvrez le lien d'association affiché à la fin, puis votre serveur : choisissez-y les dossiers de
   vos films et séries.

Sur un NAS ou avec Docker : image `ghcr.io/juan5987/jmedia` (amd64), avec le fichier `compose.yaml`
décrit dans les notes de chaque version.

## Licences et sources

- JMedia est distribué selon la licence d'utilisation du fichier [LICENSE](LICENSE).
- Chaque version embarque des logiciels libres : FFmpeg (bibliothèques sous LGPL v2.1 ou ultérieure, outils
  `ffmpeg` et `ffprobe` sous GPL v2 ou ultérieure), OpenJDK (GPL v2 avec exception Classpath), Caddy
  (Apache 2.0) et d'autres. Leurs licences sont livrées dans l'archive et l'image (`LICENSES/`) et servies
  par l'application.
- Les sources exactes de ces composants sont jointes à chaque version
  (`jmedia-<version>-sources-tierces.tar.gz`, `jmedia-<version>-sources-openjdk.tar.gz`), et restent
  disponibles au moins trois ans.

## Contact

[contact@jmedia.cc](mailto:contact@jmedia.cc) : questions, signalements, demandes de sources.
