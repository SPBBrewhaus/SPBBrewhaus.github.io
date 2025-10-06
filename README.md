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

  
<details>
  <summary>📄 Orders</summary>
  <div markdown="1">

  - **Eagle (10/03):** Restitution — 16 kegs, 12 sixels

  </div>
</details>

<!-- break -->
 
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


<details>
  <summary>⚙️ Maintenance & Logs</summary>
  <div markdown="1">

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

  </div>
</details>
