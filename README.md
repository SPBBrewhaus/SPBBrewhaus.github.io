
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
