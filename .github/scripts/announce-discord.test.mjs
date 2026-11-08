import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  SECTIONS,
  announcementAction,
  announcementMarker,
  announcementMessages,
  channelsByName,
  sectionItems,
} from './announce-discord.mjs';

const NOTES = `# JMedia 0.1.16 (pre-version de test)

> Pre-version publiee pour tester JMedia.

## Nouveautes

- **Verifier maintenant.** Parametres > Mise a jour a un bouton qui demande tout de suite la
  derniere version.
- **Doublons a part.** Les copies en double ne comptent plus comme des problemes.

## Corrections

- Les compteurs de la fin de scan et de la progression concordent.

## Installation sur un serveur Linux

- wget ...
`;

const [NEW_FEATURES, FIXES] = SECTIONS;

test('reads each bullet of a section on one line, wrapped lines joined', () => {
  assert.deepEqual(sectionItems(NOTES, NEW_FEATURES.heading), [
    '**Verifier maintenant.** Parametres > Mise a jour a un bouton qui demande tout de suite la derniere version.',
    '**Doublons a part.** Les copies en double ne comptent plus comme des problemes.',
  ]);
  assert.deepEqual(sectionItems(NOTES, FIXES.heading), [
    'Les compteurs de la fin de scan et de la progression concordent.',
  ]);
});

test('accepts the accented heading and Windows line endings', () => {
  const notes = '## Nouveautés\r\n\r\n- Une.\r\n- Deux.\r\n';

  assert.deepEqual(sectionItems(notes, NEW_FEATURES.heading), ['Une.', 'Deux.']);
});

test('finds nothing when the section is absent', () => {
  assert.deepEqual(sectionItems('## Nouveautes\n\n- Une.\n', FIXES.heading), []);
});

test('sends features to #features and fixes to #fixes', () => {
  assert.deepEqual(SECTIONS.map((section) => section.channel), ['features', 'fixes']);
});

test('announces the version with its items and the link to the notes', () => {
  const [message] = announcementMessages({
    version: '0.1.16',
    url: 'https://github.com/juan5987/jmedia-releases/releases/tag/v0.1.16',
    title: 'Corrections',
    items: ['Les compteurs concordent.'],
  });

  assert.equal(
    message,
    '**JMedia 0.1.16** · Corrections\n• Les compteurs concordent.\n\n' +
      'Notes complètes : <https://github.com/juan5987/jmedia-releases/releases/tag/v0.1.16>',
  );
  assert.ok(message.startsWith(announcementMarker('0.1.16')));
});

test('announces nothing for an empty section', () => {
  assert.deepEqual(announcementMessages({ version: '0.1.16', url: 'u', title: 'Corrections', items: [] }), []);
});

test('splits a long section into messages under the Discord limit, never inside an item', () => {
  const items = Array.from({ length: 40 }, (_, index) => `Element ${index} ${'x'.repeat(80)}`);
  const messages = announcementMessages({ version: '0.1.16', url: 'https://example.org', title: 'Nouveautés', items });

  assert.ok(messages.length > 1);
  for (const message of messages) {
    assert.ok(message.length <= 2000, `${message.length} caracteres`);
    assert.ok(message.startsWith(announcementMarker('0.1.16')));
  }
  const sent = messages.join('\n').split('\n').filter((line) => line.startsWith('• '));
  assert.deepEqual(sent, items.map((item) => `• ${item}`));
});

test('finds the text channels of the JMedia category by name', () => {
  const channels = [
    { id: 'c', type: 4, name: 'JMedia' },
    { id: 'f', type: 0, name: 'features', parent_id: 'c' },
    { id: 'x', type: 0, name: 'fixes', parent_id: 'c' },
    { id: 'autre', type: 0, name: 'features', parent_id: 'ailleurs' },
    { id: 'b', type: 15, name: 'bugs', parent_id: 'c' },
  ];

  assert.deepEqual([...channelsByName(channels)], [['features', 'f'], ['fixes', 'x']]);
});

test('posts a first announcement, leaves an identical one, edits a changed one in place', () => {
  assert.equal(announcementAction([], ['a']), 'post');
  assert.equal(announcementAction(['a', 'b'], ['a', 'b']), 'unchanged');
  assert.equal(announcementAction(['sans accents'], ['avec accents']), 'edit');
});

test('replaces an announcement whose number of messages changed', () => {
  assert.equal(announcementAction(['a'], ['a', 'b']), 'replace');
  assert.equal(announcementAction(['a', 'b'], ['a']), 'replace');
});
