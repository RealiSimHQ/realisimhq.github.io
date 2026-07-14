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
  for (const name of ['index.html', 'styles.css', 'script.js', 'assets/realsimhq-logo.png', 'assets/favicon.png']) {
    assert.equal(existsSync(file(name)), true, `${name} must exist`);
  }
});

test('contains reachable internal sections and booking contact paths', () => {
  for (const id of ['top', 'brands', 'packages', 'launcher', 'maintenance', 'book']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.doesNotMatch(html, />Call 330-601-6536</);
  assert.doesNotMatch(html, />Call Ryan Directly</);
  assert.match(html, />Talk to a Human</);
  assert.match(html, />Text a Question to a Human</);
  assert.match(html, /href="mailto:booking@realisimhq\.com\?subject=RealiSimHQ%20Estimate%20Request"/);
  assert.match(js, /'booking@realisimhq\.com'/);
});

test('keeps simulator platform names and internal navigation correct', () => {
  assert.match(html, />iRacing<\/dd>/);
  assert.match(html, />Assetto Corsa<\/dd>/);
  assert.doesNotMatch(html, /No Hesi/);
  assert.match(html, /Assetto Rally/);
  assert.match(html, /DiRT Rally/);
  assert.match(html, /Sprint Cars/);
  assert.match(html, /Traffic Driving/);
  assert.match(html, /Driving Sims/);
  assert.match(html, /Flight \+ FPV Sims/);
  assert.match(html, /PC, Displays \+ Effects/);
  assert.match(html, /Flight Sticks/);
  assert.match(html, /Rudder Pedals/);
  assert.match(html, /FPV Sims/);
  assert.match(html, /RealiSimHQ - Less BS-More Driving/);
  assert.match(html, /Premium flight and driving simulator installs, tuning, launcher support, and After Intall Support/);
  assert.doesNotMatch(html, /personal aftercare|and aftercare/);
  assert.match(html, /href="assets\/favicon\.png\?v=rshq-20260713"/);
  assert.match(html, /Tell Us What You've Got to Work With/);
  assert.match(html, /The goal: a clean, reliable setup you can fire up without fighting settings every time/);
  assert.doesNotMatch(html, /one button press and you’re playing/);
  assert.doesNotMatch(html, />Range<|>50 mi</);
  assert.match(html, /Driving Sim/);
  assert.match(html, /Flight Sim/);
  assert.match(html, /https:\/\/www\.simhq\.com\//);
  assert.match(html, /https:\/\/www\.microcenter\.com\/site\/content\/racing-sim-builder\.aspx/);
  assert.doesNotMatch(html, /IRACING|ASSETTO CORSA/);
  assert.doesNotMatch(html, /Start Simple Over SSH|Web-Based Updater As The Customer Base Grows/);
  assert.match(html, /href="#book">Request Estimate/);
  assert.match(html, /role="button" tabindex="0" aria-label="Start a service request for Sim Rescue \/ Setup"/);
  assert.match(html, /data-package="Full Rig Setup"/);
  assert.match(html, /Start service request →/);
  assert.match(js, /I'm looking into this: \$\{serviceInfo\}/);
  assert.match(js, /packageSelect\.value = packageName/);
  assert.match(js, /\.package-card\[data-package\]/);
  assert.match(js, /event\.key !== 'Enter' && event\.key !== ' '/);
  assert.match(html, /What Are You Looking For in a Sim\?/);
  assert.match(html, /FPV Controller/);
  assert.match(js, /updateGearOptions/);
  assert.match(js, /field\.disabled = !visible/);
  assert.match(js, /fieldLabel\(key\)/);
  assert.match(js, /useGearBuilder/);
  assert.match(js, /I'm looking into this: \$\{gearType\}/);
  assert.match(js, /scrollIntoView\(\{ behavior: 'smooth', block: 'start' \}\)/);
  assert.match(css, /\.track-lines \{[\s\S]*pointer-events: none;/);
});

test('keeps responsive and interactive site styling in place', () => {
  for (const selector of ['.services-strip', '.brand-tab', '.hardware-note', '.gear-builder', '.gear-type-tabs', '.contact-actions', '@media (max-width: 980px)', '@media (max-width: 560px)']) {
    assert.match(css, new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('has syntactically valid client JavaScript', () => {
  const result = spawnSync(process.execPath, ['--check', file('script.js').pathname], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
