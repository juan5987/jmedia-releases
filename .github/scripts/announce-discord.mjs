// Annonce une version publiee dans les salons Discord de la communaute JMedia : la rubrique
// « Nouveautes » des notes part dans #features, la rubrique « Corrections » dans #fixes. Le message
// est envoye avec le jeton du bot JMedia (projet jmedia_bot_discord), qui peut ecrire dans ces
// salons reserves. Une version deja annoncee dans un salon n'y est pas reannoncee ; si ses notes ont
// change depuis, ses messages sont corriges sur place.

import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const DISCORD_API = 'https://discord.com/api/v10';
const MESSAGE_LIMIT = 2000;
const HISTORY_SCANNED = 50;
const CATEGORY_NAME = 'JMedia';
const GUILD_TEXT = 0;
const GUILD_CATEGORY = 4;
const SUPPRESS_EMBEDS = 1 << 2;

/** Rubriques des notes et salon de chacune. */
export const SECTIONS = [
  { heading: /^##\s+nouveaut[eé]s\s*$/i, channel: 'features', title: 'Nouveautés' },
  { heading: /^##\s+corrections\s*$/i, channel: 'fixes', title: 'Corrections' },
];

/** Marque qui identifie l'annonce d'une version dans un salon. */
export function announcementMarker(version) {
  return `**JMedia ${version}**`;
}

/**
 * Elements de liste d'une rubrique des notes, une ligne chacun : les lignes repliees d'un meme
 * element sont rejointes. Rend une liste vide quand la rubrique est absente.
 */
export function sectionItems(notes, heading) {
  const lines = notes.replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex((line) => heading.test(line.trim()));
  if (start === -1) {
    return [];
  }
  const items = [];
  for (const line of lines.slice(start + 1)) {
    if (/^#{1,2}\s/.test(line)) {
      break;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      items.push(line.replace(/^\s*[-*]\s+/, '').trim());
    } else if (line.trim() !== '' && items.length > 0) {
      items[items.length - 1] += ` ${line.trim()}`;
    }
  }
  return items;
}

/**
 * Messages Discord d'une rubrique : en-tete avec la version et le lien des notes, puis un element par
 * ligne, coupes en plusieurs messages sous la limite de Discord sans jamais couper un element.
 */
export function announcementMessages({ version, url, title, items }) {
  if (items.length === 0) {
    return [];
  }
  const header = `${announcementMarker(version)} · ${title}`;
  const footer = `Notes complètes : <${url}>`;
  const bullets = items.map((item) => truncate(`• ${item}`, MESSAGE_LIMIT - header.length - 2));
  const messages = [];
  let current = header;
  for (const bullet of bullets) {
    if (current.length + 1 + bullet.length > MESSAGE_LIMIT) {
      messages.push(current);
      current = `${header} (suite)`;
    }
    current += `\n${bullet}`;
  }
  if (current.length + 2 + footer.length > MESSAGE_LIMIT) {
    messages.push(current);
    current = `${header} (suite)`;
  }
  messages.push(`${current}\n\n${footer}`);
  return messages;
}

/**
 * Ce qu'il faut faire d'une annonce, d'apres les messages que le bot a deja publies pour cette version
 * dans le salon (du plus ancien au plus recent) : publier, ne rien faire, corriger sur place (meme
 * nombre de messages, l'ordre du salon est garde), ou remplacer (nombre different).
 */
export function announcementAction(existing, messages) {
  if (existing.length === 0) {
    return 'post';
  }
  if (existing.length !== messages.length) {
    return 'replace';
  }
  return existing.every((content, index) => content === messages[index]) ? 'unchanged' : 'edit';
}

function truncate(text, limit) {
  return text.length <= limit ? text : `${text.slice(0, limit - 1)}…`;
}

/** Salons texte de la categorie JMedia, par nom. */
export function channelsByName(channels) {
  const category = channels.find((channel) => channel.type === GUILD_CATEGORY && channel.name === CATEGORY_NAME);
  return new Map(
    channels
      .filter((channel) => channel.type === GUILD_TEXT && (category === undefined || channel.parent_id === category.id))
      .map((channel) => [channel.name, channel.id]),
  );
}

async function discord(token, method, path, body) {
  const response = await fetch(`${DISCORD_API}${path}`, {
    method,
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'JMedia release announcer (https://github.com/juan5987/jmedia-releases, 1.0)',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Discord ${method} ${path} : HTTP ${response.status} ${await response.text()}`);
  }
  return response.status === 204 ? null : response.json();
}

/** Messages deja publies par le bot pour cette version, du plus ancien au plus recent. */
async function previousAnnouncement(token, channelId, botId, version) {
  const recent = await discord(token, 'GET', `/channels/${channelId}/messages?limit=${HISTORY_SCANNED}`);
  return recent
    .filter((message) => message.author?.id === botId && message.content.startsWith(announcementMarker(version)))
    .reverse();
}

function messageBody(content) {
  return { content, allowed_mentions: { parse: [] }, flags: SUPPRESS_EMBEDS };
}

async function readRelease() {
  if (process.env.NOTES_FILE) {
    return {
      version: required('RELEASE_VERSION'),
      url: required('RELEASE_URL'),
      notes: await readFile(process.env.NOTES_FILE, 'utf8'),
    };
  }
  const event = JSON.parse(await readFile(required('GITHUB_EVENT_PATH'), 'utf8'));
  return {
    version: event.release.tag_name.replace(/^v/, ''),
    url: event.release.html_url,
    notes: event.release.body ?? '',
  };
}

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} manquant`);
  }
  return value;
}

async function main() {
  const release = await readRelease();
  const dryRun = process.env.DRY_RUN === 'true';
  const plan = SECTIONS.map((section) => ({
    channel: section.channel,
    messages: announcementMessages({ ...release, title: section.title, items: sectionItems(release.notes, section.heading) }),
  })).filter((step) => step.messages.length > 0);

  if (plan.length === 0) {
    console.log(`JMedia ${release.version} : ni Nouveautés ni Corrections dans les notes, rien à annoncer.`);
    return;
  }
  if (dryRun) {
    for (const step of plan) {
      console.log(`--- #${step.channel} (${step.messages.length} message(s))\n${step.messages.join('\n---\n')}`);
    }
    return;
  }

  const token = required('DISCORD_TOKEN');
  const bot = await discord(token, 'GET', '/users/@me');
  const channels = channelsByName(await discord(token, 'GET', `/guilds/${required('DISCORD_GUILD_ID')}/channels`));
  for (const step of plan) {
    const channelId = channels.get(step.channel);
    if (channelId === undefined) {
      throw new Error(`Salon #${step.channel} introuvable dans la catégorie ${CATEGORY_NAME}`);
    }
    const previous = await previousAnnouncement(token, channelId, bot.id, release.version);
    const action = announcementAction(previous.map((message) => message.content), step.messages);
    if (action === 'unchanged') {
      console.log(`#${step.channel} : JMedia ${release.version} déjà annoncée, inchangée`);
      continue;
    }
    if (action === 'edit') {
      for (const [index, message] of previous.entries()) {
        await discord(token, 'PATCH', `/channels/${channelId}/messages/${message.id}`, messageBody(step.messages[index]));
      }
      console.log(`#${step.channel} : annonce de JMedia ${release.version} corrigée (${step.messages.length} message(s))`);
      continue;
    }
    for (const message of previous) {
      await discord(token, 'DELETE', `/channels/${channelId}/messages/${message.id}`);
    }
    for (const content of step.messages) {
      await discord(token, 'POST', `/channels/${channelId}/messages`, messageBody(content));
    }
    console.log(`#${step.channel} : JMedia ${release.version} annoncée (${step.messages.length} message(s))`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
