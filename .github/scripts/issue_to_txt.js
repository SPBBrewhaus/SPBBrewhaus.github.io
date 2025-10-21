// .github/scripts/issue_to_txt.js
import fs from 'node:fs';

const issuePath = '.github/issue.md';
if (!fs.existsSync(issuePath)) {
  console.error('Missing .github/issue.md');
  process.exit(1);
}
const issue = fs.readFileSync(issuePath, 'utf8');

// Normalize line endings
const body = issue.replace(/\r\n/g, '\n');

// Flexible section grabber: matches ### or ####, any spacing, case-insensitive
function grab(label) {
  const re = new RegExp(
    String.raw`^#{3,4}\s*${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\s*\n+([\s\S]*?)(?=^#{3,4}\s|\Z)`,
    'gmi'
  );
  const m = re.exec(body);
  return m ? m[1].trim() : '';
}

const dateStr     = (grab('Date').split('\n')[0] || '').trim();
const downstairs  = grab('Downstairs items');
const upstairs    = grab('Upstairs items');
const ondeck      = grab('On Deck');
const hops        = grab('Hops');
const maintenance = grab('Maintenance log');
const notes       = grab('General notes');

// Turn textareas into clean arrays (one item per line)
const toLines = (txt) => txt
  .split('\n')
  .map(s => s.trim())
  .filter(Boolean);

// Ensure /data exists
fs.mkdirSync('data', { recursive: true });

// Writers
const writeList = (path, lines) => {
  const arr = Array.isArray(lines) ? lines : toLines(lines);
  const body = arr.join('\n') + (arr.length ? '\n' : '');
  fs.writeFileSync(path, body, 'utf8');
};

const writeStamped = (path, lines) => {
  const arr = Array.isArray(lines) ? lines : toLines(lines);
  if (arr.length === 0) return;
  const existing = fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : '';
  const stamp = dateStr || new Date().toISOString().slice(0,10);
  const block = `\n[${stamp}]\n${arr.join('\n')}\n`;
  fs.writeFileSync(path, existing + block, 'utf8');
};

// Sort hops A→Z, case-insensitive
const sortedHops = toLines(hops).sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:'base'}));

// Write your site data
writeList('data/downstairs.txt', toLines(downstairs));
writeList('data/upstairs.txt',   toLines(upstairs));
writeList('data/ondeck.txt',     toLines(ondeck));
writeList('data/hops.txt',       sortedHops);
writeStamped('data/maintenance.txt', toLines(maintenance));
writeList('data/notes.txt', toLines(notes));

// A simple "last updated" stamp for your UI
fs.writeFileSync('data/last_updated.txt', new Date().toISOString(), 'utf8');

// Log a preview (shows up in Actions logs)
const preview = {
  date: dateStr,
  downstairs_count: toLines(downstairs).length,
  upstairs_count: toLines(upstairs).length,
  ondeck_count: toLines(ondeck).length,
  hops_sorted_count: sortedHops.length,
  maintenance_new_lines: toLines(maintenance).length,
  notes_chars: notes.length
};
console.log('Parsed preview:', JSON.stringify(preview, null, 2));
