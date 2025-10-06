<style>
details > ul,
details > ol,
details > div > ul,
details > div > ol {
  list-style: disc !important;
  margin-left: 1.5em !important;
  padding-left: 1em !important;
}
details li {
  display: list-item !important;
  list-style-type: disc !important;
}
</style>


<!-- Plain Text Notepad section for a GitHub Pages site.

How it works:
- Reads plain text from /data/notes.txt in your repo and renders it.
- Zero Markdown parsing; shows exactly what's in notes.txt.
- Provides a local "Draft" editor that saves ONLY to the browser (localStorage) so coworkers can jot updates without touching the repo.
- Includes Refresh and Copy buttons. Editing the actual file still happens via GitHub UI or a normal git commit.

Install:
1) Create the file at: /data/notes.txt  (commit this to your repo)
2) Paste this whole <section> block into your GitHub Pages HTML (e.g., index.html) where you want the notepad.
3) (Optional) Set EDIT_URL below to point to the GitHub edit page for /data/notes.txt for a one-click jump.
--><section id="plain-notes" class="notes-wrap" style="margin:1.25rem 0;padding:1rem;border:1px solid #ddd;border-radius:12px;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#fff">
  <header style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem">
    <h2 style="margin:0;font-size:1.1rem">Shared Notepad (plain text)</h2>
    <span id="notes-status" style="margin-left:auto;font-size:.9rem;color:#666"></span>
  </header>  <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem">
    <button id="btn-refresh" type="button" aria-label="Refresh" style="padding:.5rem .75rem;border-radius:10px;border:1px solid #ccc;background:#fafafa;cursor:pointer">Refresh</button>
    <button id="btn-copy" type="button" aria-label="Copy to clipboard" style="padding:.5rem .75rem;border-radius:10px;border:1px solid #ccc;background:#fafafa;cursor:pointer">Copy</button>
    <button id="btn-edit-toggle" type="button" aria-label="Toggle draft editor" style="padding:.5rem .75rem;border-radius:10px;border:1px solid #ccc;background:#fafafa;cursor:pointer">Open Draft Editor</button>
    <a id="btn-edit-github" href="#" target="_blank" rel="noopener" style="padding:.5rem .75rem;border-radius:10px;border:1px solid #ccc;background:#fafafa;text-decoration:none">Edit on GitHub</a>
  </div>  <!-- Read-only view of notes.txt -->  <pre id="notes-view" style="white-space:pre-wrap;word-wrap:break-word;border:1px solid #eee;border-radius:10px;padding:1rem;max-height:50vh;overflow:auto;background:#fcfcfc;margin:0"></pre>  <!-- Local draft editor (does NOT save to repo) -->  <details id="draft-box" style="margin-top:.75rem">
    <summary style="cursor:pointer">Draft editor (local only)</summary>
    <div style="margin-top:.5rem;display:flex;gap:.5rem;flex-wrap:wrap">
      <button id="btn-draft-load" type="button" style="padding:.4rem .7rem;border-radius:8px;border:1px solid #ccc;background:#fafafa;cursor:pointer">Load from current notes</button>
      <button id="btn-draft-save" type="button" style="padding:.4rem .7rem;border-radius:8px;border:1px solid #ccc;background:#fafafa;cursor:pointer">Save Draft (local)</button>
      <button id="btn-draft-clear" type="button" style="padding:.4rem .7rem;border-radius:8px;border:1px solid #ccc;background:#fafafa;cursor:pointer">Clear Draft</button>
    </div>
    <textarea id="notes-edit" spellcheck="true" placeholder="Type your draft here… (Saving a draft keeps it only on this browser/device)" style="margin-top:.5rem;width:100%;min-height:220px;box-sizing:border-box;border:1px solid #ddd;border-radius:10px;padding:.75rem;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;font-size:.95rem"></textarea>
    <p style="margin:.5rem 0 0;font-size:.9rem;color:#666">To update the real file in the repo, use <em>Edit on GitHub</em> above or make a normal commit.</p>
  </details>
