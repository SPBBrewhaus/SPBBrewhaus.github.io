
<strong>Sheet A1 Value:</strong>
<span id="sheet-value">Loading…</span>

<script>
  async function updateFromSheet() {
    // your published CSV link
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTn3XrnFcps7_xm4HBCDfHCss0DB0Wwd5DRlXGxvE4hk9Nc_Hw8-6HuB6LS7p09BlOP44FhL_ByR1kQ/pub?output=csv";

    try {
      const res = await fetch(url, { cache: "no-cache" });
      const text = await res.text();

      // split by newlines and commas
      const rows = text.trim().split(/\r?\n/).map(r => r.split(","));

      // A1 = row 0, column 0
      const value = rows[0]?.[0] || "(empty)";

      document.getElementById("sheet-value").textContent = value;
    } catch (err) {
      console.error("Fetch error:", err);
      document.getElementById("sheet-value").textContent = "—";
    }
  }

  updateFromSheet();
  // Optional: auto-refresh every 10 minutes
  // setInterval(updateFromSheet, 10 * 60 * 1000);
</script>

<!-- === LIVE BEER TABLES (Upstairs / Downstairs) === -->
<div id="beer-upstairs">
  <h3>Upstairs — On Tap</h3>
  <div id="upstairs-table">Loading…</div>
</div>

<div id="beer-downstairs" style="margin-top:1rem;">
  <h3>Downstairs — On Tap</h3>
  <div id="downstairs-table">Loading…</div>
</div>

