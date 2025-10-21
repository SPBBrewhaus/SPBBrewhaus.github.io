import fs from 'node:fs';

const issue = fs.readFileSync('.github/issue.md', 'utf8');

// Helpers
const section = (label) => {
  const re = new RegExp(`### ${label}[\\s\\S]*?\\n\\n([\\s\\S]*?)(\\n###|$)`, 'i');
  const m = issue.match(re);
  return m ? m[1].trim() : '';
};

const sanitizeLines = (txt) =>
  txt.split('\n').map(s => s.trim()).filter(Boolean);

// Extract sections (GitHub converts the YAML form to markdown with headings)
const dateStr     = (issue.match(/### Date\\s+\\n\\n(.+?)\\n/) || [,'']).at(1).trim();
const downstairs  = sanitizeLines(section('Downstairs items'));
const upstairs    = sanitizeLines(section('Upstairs items'));
const ondeck      = sanitizeLines(section('On Deck'));
const hops        = sanitizeLines(section('Hops'));
const maintenance = sanitizeLines(section('Maintenance log'));
const notes       = section('General notes');

// Ensure /data exists
fs.mkdirSync('data', { recursive: true });

// Writer helpers for TXT formats you prefer
const writeList = (path, lines) => {
  // one item per line; preserve your simple pipes format
  const body = lines.join('\n') + (lines.length ? '\n' : '');
  fs.writeFileSync(path, body, 'utf8');
};

const writeStamped = (path, lines) => {
  // append with date header
  const existing = fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : '';
  const block = lines.length ? `\n[${dateStr || new Date().toISOString().slice(0,10)}]\n` + lines.join('\n') + '\n' : '';
  fs.writeFileSync(path, existing + block, 'utf8');
};

// Alphabetize hops
const sortedHops = [...hops].sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:'base'}));

// Write files you’re already loading on the site
writeList('data/downstairs.txt', downstairs);
writeList('data/upstairs.txt',   upstairs);
writeList('data/ondeck.txt',     ondeck);
writeList('data/hops.txt',       sortedHops);

// Maintenance: keep as a dated append log
writeStamped('data/maintenance.txt', maintenance);

// Notes: keep latest snapshot (or switch to append if you prefer)
writeList('data/notes.txt', notes ? notes.split('\n') : []);

// Optional: a last-updated stamp
fs.writeFileSync('data/last_updated.txt', (new Date()).toISOString(), 'utf8');

console.log('Data files updated.');
