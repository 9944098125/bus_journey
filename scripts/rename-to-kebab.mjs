#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCAN_DIRS = [
  path.join(ROOT, 'apps/frontend'),
  path.join(ROOT, 'apps/admin_panel'),
  path.join(ROOT, 'apps/backend'),
];
const SRC_ROOTS = SCAN_DIRS.map(d => path.join(d, 'src')).filter(p => fs.existsSync(p));

function toKebabFilename(filename) {
  const parts = filename.split('.');
  const ext = parts.pop();
  const suffixes = [];
  while (parts.length > 1 && ['middleware', 'test', 'd'].includes(parts[parts.length - 1])) {
    suffixes.unshift(parts.pop());
  }
  const stem = parts.join('.');
  const kebabStem = stem
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
  return [...(kebabStem ? [kebabStem] : []), ...suffixes, ext].join('.');
}

function needsRename(filename) {
  const base = filename.includes('.') ? filename.slice(0, filename.indexOf('.')) : filename;
  return /[A-Z_]/.test(filename);
}

function walkFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, files);
    else if (/\.(tsx?|jsx?|css|json|http)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const renames = [];
for (const srcRoot of SRC_ROOTS) {
  for (const file of walkFiles(srcRoot)) {
    const dir = path.dirname(file);
    const oldName = path.basename(file);
    if (!needsRename(oldName)) continue;
    const newName = toKebabFilename(oldName);
    if (newName === oldName) continue;
    renames.push({ oldPath: file, newPath: path.join(dir, newName), oldName, newName });
  }
}

renames.sort((a, b) => b.oldPath.length - a.oldPath.length);

const stemMap = new Map();
for (const { oldName, newName } of renames) {
  const oldStem = oldName.replace(/\.[^.]+$/, '').split('.').join('.');
  const newStem = newName.replace(/\.[^.]+$/, '').split('.').join('.');
  if (!stemMap.has(oldStem)) stemMap.set(oldStem, newStem);
}

const replacePairs = [...stemMap.entries()].sort((a, b) => b[0].length - a[0].length);

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function updateImports(content) {
  let out = content;
  for (const [oldStem, newStem] of replacePairs) {
    out = out.replace(
      new RegExp(`(/|\\.)${escapeRe(oldStem)}(?=(?:['"\`./]|$))`, 'g'),
      `$1${newStem}`,
    );
    out = out.replace(
      new RegExp(`(['"\`])${escapeRe(oldStem)}(?=['"\`])`, 'g'),
      `$1${newStem}`,
    );
  }
  return out;
}

console.log(`Renaming ${renames.length} files...`);
for (const { oldPath, newPath, oldName, newName } of renames) {
  if (!fs.existsSync(oldPath)) continue;
  const dir = path.dirname(oldPath);
  const tempPath = path.join(dir, `.__kebab_${newName}`);
  if (oldName.toLowerCase() === newName.toLowerCase()) {
    fs.renameSync(oldPath, tempPath);
    fs.renameSync(tempPath, newPath);
  } else {
    fs.renameSync(oldPath, newPath);
  }
  console.log(`  ${path.relative(ROOT, oldPath)} -> ${path.basename(newPath)}`);
}

const filesToUpdate = [];
for (const dir of SCAN_DIRS) {
  walkFiles(dir, filesToUpdate);
}
for (const extra of ['package.json']) {
  for (const app of ['frontend', 'admin_panel']) {
    const p = path.join(ROOT, 'apps', app, extra);
    if (fs.existsSync(p)) filesToUpdate.push(p);
  }
}

let updated = 0;
for (const file of filesToUpdate) {
  const content = fs.readFileSync(file, 'utf8');
  const next = updateImports(content);
  if (next !== content) {
    fs.writeFileSync(file, next);
    updated++;
  }
}

console.log(`Updated imports in ${updated} files.`);
