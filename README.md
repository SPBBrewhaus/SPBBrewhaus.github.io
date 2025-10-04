🍻 Brewery Production & Inventory

| Beer         | Details                 |
|--------------|--------------------------|
| **Restitution** | Status: 🔴 Critical  
1/2 bbl: 1 | 1/6 bbl: 1 
| **Peach Sour**  | Status: 🟡 Brewing  
1/2 bbl: 0 | 1/6 bbl: 2 |
| **Octoberfest** | Status: ✅ On Tap  
1/2 bbl: 1 | 1/6 bbl: 0 |
| **Pumpkin Ale** | Status: 🟢 Low  
1/2 bbl: 2 | 1/6 bbl: 1 |

| Beer         | Status          |
|--------------|-----------------|
| Restitution  | Critical        |
| 1/2 bbl: 1   | 1/6 bbl: 1      |
| Peach Sour   | Brewing         |
| 1/2 bbl: 0   | 1/6 bbl: 2      |
| Octoberfest  | On Tap          |
| 1/2 bbl: 1   | 1/6 bbl: 0      |
| Pumpkin Ale  | Low             |
| 1/2 bbl: 2   | 1/6 bbl: 1      |

| Beer / Kegs            | Status / Notes      |
|-------------------------|---------------------|
| **Restitution**         | Status: 🔴 Critical |
| 1/2 bbl: 1 • 1/6 bbl: 1 | Notes: Fresh batch  |
| **Peach Sour**          | Status: 🟡 Brewing  |
| 1/2 bbl: 0 • 1/6 bbl: 2 | Notes: —            |
| **Octoberfest**         | Status: ✅ On Tap   |
| 1/2 bbl: 1 • 1/6 bbl: 0 | Notes: Seasonal run |
| **Pumpkin Ale**         | Status: 🟢 Low      |
| 1/2 bbl: 2 • 1/6 bbl: 1 | Notes: Almost gone  |