</section><script>
(function(){
  const NOTES_URL = '/data/notes.txt'; // path inside your Pages site
  const EDIT_URL  = 'https://github.com/OWNER/REPO/edit/BRANCH/data/notes.txt'; // ← set this to your repo
  const LS_KEY    = 'brewhaus_notes_draft_v1';

  const $status = document.getElementById('notes-status');
  const $view   = document.getElementById('notes-view');
  const $edit   = document.getElementById('notes-edit');
  const $draft  = document.getElementById('draft-box');

  const $btnRefresh    = document.getElementById('btn-refresh');
  const $btnCopy       = document.getElementById('btn-copy');
  const $btnEditToggle = document.getElementById('btn-edit-toggle');
  const $btnEditGitHub = document.getElementById('btn-edit-github');
  const $btnDraftLoad  = document.getElementById('btn-draft-load');
  const $btnDraftSave  = document.getElementById('btn-draft-save');
  const $btnDraftClear = document.getElementById('btn-draft-clear');

  // Wire the Edit on GitHub link
  $btnEditGitHub.href = EDIT_URL;

  function setStatus(msg){
    $status.textContent = msg || '';
  }

  async function loadNotes(){
    setStatus('Loading…');
    try {
      const res = await fetch(NOTES_URL, { cache: 'no-store' });
      if(!res.ok){
        // If file missing, show a gentle hint
        const txt = `notes.txt not found at ${NOTES_URL}\n\nCreate it in your repo and try again.`;
        $view.textContent = txt;
        setStatus('Missing file');
        return;
      }
      const text = await res.text();
      $view.textContent = text;
      setStatus('Loaded');
    } catch (err){
      $view.textContent = 'Error loading notes. Check path or CORS.';
      setStatus('Load error');
      console.error(err);
    }
  }

  function copyView(){
    const toCopy = $view.textContent || '';
    navigator.clipboard.writeText(toCopy).then(()=>{
      setStatus('Copied');
      setTimeout(()=>setStatus(''), 1500);
    }).catch(()=>{
      setStatus('Copy failed');
    });
  }

  function toggleEditor(){
    const open = !$draft.open;
    $draft.open = open;
    $btnEditToggle.textContent = open ? 'Close Draft Editor' : 'Open Draft Editor';
  }

  function loadDraft(){
    const data = localStorage.getItem(LS_KEY);
    if(data){
      $edit.value = data;
      setStatus('Draft loaded');
      return true;
    }
    return false;
  }

  function saveDraft(){
    localStorage.setItem(LS_KEY, $edit.value || '');
    setStatus('Draft saved (local)');
  }

  function clearDraft(){
    localStorage.removeItem(LS_KEY);
    $edit.value = '';
    setStatus('Draft cleared');
  }

  // Events
  $btnRefresh.addEventListener('click', loadNotes);
  $btnCopy.addEventListener('click', copyView);
  $btnEditToggle.addEventListener('click', toggleEditor);
  $btnDraftLoad.addEventListener('click', ()=>{ $edit.value = $view.textContent || ''; setStatus('Draft seeded from current'); });
  $btnDraftSave.addEventListener('click', saveDraft);
  $btnDraftClear.addEventListener('click', clearDraft);

  // Startup
  loadNotes();
  if(loadDraft()) { $draft.open = true; $btnEditToggle.textContent = 'Close Draft Editor'; }
})();
</script> 



<!-- Live Beer Tables -->
<div id="upstairs-table">Loading…</div>
<div id="downstairs-table" style="margin-top:1rem;">Loading…</div>
<div id="ondeck-table" style="margin-top:1rem;">Loading…</div>

