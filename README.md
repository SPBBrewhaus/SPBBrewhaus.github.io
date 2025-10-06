


<!-- Live Beer Tables -->
<div id="upstairs-table">Loading…</div>
<div id="downstairs-table" style="margin-top:1rem;">Loading…</div>
<div id="ondeck-table" style="margin-top:1rem;">Loading…</div>

<script>
  // === 1) POINT THIS AT YOUR PUBLISHED CSV ===
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTn3XrnFcps7_xm4HBCDfHCss0DB0Wwd5DRlXGxvE4hk9Nc_Hw8-6HuB6LS7p09BlOP44FhL_ByR1kQ/pub?output=csv";

  // === 2) EXPECTED HEADERS (case-insensitive) ===
  // Use these in your sheet: Location, Tap, Beer, Status, 1/2 bbl, 1/6 bbl, Cases of Cans, Stock Status, Notes
  const H = {
    location: ["location","area","section","floor"],
    tap: ["tap","tap #","#"],
    beer: ["beer","beer name","name","beer + status","beer/status"],
    status: ["status","state"],
    half: ["1/2 bbl","half","half bbl","half barrel","1/2"],
    sixth: ["1/6 bbl","sixth","sixth bbl","sixth barrel","1/6"],
    cans: ["cases of cans","cases (cans)","cases","cans"],
    stock: ["stock status","stock","level"],
    notes: ["notes","note","comments","comment"]
  };

  // === CSV parser (handles quotes/commas) ===
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

  // Case-insensitive header index
  function findIndex(headerRow, candidates) {
    const lower = headerRow.map(h => (h||"").trim().toLowerCase());
    for (const cand of candidates) {
      const idx = lower.indexOf(cand);
      if (idx !== -1) return idx;
    }
    return -1;
  }

  function pickIndexes(headerRow) {
    return {
      iLoc:   findIndex(headerRow, H.location),
      iTap:   findIndex(headerRow, H.tap),
      iBeer:  findIndex(headerRow, H.beer),
      iStat:  findIndex(headerRow, H.status),
      iHalf:  findIndex(headerRow, H.half),
      iSixth: findIndex(headerRow, H.sixth),
      iCans:  findIndex(headerRow, H.cans),
      iStock: findIndex(headerRow, H.stock),
      iNotes: findIndex(headerRow, H.notes),
    };
  }

  // Icon + row color from stock status
  function stockIconAndBg(status) {
    const s = (status||"").trim().toLowerCase();
    if (s.startsWith("good")) return { icon:"✅", bg:"#ecf9f1" };   // light green
    if (s.startsWith("low"))  return { icon:"🟡", bg:"#fff9e6" };   // light yellow
    if (s.startsWith("out"))  return { icon:"❌", bg:"#fdecea" };   // light red
    return { icon:"", bg:"" };
  }

  // Build one table’s HTML (inline styles only)
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
          <th ${th} style="text-align:center">Stock</th>
        </tr>
      </thead>
      <tbody>`;

    for (const r of rows) {
      const { icon, bg } = stockIconAndBg(r.stock);
      const rowStyle = bg ? ` style="background:${bg}"` : "";
      const notes = r.notes ? `<div style="color:#555;font-style:italic">${r.notes}</div>` : "";
      html += `<tr${rowStyle}>
        <td ${td}>${r.tap||""}</td>
        <td ${td}><strong>${r.beer||""}</strong>${r.status? " — " + r.status : ""}${notes}</td>
        <td ${td}>${r.half||""}</td>
        <td ${td}>${r.sixth||""}</td>
        <td ${td}>${r.cans||""}</td>
        <td ${td} style="text-align:center;font-size:1.15em">${icon}</td>
      </tr>`;
    }

    html += `</tbody></table>`;
    return html;
  }

  async function render() {
    try {
      const res = await fetch(CSV_URL, { cache: "no-cache" });
      const rows = parseCSV(await res.text());
      if (!rows.length) throw new Error("Empty CSV");

      const header = rows[0];
      const idx = pickIndexes(header);
      // Minimal header sanity check
      const required = [idx.iLoc, idx.iBeer];
      if (required.some(i => i === -1)) {
        document.getElementById("upstairs-table").innerHTML = "<em>Missing required columns. Expected at least: Location, Beer.</em>";
        return;
      }

      const data = rows.slice(1)
        .map(r => ({
          location: r[idx.iLoc]   || "",
          tap:      idx.iTap   >=0 ? r[idx.iTap]   : "",
          beer:     idx.iBeer  >=0 ? r[idx.iBeer]  : "",
          status:   idx.iStat  >=0 ? r[idx.iStat]  : "",
          half:     idx.iHalf  >=0 ? r[idx.iHalf]  : "",
          sixth:    idx.iSixth >=0 ? r[idx.iSixth] : "",
          cans:     idx.iCans  >=0 ? r[idx.iCans]  : "",
          stock:    idx.iStock >=0 ? r[idx.iStock] : "",
          notes:    idx.iNotes >=0 ? r[idx.iNotes] : "",
        }))
        .filter(x => Object.values(x).some(v => (v||"").toString().trim() !== ""));

      const upstairs   = data.filter(x => x.location.toLowerCase().includes("up"));
      const downstairs = data.filter(x => x.location.toLowerCase().includes("down"));
      const ondeck     = data.filter(x => x.location.toLowerCase().includes("deck"));

      document.getElementById("upstairs-table").innerHTML  =
        upstairs.length ? `<h3 style="margin:0.2rem 0 0.4rem">Upstairs — On Tap</h3>${buildTable(upstairs)}` : "";

      document.getElementById("downstairs-table").innerHTML =
        downstairs.length ? `<h3 style="margin:0.2rem 0 0.4rem">Downstairs — On Tap</h3>${buildTable(downstairs)}` : "";

      document.getElementById("ondeck-table").innerHTML =
        ondeck.length ? `<h3 style="margin:0.2rem 0 0.4rem">On Deck</h3>${buildTable(ondeck)}` : "";
    } catch (e) {
      console.error(e);
      document.getElementById("upstairs-table").textContent  = "Failed to load sheet.";
      document.getElementById("downstairs-table").textContent = "Failed to load sheet.";
      document.getElementById("ondeck-table").textContent     = "Failed to load sheet.";
    }
  }

  render();
  // setInterval(render, 10 * 60 * 1000); // optional auto-refresh
</script>


<p><a href="https://docs.google.com/spreadsheets/d/13-oglKrmnpkJok_xEO7brLNmnetRz3XIkrc2gSXf4X0/edit?usp=sharing" target="_blank">
  🔐 Staff Login to Update Inventory
</a></p>
<p><em>Note: updates appear automatically on this page after saving the sheet.</em></p>

🪖 In the Tanks (Coming Soon)

- Tank 3 → S'mores
- Tank 7 → Restitution
- Tank 8 → Scottie Pumpkin
- Available tanks: 1, 2, 4, 5, 6





🛠 To Brew (Next Batches)

- Winter’s Knight
- Cranberry Saison
- Super Haze
- Seltzer ×4
- NY Saaz
- NY IPA (Vista)


<details>
  
  <summary>📄 Orders</summary>

- Eagle (10/03): Restitution — 16 kegs, 12 sixels

</details>


<details>
  
  <summary>🧻 Labels Needed</summary>

- **Upcoming Brews**
  - Winter’s Knight
  - Super Haze
- **Inventory**
  - Boston South Irish Stout
  - S’mores
  - New West Coast
  - Founders Sept
  - Cherry Pineapple Sour

</details>


<details>
  <summary>📦 Ingredients</summary>

**Needed**
- Galaxy — 44 lbs
- Amarillo — 44 lbs

<details>
  <summary>🌿 Hops On Hand</summary>

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

</details>

</details>


<details>
  <summary>⚙️ Maintenance & Logs</summary>

### ❄️ Glycol Chiller Log
| Date       | Event |
|------------|-------|
| 2025-09-01 | Chiller off → glycol very low, topped off with glycol + water, restarted. |
| 2025-05-27 | New set of fuses received, waiting to install (pump bypassed). |

### 🔥 Kettle Log
| Date       | Event |
|------------|-------|
| 2025-09-22 | Accidentally left boils on → burn tops. Second brew proceeding. Investigating with caustic + acid cycle. |

### 🧊 Big Cooler Log
| Date       | Event |
|------------|-------|
| 2025-10-02 | Temp check — 40°F (normal). |


</details>



✍️ Compiled by Skyler Newberry

