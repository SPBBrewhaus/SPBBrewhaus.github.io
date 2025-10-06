<style>
/* keep your bullet styling for <details> sections elsewhere on the page */
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
<div id="downstairs-table" style="margin-top:1rem;">Loading…</div>
<div id="upstairs-table" style="margin-top:1rem;">Loading…</div>
<div id="ondeck-table" style="margin-top:1rem;">Loading…</div>

<h3 style="margin-top:1.25rem;">Live beers for party</h3>
<div id="party-table" style="margin-top:0.5rem;"></div>

<script>
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTn3XrnFcps7_xm4HBCDfHCss0DB0Wwd5DRlXGxvE4hk9Nc_Hw8-6HuB6LS7p09BlOP44FhL_ByR1kQ/pub?output=csv";

  // CSV parser
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