<script>
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTn3XrnFcps7_xm4HBCDfHCss0DB0Wwd5DRlXGxvE4hk9Nc_Hw8-6HuB6LS7p09BlOP44FhL_ByR1kQ/pub?output=csv";

  function parseCSV(text) {
    const out = []; let row = [], field = "", q = false;
    for (let i=0; i<text.length; i++) {
      const c = text[i], n = text[i+1];
      if (q) {
        if (c === '"' && n === '"') { field += '"'; i++; }
        else if (c === '"') q = false;
        else field += c;
      } else {
        if (c === '"') q = true;
        else if (c === ',') { row.push(field); field = ""; }
        else if (c === '\n' || c === '\r') {
          if (c === '\r' && n === '\n') i++;
          row.push(field); field = "";
          if (row.some(v => (v||"").trim() !== "")) out.push(row);
          row = [];
        } else field += c;
      }
    }
    if (field.length || row.length) { row.push(field); out.push(row); }
    return out;
  }

  // Stock icons
  function getStockIcon(status) {
    if (!status) return "";
    const s = status.toLowerCase();
    if (s.includes("good")) return " ✅";
    if (s.includes("low"))  return " 🟡";
    if (s.includes("out"))  return " ❌";
    return "";
  }

  function buildTable(rows) {
    const th = 'style="border:1px solid #ddd;padding:6px 8px;text-align:left;background:#f5f3ee"';
    const td = 'style="border:1px solid #ddd;padding:6px 8px;vertical-align:top"';
    let html = `<table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th ${th}>Tap</th>
          <th ${th}>Beer + Status</th>
          <th ${th}>1/2 bbl</th>
          <th ${th}>1/6 bbl</th>
          <th ${th}>Cases of Cans</th>
        </tr>
      </thead><tbody>`;

    for (const r of rows) {
      const icon = getStockIcon(r.stock);
      const notes = r.notes ? `<div style="color:#555;font-style:italic">${r.notes}</div>` : "";
      html += `<tr>
        <td ${td}>${r.tap||""}</td>
        <td ${td}><strong>${r.beer||""}${icon}</strong>${r.status? " — " + r.status : ""}${notes}</td>
        <td ${td}>${r.half||""}</td>
        <td ${td}>${r.sixth||""}</td>
        <td ${td}>${r.cans||""}</td>
      </tr>`;
    }

    html += '</tbody></table>';
    return html;
  }

  async function render() {
    const res = await fetch(CSV_URL, { cache: "no-cache" });
    const rows = parseCSV(await res.text());
    const header = rows[0].map(h => (h||"").trim().toLowerCase());
    const data = rows.slice(1).map(r => ({
      location: r[header.indexOf("location")] || "",
      tap:      r[header.indexOf("tap")] || "",
      beer:     r[header.indexOf("beer")] || "",
      status:   r[header.indexOf("status")] || "",
      half:     r[header.indexOf("1/2 bbl")] || "",
      sixth:    r[header.indexOf("1/6 bbl")] || "",
      cans:     r[header.indexOf("cases of cans")] || "",
      stock:    r[header.indexOf("stock status")] || "",
      notes:    r[header.indexOf("notes")] || "",
    }));

    const upstairs   = data.filter(x => x.location.toLowerCase().includes("up"));
    const downstairs = data.filter(x => x.location.toLowerCase().includes("down"));
    const ondeck     = data.filter(x => x.location.toLowerCase().includes("deck"));

    document.getElementById("upstairs-table").innerHTML =
      upstairs.length ? `<h3>Upstairs — On Tap</h3>${buildTable(upstairs)}` : "";
    document.getElementById("downstairs-table").innerHTML =
      downstairs.length ? `<h3>Downstairs — On Tap</h3>${buildTable(downstairs)}` : "";
    document.getElementById("ondeck-table").innerHTML =
      ondeck.length ? `<h3>On Deck</h3>${buildTable(ondeck)}` : "";
  }

  render();
</script>



<p><a href="https://docs.google.com/spreadsheets/d/13-oglKrmnpkJok_xEO7brLNmnetRz3XIkrc2gSXf4X0/edit?usp=sharing" target="_blank">
  🔐 Staff Login to Update Inventory
</a></p>
<p><em>Note: updates appear automatically on this page after saving the sheet.</em></p>


🪖 In the Tanks 

- Tank 3 → S'mores
- Tank 7 → Restitution
- Tank 8 → Scottie Pumpkin
- Available tanks: 1, 2, 4, 5, 6



🛠 To Brew 

- Winter’s Knight
- Cranberry Saison
- Super Haze
- Seltzer × 4
- NY Saaz
- NY IPA


⚗️ Chemicals:

- PAA: 50% with 2 backup 
- CAUSTIC: 15% with 1 backup 
- FOAMING CAUSTIC: 80%
- LP acid 25% with 1 backup 
- Glycol 40%

Gas levels:

- CO2 118 psi
- Nitrogen 1600 psi (No back-up) 
- Oxygen 900 psi 
- 2x small CO2 tanks 


<details>
  <summary>🔮 Future Maintenance</summary>
  <div markdown="1">

  - New water barrier 
  - Fix Water Softener (If not already working)
  - Paint floors
  - Glycol chiller pump is currently bypass need new set of fuses 
  - Update 5/27 received fuses, waiting to install
  </div>
</details>


<br>


<details>
  <summary>📄 Orders</summary>
  <div markdown="1">

  - **Eagle (10/03):** Restitution — 16 kegs, 12 sixels DONE

  </div>
</details>

<!-- break -->
<br>

<details>
  <summary>🧻 Labels Needed</summary>
  <div markdown="1">

  - **Upcoming Brews**
    - Winter’s Knight
    - Super Haze
  - **Inventory**
    - Boston South Irish Stout
    - S’mores
    - New West Coast
    - Founders Sept
    - Cherry Pineapple Sour

  </div>
</details>


<!-- break -->

<br>


