<!--
Editors: the rules for this file are in the README section "What's changed". Newest first.
Never edit or delete an old entry; add a dated "- **Update YYYY-MM-DD:**" line at its end.
After any change, rebuild the page:
  python3 scripts/whats_changed.py render WHATS-CHANGED.md --format page --out frontend/public/whats-changed.html --site-name "Boundaries Map" --home-url ./ --repo-url https://github.com/BetaNYC/nyc-boundaries
-->
# What's changed

This page lists the changes to Boundaries Map that a reader would notice: new boundaries and features, data updates, and corrections when we published something wrong. Newest first. Routine reloads of boundary files that change nothing on the map are not listed.

- **History begins:** 2018-08-20. The first version of the map was published that day. Entries before 2025 summarize releases, so smaller changes and corrections from those years may be missing.
- **Data refresh:** by hand, when the City publishes new boundary files. There is no fixed schedule.

The boundaries come from City, State and federal agencies, and the map shows them as those agencies publish them. When we find a problem in a source, we describe it here.

To report a bug in the map or ask for a new feature, [open an issue on GitHub](https://github.com/BetaNYC/nyc-boundaries/issues).

## 2026-10-19: Election Districts did not match the City's current maps

- **Tags:** Data, Correction
- **What changed:** A State Assembly candidate told us that the Election Districts on the map did not match the City's official district maps. On October 19, 2026 we replaced them with City Planning's release 26C, published August 10, 2026. For example, Election District 24001, in Assembly District 24, was shown near Liberty Avenue and Rockaway Boulevard; it now sits near Union Turnpike and the Grand Central Parkway.
- **If you used the old numbers:** The Election Districts layer was added on October 16, 2025, and the record does not show when it fell behind. If you looked up an Election District on the map before October 19, 2026, look it up again: compared with the old layer, 678 districts changed shape, 69 were removed and 19 are new. For official lines, check the City's own district maps.
- **Who it affects:** Anyone who looked up an Election District, or which districts overlap one.
- **More detail:** [The fix](https://github.com/BetaNYC/nyc-boundaries/pull/109) · [The data refresh](https://github.com/BetaNYC/nyc-boundaries/issues/112)

## 2026-10-19: ZIP Codes now use the 2020 Census areas

- **Tags:** Data
- **What changed:** The ZIP Code layer now uses the 2020 Census ZIP Code areas published on NYC Open Data, in place of an older version built on 2010 areas. It has 221 areas instead of 178, including 11249 on the Williamsburg waterfront, and links to a ZIP Code on the map still work. These areas are the Census Bureau's approximation of ZIP Codes, and in the City's file eight small slivers of ZIP Codes from outside the city fall inside its borders; the map shows them as published.
- **Who it affects:** Anyone who uses the ZIP Code layer.
- **More detail:** [Pull request](https://github.com/BetaNYC/nyc-boundaries/pull/111) · [The dataset on NYC Open Data](https://data.cityofnewyork.us/d/35j5-n34v)

## 2026-10-19: Historic Districts kept their earlier copy because the City's file is incomplete

- **Tags:** Data
- **What changed:** The City's Historic Districts file on NYC Open Data is missing 17 designated historic districts and changed how it records locations, so the map kept its earlier copy of the layer (157 districts) in the October 2026 refresh. BetaNYC reported the problem to the City on October 17, 2026.
- **Who it affects:** Anyone who uses the Historic Districts layer.
- **More detail:** [What is missing from the City's file](https://github.com/BetaNYC/nyc-boundaries/issues/110)

## 2026-02-02: Right-click the marker to copy its coordinates

- **Tags:** Site
- **What changed:** Right-click the marker on the map to see its latitude and longitude and copy them.
- **More detail:** [Pull request](https://github.com/BetaNYC/nyc-boundaries/pull/104)

## 2025-10-16: Six new boundaries, and a new order in the list

- **Tags:** Data, Site
- **What changed:** The map adds Public Use Microdata Areas, Community District Tabulation Areas, Police Sectors, Neighborhood Development Areas, Election Districts and Municipal Court Districts. The boundaries in the sidebar are listed in a new order.
- **More detail:** [New boundaries](https://github.com/BetaNYC/nyc-boundaries/pull/100) · [New order](https://github.com/BetaNYC/nyc-boundaries/pull/102)

## 2025-10-09: UHF 42 neighborhoods added

- **Tags:** Data
- **What changed:** The map adds the 42 United Hospital Fund neighborhoods, which are often used to report health statistics.
- **More detail:** [Pull request](https://github.com/BetaNYC/nyc-boundaries/pull/99)

## 2025-10-02: Subway lines on the base map

- **Tags:** Site
- **What changed:** The base map now shows subway lines, from the MTA's data on data.ny.gov.
- **More detail:** [Pull request](https://github.com/BetaNYC/nyc-boundaries/pull/98)

## 2025-07-08: Boundaries rebuilt, and overlaps listed once

- **Tags:** Data
- **What changed:** Every boundary was reloaded with an improved method, and the shapes were simplified very slightly, by about one quarter of the width of a major street. A district that overlaps a ZIP Code made of more than one piece is now listed once in the overlaps, not once for each piece.
- **More detail:** [How the boundaries are built now](https://github.com/BetaNYC/nyc-boundaries/issues/97) · [The repeated overlaps](https://github.com/BetaNYC/nyc-boundaries/issues/92)

## 2025-05-22: Map data moved to a server BetaNYC runs

- **Tags:** Site
- **What changed:** Carto retired the service the map used for its data. From April 21, 2025 the map read its data from Supabase, and from May 22, 2025 it reads it from a server BetaNYC runs. The map works as before.
- **More detail:** [Moving off Carto](https://github.com/BetaNYC/nyc-boundaries/issues/95) · [The new server](https://github.com/BetaNYC/nyc-boundaries/issues/97)

## 2025-02-16: City Council lines from before 2024 removed

- **Tags:** Data
- **What changed:** The City Council district lines used before 2024 were removed from the map. The City Council layer shows the current lines.
- **More detail:** [Pull request](https://github.com/BetaNYC/nyc-boundaries/pull/94)

## 2024-02-20: The 2024 City Council lines became the main council layer

- **Tags:** Data
- **What changed:** The City Council layer now shows the 2024 district lines. The earlier lines stayed on the map as a separate layer, labeled "prior to 2024".
- **More detail:** [The change](https://github.com/BetaNYC/nyc-boundaries/commit/a008f1e)

## 2023-11-07: Overlap percentages are easier to compare

- **Tags:** Site
- **What changed:** Overlap percentages now show one decimal place and line up in a column. The copy button now says "Copy to clipboard" and changes to "Copied!" when you click it.
- **More detail:** [Pull request](https://github.com/BetaNYC/nyc-boundaries/pull/90)

## 2023-02-06: Industrial Business Zones, the 2024 council lines, and copying overlaps

- **Tags:** Data, Site
- **What changed:** The map adds Industrial Business Zones and the City Council lines drawn for 2024, labeled "Upcoming 2024". You can copy a district's list of overlaps to the clipboard and paste it into a spreadsheet. Colors were changed for better contrast.
- **More detail:** [Copy to clipboard](https://github.com/BetaNYC/nyc-boundaries/issues/81) · [The change](https://github.com/BetaNYC/nyc-boundaries/commit/639ee40)

## 2022-08-05: Historic Districts and overlap percentages

- **Tags:** Data, Site
- **What changed:** The map adds Historic Districts. Each overlapping district now shows what share of the selected district it covers.
- **More detail:** [Historic Districts](https://github.com/BetaNYC/nyc-boundaries/pull/78)

## 2022-07-28: A new version of the map

- **Tags:** Site, Data
- **What changed:** The map was rebuilt with a new design. You can click a district on the map, filter and pick districts in the sidebar, and share a link to a district or a point. All boundaries were updated for the 2022 redistricting, and many districts link to a page about them.
- **More detail:** [The 2022 districts](https://github.com/BetaNYC/nyc-boundaries/issues/68) · [Links to district pages](https://github.com/BetaNYC/nyc-boundaries/pull/79)

## 2022-07-06: Fonts that load faster

- **Tags:** Site
- **What changed:** The map uses the fonts already on your device instead of downloading web fonts, which is better for accessibility and speed.
- **More detail:** [Pull request](https://github.com/BetaNYC/nyc-boundaries/pull/75)

## 2021-06-03: Very small overlaps are no longer listed

- **Tags:** Data
- **What changed:** An overlap must now cover at least 0.5 percent of the selected district to be listed, up from 0.025 percent. Overlaps under 5 percent are marked with an asterisk. The map also works better on phones.
- **More detail:** [Pull request](https://github.com/BetaNYC/nyc-boundaries/pull/61)

## 2021-05-17: A switch to stop map clicks from searching

- **Tags:** Site
- **What changed:** A checkbox turns off the search that runs when you click the map, and the map remembers your choice.
- **More detail:** [Pull request](https://github.com/BetaNYC/nyc-boundaries/pull/57)

## 2020-02-24: Clearer labels on the map

- **Tags:** Site
- **What changed:** District labels were resized and moved on January 7, 2020. From February 24, 2020 the base map also shows place labels.
- **More detail:** [Labels](https://github.com/BetaNYC/nyc-boundaries/pull/37) · [Base map](https://github.com/BetaNYC/nyc-boundaries/pull/44)

## 2020-02-14: Neighborhood Tabulation Areas are back

- **Tags:** Data
- **What changed:** The Neighborhood Tabulation Areas layer was turned off on February 6, 2020 because of a problem with NYC Open Data. It was reloaded and is back on the map.
- **More detail:** [Turned off](https://github.com/BetaNYC/nyc-boundaries/pull/41) · [Reloaded](https://github.com/BetaNYC/nyc-boundaries/pull/43)

## 2020-02-06: School Districts were mixed with Sanitation Districts

- **Tags:** Data, Correction
- **What changed:** Our data gave the School Districts and the Sanitation Districts the same name, so the School Districts layer also showed Sanitation Districts. The Sanitation Districts now have their own name, and the School Districts layer shows only school districts. A fix on January 6, 2020 was undone by mistake the same day, so the error lasted until February 6, 2020.
- **If you used the old numbers:** The record points to November 18, 2019, when the map began reading every boundary from one combined file, as the start. If you looked up a School District, or which districts overlap one, between November 18, 2019 and February 6, 2020, the answer may have included Sanitation Districts. School District lines may have changed since, so check against the current map rather than trying to rebuild the old answer.
- **Who it affects:** Anyone who used the School Districts layer in that period.
- **More detail:** [The fix](https://github.com/BetaNYC/nyc-boundaries/pull/41) · [The first fix, undone the same day](https://github.com/BetaNYC/nyc-boundaries/pull/34) · [The combined file](https://github.com/BetaNYC/nyc-boundaries/pull/29)

## 2019-11-18: Faster map, address search and ZIP Codes

- **Tags:** Site, Data
- **What changed:** The map reads every boundary from one combined file, so finding overlaps is faster. Address search uses NYC Planning Labs' GeoSearch, and the map adds ZIP Codes. The scroll wheel zooms the map again.
- **More detail:** [Pull request](https://github.com/BetaNYC/nyc-boundaries/pull/29) · [Scroll wheel](https://github.com/BetaNYC/nyc-boundaries/issues/30)

## 2019-08-08: Searching for an address puts a point on the map

- **Tags:** Site
- **What changed:** When you search for an address, the map now marks it with a point.
- **More detail:** [Issue](https://github.com/BetaNYC/nyc-boundaries/issues/15)

## 2018-11-30: Compare a district with every other boundary, and Business Improvement Districts

- **Tags:** Site, Data
- **What changed:** Pick a district in any boundary and see which districts of every other boundary overlap it. The map adds Business Improvement Districts and a link to reset the map after a search. Parks that appeared as community districts (for example 355 and 484) were removed from that layer.
- **More detail:** [Compare districts](https://github.com/BetaNYC/nyc-boundaries/issues/9) · [Business Improvement Districts](https://github.com/BetaNYC/nyc-boundaries/issues/13) · [Parks](https://github.com/BetaNYC/nyc-boundaries/issues/8)

## 2018-09-17: Find every district at an address

- **Tags:** Site
- **What changed:** Search for a place to see every district it falls in, or pick a community district to see which districts overlap it. The map adds a description and instructions.
- **More detail:** [Districts at a place](https://github.com/BetaNYC/nyc-boundaries/issues/1) · [Overlaps for a community district](https://github.com/BetaNYC/nyc-boundaries/issues/2)

## 2018-08-20: Boundaries Map published

- **Tags:** Site
- **What changed:** The first version of Boundaries Map was published, to show how New York City's administrative boundaries overlap.
- **More detail:** [The first version](https://github.com/BetaNYC/nyc-boundaries/commit/124a28a)