<style>
  /* Optional light styling (kept tiny & inline) */
  #beer-upstairs h3, #beer-downstairs h3 { margin: 0.2rem 0 0.4rem; }
  .beer-table { width: 100%; border-collapse: collapse; }
  .beer-table th, .beer-table td { border: 1px solid #ddd; padding: 6px 8px; }
  .beer-table th { background: #f5f3ee; text-align: left; }
  .beer-note { color:#555; font-style:italic; font-size:0.92em; }
</style>

<script>
  // 1) Your published CSV URL (the one you gave me)
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTn3XrnFcps7_xm4HBCDfHCss0DB0Wwd5DRlXGxvE4hk9Nc_Hw8-6HuB6LS7p09BlOP44FhL_ByR1kQ/pub?output=csv";

  // 2) Which column names in the sheet mean “location”? (any one match will do)
  const LOCATION_HEADERS = ["Location", "Area", "Floor", "Room", "Section"];

  // 3) Expected column names for the table. We’ll try to map flexibly.
  const CAND_TAP     = ["Tap", "#", "Tap #"];
  const CAND_BEER    = ["Beer", "Beer Name", "Name", "Beer + Status", "Beer/Status"];
  const CAND_STATUS  = ["Status", "State"]; // optional (we’ll combine Beer + Status if separate)
  const CAND_HALF    = ["1/2", "Half", "1/2 bbl", "Half bbl", "Half Barrel", "Half_BBL"];
  const CAND_SIXTH   = ["1/6", "Sixth", "1/6 bbl", "Sixth bbl", "Sixth Barrel", "Sixth_BBL"];
  const CAND_NOTES   = ["Notes", "Note", "Comments", "Comment"]; // optional

  // Utility: robust CSV parser (handles quotes and commas)
  function parseCSV(text) {
    const rows = [];
    let i = 0, field = '', row = [], inQuotes = false;
    while (i < text.length) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i+1] === '"') { field += '"'; i++; } // escaped quote
          else { inQuotes = false; }
        } else field += c;
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ',') { row.push(field); field = ''; }
        else if (c === '\n' || c === '\r') {
          if (c === '\r' && text[i+1] === '\n') i++;
          row.push(field); field = '';
          if (row.length > 1 || row[0] !== '') rows.push(row);
          row = [];
        } else field += c;
      }
      i++;
    }
    // last field
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  // Case-insensitive header index lookup with candidate lists
  function findIndex(headerRow, candidates) {
    const lower = headerRow.map(h => (h || "").trim().toLowerCase());
    for (const cand of candidates) {
      const idx = lower.indexOf(cand.toLowerCase());
      if (idx !== -1) return idx;
    }
    return -1;
  }

  // Build HTML table from rows
  function buildTable(rows, headerMap) {
    const { iTap, iBeer, iStatus, iHalf, iSixth, iNotes } = headerMap;

    let html = '<table class="beer-table"><thead><tr>' +
               '<th>Tap</th><th>Beer + Status</th><th>1/2 bbl</th><th>1/6 bbl</th>' +
               '</tr></thead><tbody>';

    for (const r of rows) {
      const tap   = iTap   >= 0 ? (r[iTap]   || "") : "";
      const beer  = iBeer  >= 0 ? (r[iBeer]  || "") : "";
      const stat  = iStatus>= 0 ? (r[iStatus]|| "") : "";
      const half  = iHalf  >= 0 ? (r[iHalf]  || "") : "";
      const sixth = iSixth >= 0 ? (r[iSixth] || "") : "";
      const notes = iNotes >= 0 ? (r[iNotes] || "") : "";

      const beerStatus = stat ? `<strong>${beer}</strong> — ${stat}` : `<strong>${beer}</strong>`;

      html += `<tr>
        <td>${tap}</td>
        <td>${beerStatus}${notes ? `<div class="beer-note">${notes}</div>` : ""}</td>
        <td>${half}</td>
        <td>${sixth}</td>
      </tr>`;
    }

    html += '</tbody></table>';
    return html;
  }

  async function render() {
    try {
      const res = await fetch(CSV_URL, { cache: "no-cache" });
      const text = await res.text();
      const rows = parseCSV(text);
      if (!rows.length) throw new Error("Empty CSV");

      const header = rows[0];
      const data = rows.slice(1).filter(r => r.some(v => (v || "").trim() !== "")); // drop blank rows

      // Map headers
      const iLoc   = findIndex(header, LOCATION_HEADERS);
      const iTap   = findIndex(header, CAND_TAP);
      const iBeer  = findIndex(header, CAND_BEER);
      const iStat  = findIndex(header, CAND_STATUS);
      const iHalf  = findIndex(header, CAND_HALF);
      const iSixth = findIndex(header, CAND_SIXTH);
      const iNotes = findIndex(header, CAND_NOTES);

      const headerMap = { iTap, iBeer, iStatus: iStat, iHalf, iSixth, iNotes };

      // Split by location (expects values like "Upstairs" / "Downstairs")
      let upstairs = data, downstairs = [];
      if (iLoc >= 0) {
        upstairs   = data.filter(r => (r[iLoc] || "").toLowerCase().includes("up"));
        downstairs = data.filter(r => (r[iLoc] || "").toLowerCase().includes("down"));
      }

      // If no location column, try to infer: even/odd taps? (optional, comment out if unwanted)
      if (iLoc === 0 - 1) {
        upstairs   = data.filter(r => parseInt(r[iTap], 10) % 2 === 1); // odd taps
        downstairs = data.filter(r => parseInt(r[iTap], 10) % 2 === 0); // even taps
      }

      document.getElementById("upstairs-table").innerHTML  =
        upstairs.length ? buildTable(upstairs, headerMap) : "<em>No upstairs rows found.</em>";
      document.getElementById("downstairs-table").innerHTML =
        downstairs.length ? buildTable(downstairs, headerMap) : "<em>No downstairs rows found.</em>";
    } catch (e) {
      console.error(e);
      document.getElementById("upstairs-table").textContent = "Failed to load sheet.";
      document.getElementById("downstairs-table").textContent = "Failed to load sheet.";
    }
  }

  render();
  // Auto-refresh every 10 minutes (optional)
  // setInterval(render, 10 * 60 * 1000);
</script>

