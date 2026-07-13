import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';

const root = new URL('..', import.meta.url);
const file = (name) => new URL(name, root);
const html = readFileSync(file('index.html'), 'utf8');
const css = readFileSync(file('styles.css'), 'utf8');
const js = readFileSync(file('script.js'), 'utf8');

test('publishes the essential static site files', () => {
  for (const name of ['index.html', 'styles.css', 'script.js', 'assets/realsimhq-logo.png']) {
    assert.equal(existsSync(file(name)), true, `${name} must exist`);
  }
});

test('contains reachable internal sections and booking contact paths', () => {
  for (const id of ['top', 'brands', 'packages', 'launcher', 'maintenance', 'book']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /href="tel:\+13306016536"/);
  assert.match(html, /href="sms:\+13306016536"/);
  assert.match(html, /href="mailto:RealiSimHQ@gmail\.com\?subject=RealiSimHQ%20Install%20Quote"/);
  assert.match(js, /'RealiSimHQ@gmail\.com'/);
});

test('keeps responsive and interactive site styling in place', () => {
  for (const selector of ['.services-strip', '.brand-tab', '.contact-actions', '@media (max-width: 980px)', '@media (max-width: 560px)']) {
    assert.match(css, new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('has syntactically valid client JavaScript', () => {
  const result = spawnSync(process.execPath, ['--check', file('script.js').pathname], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
