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


<!-- Party Picker Section --><!-- Uses existing Google Sheets inventory data (already loaded in your site JS). --><!-- This section filters beers with >1 half keg available and lets Larry copy selected ones for an email. --><section id="party-picker" style="margin:1.5rem 0;padding:1rem;border:1px solid #ddd;border-radius:12px;background:#fff;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
  <details open>
    <summary style="cursor:pointer;font-weight:600;font-size:1.05rem">Party Picker — Select Beers for Events</summary><div style="margin:.75rem 0 .5rem;display:flex;gap:.5rem;flex-wrap:wrap">
  <button id="party-refresh" type="button" style="padding:.45rem .75rem;border-radius:10px;border:1px solid #ccc;background:#fafafa;cursor:pointer">Refresh List</button>
  <button id="party-copy" type="button" style="padding:.45rem .75rem;border-radius:10px;border:1px solid #ccc;background:#fafafa;cursor:pointer">Copy Selected to Clipboard</button>
  <span id="party-status" style="margin-left:auto;color:#666"></span>
</div>

<div id="party-list" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.5rem"></div>

<label for="party-preview" style="display:block;margin-top:.75rem;font-size:.9rem;color:#555">Email preview:</label>
<textarea id="party-preview" readonly style="width:100%;min-height:120px;margin-top:.25rem;border:1px solid #ddd;border-radius:10px;padding:.6rem;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"></textarea>

  </details>
</section><script>
// Assuming inventory data already fetched elsewhere in window.INVENTORY
(function(){
  const $status = document.getElementById('party-status');
  const $list = document.getElementById('party-list');
  const $copy = document.getElementById('party-copy');
  const $refresh = document.getElementById('party-refresh');
  const $preview = document.getElementById('party-preview');

  function setStatus(msg){ $status.textContent = msg || ''; }

  function renderList(){
    $list.innerHTML = '';
    const items = (window.INVENTORY || []).filter(b => parseFloat(b["1/2 bbl"] || b.half || 0) > 1);
    if(!items.length){
      $list.innerHTML = '<div style="color:#666">No beers with more than 1 half keg available.</div>';
      return;
    }
    items.forEach(b => {
      const id = 'beer_' + Math.random().toString(36).slice(2,9);
      const div = document.createElement('label');
      div.htmlFor = id;
      div.style.display = 'flex';
      div.style.alignItems = 'flex-start';
      div.style.gap = '.5rem';
      div.style.border = '1px solid #eee';
      div.style.borderRadius = '10px';
      div.style.padding = '.5rem .6rem';
      div.style.background = '#fcfcfc';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.id = id;
      cb.value = b.name || b.Beer || b["Beer Name"];
      cb.dataset.half = b["1/2 bbl"] || b.half;
      cb.dataset.sixth = b["1/6 bbl"] || b.sixth;

      const info = document.createElement('div');
      info.innerHTML = `<strong>${cb.value}</strong><br><small>1/2 bbl: ${cb.dataset.half || 0} · 1/6 bbl: ${cb.dataset.sixth || 0}</small>`;

      div.appendChild(cb);
      div.appendChild(info);
      $list.appendChild(div);
    });
  }

  function buildPreview(){
    const selected = Array.from($list.querySelectorAll('input[type="checkbox"]:checked'));
    if(!selected.length){ $preview.value = ''; return; }
    const lines = ['Party beer picks based on current stock:', ''];
    selected.forEach(cb => {
      lines.push(`• ${cb.value} — 1/2 bbl: ${cb.dataset.half} | 1/6 bbl: ${cb.dataset.sixth}`);
    });
    lines.push('', 'Let me know if these work.');
    $preview.value = lines.join('\n');
  }

  function copyPreview(){
    if(!$preview.value){ setStatus('Nothing to copy'); return; }
    navigator.clipboard.writeText($preview.value).then(()=>{
      setStatus('Copied to clipboard');
      setTimeout(()=>setStatus(''),1500);
    }).catch(()=>setStatus('Copy failed'));
  }

  $copy.addEventListener('click', copyPreview);
  $refresh.addEventListener('click', ()=>{ renderList(); buildPreview(); });
  $list.addEventListener('change', buildPreview);

  if(window.INVENTORY) renderList();
})();
</script>


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
