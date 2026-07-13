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
  assert.match(html, />Call 330-601-6536</);
  assert.match(html, />Text Ryan</);
  assert.match(html, /href="mailto:booking@realisimhq\.com\?subject=RealiSimHQ%20Estimate%20Request"/);
  assert.match(js, /'booking@realisimhq\.com'/);
});

test('keeps simulator platform names and internal navigation correct', () => {
  assert.match(html, /iRacing · Assetto Corsa/);
  assert.match(html, /No Hesi/);
  assert.match(html, /Assetto Rally/);
  assert.match(html, /DiRT Rally/);
  assert.match(html, /Sprint Cars/);
  assert.doesNotMatch(html, /IRACING|ASSETTO CORSA/);
  assert.match(html, /href="#book">Request Estimate/);
  assert.match(html, /role="button" tabindex="0" aria-label="Start a service request for Sim Rescue \/ Setup"/);
  assert.match(html, /data-package="Full Rig Setup"/);
  assert.match(html, /Start service request →/);
  assert.match(js, /I'm looking into this: \$\{serviceInfo\}/);
  assert.match(js, /packageSelect\.value = packageName/);
  assert.match(js, /\.package-card\[data-package\]/);
  assert.match(js, /event\.key !== 'Enter' && event\.key !== ' '/);
  assert.match(js, /scrollIntoView\(\{ behavior: 'smooth', block: 'start' \}\)/);
  assert.match(css, /\.track-lines \{[\s\S]*pointer-events: none;/);
});

test('keeps responsive and interactive site styling in place', () => {
  for (const selector of ['.services-strip', '.brand-tab', '.hardware-note', '.contact-actions', '@media (max-width: 980px)', '@media (max-width: 560px)']) {
    assert.match(css, new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('has syntactically valid client JavaScript', () => {
  const result = spawnSync(process.execPath, ['--check', file('script.js').pathname], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