<style>
/* Responsive stacked table */
.resp-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
}
.resp-table th, .resp-table td {
  border-bottom: 1px solid #e5e5e5;
  padding: 8px 10px;
  text-align: left;
  vertical-align: top;
}
.resp-table thead th {
  background: #f8f8f8;
  font-weight: 600;
}
.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1.6;
}
.status-good { background:#e6ffed; }
.status-low { background:#fff8e1; }
.status-critical { background:#ffebee; }

/* Stack rows on small screens */
@media (max-width: 640px) {
  .resp-table thead { display: none; }
  .resp-table, .resp-table tbody, .resp-table tr, .resp-table td { display: block; width: 100%; }
  .resp-table tr { border: 1px solid #eee; border-radius: 10px; margin: 10px 0; padding: 6px 8px; }
  .resp-table td { border: 0; padding: 6px 0; }
  .resp-table td::before {
    content: attr(data-label);
    display: block;
    font-size: 12px;
    color: #666;
    margin-bottom: 2px;
    text-transform: uppercase;
    letter-spacing: .02em;
  }
}
</style>

<h3>Beers on Tap — Downstairs</h3>
<table class="resp-table">
  <thead>
    <tr>
      <th>Tap</th>
      <th>Beer</th>
      <th>Status</th>
      <th>1/2 bbl</th>
      <th>1/6 bbl</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Tap">1</td>
      <td data-label="Beer">In a Haze</td>
      <td data-label="Status"><span class="status-badge status-good">✅ Good</span></td>
      <td data-label="1/2 bbl">4</td>
      <td data-label="1/6 bbl">0</td>
      <td data-label="Notes"></td>
    </tr>
    <tr>
      <td data-label="Tap">2</td>
      <td data-label="Beer">Restitution</td>
      <td data-label="Status"><span class="status-badge status-low">🟡 Low</span></td>
      <td data-label="1/2 bbl">1</td>
      <td data-label="1/6 bbl">1</td>
      <td data-label="Notes">Fresh batch in Tank 7</td>
    </tr>
    <tr>
      <td data-label="Tap">3</td>
      <td data-label="Beer">Slap Juice</td>
      <td data-label="Status"><span class="status-badge status-good">✅ Good</span></td>
      <td data-label="1/2 bbl">5</td>
      <td data-label="1/6 bbl">0</td>
      <td data-label="Notes"></td>
    </tr>
    <tr>
      <td data-label="Tap">4</td>
      <td data-label="Beer">Gringo</td>
      <td data-label="Status"><span class="status-badge status-critical">🔴 Critical</span></td>
      <td data-label="1/2 bbl">0</td>
      <td data-label="1/6 bbl">1</td>
      <td data-label="Notes"></td>
    </tr>
    <!-- Add more rows as needed -->
  </tbody>
</table>

<h3>Beers on Tap — Upstairs</h3>
<!-- duplicate table structure for upstairs with your values -->

Tap lines cleaned: 9/12/2025
## 🍺 Beers on Tap  

 | Tap | Beer             | Status |1/2 Barrel|1/6 Barrel| Notes |
|------------|-----|------------------|--------|-------|--------|-------|
| ⬇️ Downstairs     |        ||  ||  |
| 1   | In a Haze        | ![Good](https://img.shields.io/badge/Stock-Good-green) |4   | |  |
| 2   | Restitution       | ![Low](https://img.shields.io/badge/Stock-Low-yellow) | 1  |  | Fresh batch in Tank 7 |
| 3   | Slap Juice        | ![Good](https://img.shields.io/badge/Stock-Good-green) | 5   | |  |
| 4   | Gringo            | ![Critical](https://img.shields.io/badge/Stock-Critical-red) || 1    |  |
| 5   | Octoberfest       | ![Good](https://img.shields.io/badge/Stock-Good-green) | 12  |  |  |
| 6   | Irish             | ![Good](https://img.shields.io/badge/Stock-Good-green) | 3  |  |  |
| 7   | Strawberry Peach  | ![Critical](https://img.shields.io/badge/Stock-Critical-red)  | 1  |  |  |
| 8   | Jungle            | ![Good](https://img.shields.io/badge/Stock-Good-green)  | 3 |  |  |
| 9   | Route 101         | ![Good](https://img.shields.io/badge/Stock-Good-green)  | 7  | |  |
| 10  | Czechs            | ![Good](https://img.shields.io/badge/Stock-Good-green)  | 17  |  |  |
| 11  | Pumpkin           | ![Good](https://img.shields.io/badge/Stock-Good-green) |  2  |  |  |
| 12  | Seltzer           | ![Low](https://img.shields.io/badge/Stock-Low-yellow)  | 4  | |  |
| ⬆️ Upstairs      |        ||  ||  |
| 1   | In a Haze        | ![Good](https://img.shields.io/badge/Stock-Good-green) |  4   | |  |
| 2   | Amber             | ![Good](https://img.shields.io/badge/Stock-Good-green)  | 4 |  |  |
| 3   | Octoberfest       | ![Good](https://img.shields.io/badge/Stock-Good-green)  | 12   | |  |
| 4   | Gringo            | ![Critical](https://img.shields.io/badge/Stock-Critical-red)  |  | 1  |  |
| 5   | 51st State        | ![Good](https://img.shields.io/badge/Stock-Good-green)  | 4  | |  |
| 6   | Slap Juice        | ![Good](https://img.shields.io/badge/Stock-Good-green)  | 5  |  |  |
| 7   | Pumpkin           | ![Good](https://img.shields.io/badge/Stock-Good-green)  | 2   | |  |
| 8   | Sticky Fingers    | ![Critical](https://img.shields.io/badge/Stock-Critical-red) ||  1    |  |


🪖 In the Tanks (Coming Soon)

- Tank 3 → S'mores
- Tank 7 → Restitution
- Tank 8 → Scottie Pumpkin
- Available tanks: 1, 2, 4, 5, 6

<details> <summary>⏳ On Deck</summary>
-She’s a Peach (7)
-Road Soda (2 sixels)
-99 Problems (3)
-Mole Stout (3)
-Cider (4 sixels)
-Juicy Haze (2 sixels)
-My Boy Blue (4)
-Jacks (2)
-Founders Sept (7)
-Hindsight (1 sixel)
-Founders Oct (7)
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


markdown="1" (Jekyll/kramdown):



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