<table>
  <thead>
    <tr>
      <th>Tap</th>
      <th>Beer + Status</th>
      <th>1/2 bbl</th>
      <th>1/6 bbl</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td><strong>Restitution</strong> – On Tap</td>
      <td>1</td>
      <td>1</td>
    </tr>
    <tr>
      <td>2</td>
      <td><strong>Peach Sour</strong> – Fermenting</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <td>3</td>
      <td><strong>Octoberfest</strong> – Conditioning</td>
      <td>2</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
<table>
  <thead>
    <tr>
      <th>Tap</th>
      <th>Beer + Status</th>
      <th>1/2 bbl</th>
      <th>1/6 bbl</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>
        <details>
          <summary><strong>Restitution</strong> – On Tap</summary>
          <div><em>Notes:</em> Crisp amber ale, batch #23. Cleaned Sept 28. Next rotation Oct 10.</div>
        </details>
      </td>
      <td>1</td>
      <td>1</td>
    </tr>
    <tr>
      <td>2</td>
      <td>
        <details>
          <summary><strong>Peach Sour</strong> – Fermenting</summary>
          <div><em>Notes:</em> Target ABV 4.8%. Dry-hop Oct 7. Local peach purée.</div>
        </details>
      </td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <td>3</td>
      <td>
        <details>
          <summary><strong>Octoberfest</strong> – Conditioning</summary>
          <div><em>Notes:</em> Lagering at 38 °F. Ready mid-October.</div>
        </details>
      </td>
      <td>2</td>
      <td>0</td>
    </tr>
  </tbody>
</table>


🪖 In the Tanks (Coming Soon)

- Tank 3 → S'mores
- Tank 7 → Restitution
- Tank 8 → Scottie Pumpkin
- Available tanks: 1, 2, 4, 5, 6

<details> <summary>⏳ On Deck</summary>
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

  <div markdown="1">

- Eagle (10/03): Restitution — 16 kegs, 12 sixels

  </div>
</details> 

<details> <summary>🧻 Labels Needed</summary>

- Upcoming Brews:
  - Winter’s Knight
  - Super Haze
- Inventory:
  - Boston South Irish Stout
  - S’mores
  - New West Coast
  - Founders Sept
  - Cherry Pineapple Sour
</details>
<details> <summary>📦 Ingredients</summary>

Needed:
- Galaxy — 44 lbs
- Amarillo — 44 lbs

<details> <summary>🌿 Hops On Hand</summary>
A–C

- Amarillo —
(5 lbs)

- Azacca —
(33 lbs)

- Centennial —
(221 lbs)

- Chinook —
(5 lbs)

- Citra —
(80 lbs)

D–N

- El Dorado —
(27 lbs)

- Mandarina —
(5 lbs)

- Nugget —
(27 lbs)

- NY Chinook —
(11 lbs)

S–Z

- Saaz —
(11 lbs)

- Simcoe —
(33 lbs)

- Vallestia —
(38 lbs)

- Warrior —
(5 lbs)

- Zeus —
(33 lbs)

- 32 DE 2021 —
(11 lbs)

</details>
</details>

<details>
  <summary>⚙️ Maintenance & Logs</summary>

  <div markdown="1">

### ❄️ Glycol Chiller Log

| Date       | Event |
|------------|-------|
| 2025-09-01 | Chiller off → glycol very low, topped off with glycol + water, restarted. |
| 2025-05-27 | New set of fuses received, waiting to install (pump bypassed). |

---

### 🔥 Kettle Log

| Date       | Event |
|------------|-------|
| 2025-09-22 | Accidentally left boils on → burn tops. Second brew proceeding. Investigating with caustic + acid cycle. |

---

### 🧊 Big Cooler Log

| Date       | Event |
|------------|-------|
| 2025-10-02 | Temp check — 40°F (normal). |

  </div>
</details>


<iframe 
  src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTn3XrnFcps7_xm4HBCDfHCss0DB0Wwd5DRlXGxvE4hk9Nc_Hw8-6HuB6LS7p09BlOP44FhL_ByR1kQ/pubhtml?widget=true&amp;headers=false" 
  width="100%" 
  height="400">
  </iframe>

✍️ Compiled by Skyler Newberry