<details>
  <summary>📦 Ingredients</summary>
  <div markdown="1">

   
   **Needed**
  - Galaxy — 44 lbs
  - Amarillo — 44 lbs

  <details>
    <summary>🌿 Hops On Hand</summary>
    <div markdown="1">
  
  **A–C**
  - Amarillo — (5 lbs)
  - Azacca — (33 lbs)
  - Centennial — (221 lbs)
  - Chinook — (5 lbs)
  - Citra — (80 lbs)
  
  **D–N**
  - El Dorado — (27 lbs)
  - Mandarina — (5 lbs)
  - Nugget — (27 lbs)
  - NY Chinook — (11 lbs)
  
  **S–Z**
  - Saaz — (11 lbs)
  - Simcoe — (33 lbs)
  - Vallestia — (38 lbs)
  - Warrior — (5 lbs)
  - Zeus — (33 lbs)
  - 32 DE 2021 — (11 lbs)
    
  </div>
  </details>

  </div>
</details>

<br>


<details>
  <summary>⚙️ Maintenance & Logs</summary>
  <div markdown="1">


<!-- Replace the Markdown tables with this container -->
<div id="maintenance" style="margin-top:.75rem;">Loading maintenance…</div>

<script>
(function () {
  // Published CSV for the Maintenance tab (your gid)
  const MAINT_CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTn3XrnFcps7_xm4HBCDfHCss0DB0Wwd5DRlXGxvE4hk9Nc_Hw8-6HuB6LS7p09BlOP44FhL_ByR1kQ/pub?gid=2038532004&single=true&output=csv";

  // Use your existing parser if present; else fallback
  const csvParse = (typeof window.parseCSV === "function") ? window.parseCSV : function (text) {
    const out = []; let row = [], field = "", q = false;
    for (let i=0;i<text.length;i++){
      const c=text[i], n=text[i+1];
      if(q){ if(c==='"'&&n==='"'){field+='"';i++;} else if(c==='"'){q=false;} else {field+=c;} }
      else { if(c==='"'){q=true;}
        else if(c===','){row.push(field); field="";}
        else if(c==='\n'||c==='\r'){ if(c==='\r'&&n==='\n') i++; row.push(field); field=""; if(row.some(v=>(v||"").trim()!=="")) out.push(row); row=[];}
        else {field+=c;}
      }
    }
    if(field.length||row.length){ row.push(field); out.push(row); }
    return out;
  };

  function buildTable(rows, iDate, iEvent) {
    const th='style="border:1px solid #ddd;padding:6px 8px;background:#f5f3ee;text-align:left"';
    const td='style="border:1px solid #ddd;padding:6px 8px;vertical-align:top"';
    let html = `<table style="width:100%;border-collapse:collapse"><thead><tr>
      <th ${th}>Date</th><th ${th}>Event</th></tr></thead><tbody>`;
    for (const r of rows) {
      html += `<tr><td ${td}>${r[iDate]||""}</td><td ${td}>${r[iEvent]||""}</td></tr>`;
    }
    html += `</tbody></table>`;
    return html;
  }

  async function renderMaintenance() {
    try {
      const res = await fetch(MAINT_CSV_URL, { cache: "no-cache" });
      const rows = csvParse(await res.text());
      if (!rows.length) throw new Error("Empty CSV");

      const header = rows[0].map(h => (h||"").trim().toLowerCase());
      const iSys   = header.indexOf("system");
      const iDate  = header.indexOf("date");
      const iEvent = header.indexOf("event");
      if (iSys < 0 || iDate < 0 || iEvent < 0) {
        document.getElementById("maintenance").innerHTML =
          "<em>Expected headers: System, Date, Event.</em>";
        return;
      }

      // Clean & group by System
      const data = rows.slice(1).filter(r => r.some(v => (v||"").trim() !== ""));
      const groups = {};
      for (const r of data) {
        const key = (r[iSys] || "Other").trim();
        (groups[key] ||= []).push(r);
      }

      // Optional: sort each group by Date desc if dates are parseable
      for (const key of Object.keys(groups)) {
        groups[key].sort((a,b) => {
          const da = new Date(a[iDate]), db = new Date(b[iDate]);
          return (isNaN(db) - isNaN(da)) || (db - da);
        });
      }

      // Render sections
      let html = "";
      for (const [sys, list] of Object.entries(groups)) {
        html += `<h3 style="margin:.6rem 0 .3rem">${sys} Log</h3>`;
        html += buildTable(list, iDate, iEvent);
      }
      document.getElementById("maintenance").innerHTML = html || "<em>No maintenance rows yet.</em>";
    } catch (e) {
      console.error(e);
      document.getElementById("maintenance").textContent = "Failed to load maintenance log.";
    }
  }

  renderMaintenance();
})();
</script>

<p><a href="https://docs.google.com/forms/d/e/1FAIpQLSeMIzh7LHuZMFyK7xNuJIg30oSsXO_VFRJEswS-piHc_RX37A/viewform" target="_blank">
  🔐 Staff Login to Update log
</a></p>
<p><em>Note: updates appear automatically on this page after saving the sheet.</em></p>


  </div>
</details>
