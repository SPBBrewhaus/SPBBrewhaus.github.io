<div id="upstairs-table">Loading…</div>
<div id="downstairs-table" style="margin-top:1rem;">Loading…</div>

<script>
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTn3XrnFcps7_xm4HBCDfHCss0DB0Wwd5DRlXGxvE4hk9Nc_Hw8-6HuB6LS7p09BlOP44FhL_ByR1kQ/pub?output=csv";

  // Tiny CSV parser (handles quoted commas)
  function parseCSV(text) {
    const out = []; let row = [], field = "", q = false;
    for (let i=0; i<text.length; i++) {
      const c = text[i], n = text[i+1];
      if (q) {
        if (c === '"' && n === '"') { field += '"'; i++; }
        else if (c === '"') { q = false; }
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

  function buildTable(rows) {
    let html = '<table class="beer-table"><thead><tr>' +
               '<th>Tap</th><th>Beer + Status</th><th>1/2 bbl</th><th>1/6 bbl</th>' +
               '</tr></thead><tbody>';
    for (const r of rows) {
      const tap   = r.tap ?? "";
      const beer  = r.beer ?? "";
      const stat  = r.status ?? "";
      const half  = r.half ?? "";
      const sixth = r.sixth ?? "";
      const notes = r.notes ?? "";
      html += `<tr>
        <td>${tap}</td>
        <td><strong>${beer}</strong>${stat ? " — " + stat : ""}${notes ? `<div style="color:#555;font-style:italic">${notes}</div>` : ""}</td>
        <td>${half}</td>
        <td>${sixth}</td>
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
      notes:    r[header.indexOf("notes")] || "",
    })).filter(x => Object.values(x).some(v => (v||"").trim() !== ""));

    const upstairs   = data.filter(x => x.location.toLowerCase().includes("up"));
    const downstairs = data.filter(x => x.location.toLowerCase().includes("down"));

    document.getElementById("upstairs-table").innerHTML  =
      upstairs.length ? buildTable(upstairs) : "<em>No Upstairs rows.</em>";
    document.getElementById("downstairs-table").innerHTML =
      downstairs.length ? buildTable(downstairs) : "<em>No Downstairs rows.</em>";
  }

  render();
  // setInterval(render, 10 * 60 * 1000); // optional auto-refresh
</script>

🪖 In the Tanks (Coming Soon)

- Tank 3 → S'mores
- Tank 7 → Restitution
- Tank 8 → Scottie Pumpkin
- Available tanks: 1, 2, 4, 5, 6


<details>
  <summary>⏳ On Deck</summary>

- She’s a Peach (7)
- Road Soda (2 sixels)
- 99 Problems (3)
- Mole Stout (3)
- Cider (4 sixels)
- Juicy Haze (2 sixels)
- My Boy Blue (4)
- Jacks (2)
- Founders Sept (7)
- Hindsight (1 sixel)
- Founders Oct (7)

</details>


⚠️ Low Stock (Watch Closely)

- Restitution — 9 cases, 1 keg
- Sticky Fingers — 1 sixel
- Straw Peach — 1 keg
- Seltzer — 4 kegs
- Gringo — 1 sixel


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


<iframe 
  src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTn3XrnFcps7_xm4HBCDfHCss0DB0Wwd5DRlXGxvE4hk9Nc_Hw8-6HuB6LS7p09BlOP44FhL_ByR1kQ/pubhtml?widget=true&amp;headers=false" 
  width="100%" 
  height="400">
</iframe>

✍️ Compiled by Skyler Newberry

