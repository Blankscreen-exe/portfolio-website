# Legacy data

The JSON files the site used before it moved to Keystatic (`src/data/` in the old Vite app).
They are kept for reference only; the site reads `content/`.

`npm run verify:legacy` compares every record and field here with the Keystatic content and
reports anything missing. It passed at the time of migration. After content is edited in
Keystatic, differences are expected.

Intentionally not migrated:

- `gamesList.json`: games are no longer part of the site.
- `certificates*.json`: placeholder entries only ("Lorem ipsum", no files).
- `projectList copy.json`, `projectList copy 2.json`: older snapshots of `projectList.json`.

`faq.json` was rewritten after the migration to four questions per group; the verifier maps
every old question to the one it was merged into, or the reason it was dropped.

`devResourceList.json` was merged into bookmarks (category "learning", with provider and rating).
