/**
 * Standard Turf Name Resolver & Sorter for MG Cricketer's Den
 * Maps raw database / legacy turf IDs & names to official names:
 * 1. Astro Wicket (Net 1 / Astro Turf)
 * 2. Turf Wicket (Net 2 / Natural Turf)
 * 3. Open Turf Wicket Ground (Ground 1 / Open Match Ground)
 */

export function getTurfDisplayName(nameOrId) {
  if (!nameOrId) return "Astro Wicket";
  const str = String(nameOrId).trim().toLowerCase();

  if (
    str === "ground 1" ||
    str.includes("open match ground") ||
    str.includes("open turf") ||
    str.includes("royapudupakkam") ||
    str === "open" ||
    str === "ground"
  ) {
    return "Open Turf Wicket Ground";
  }

  if (
    str === "net 1" ||
    str.includes("astro")
  ) {
    return "Astro Wicket";
  }

  if (
    str === "net 2" ||
    str.includes("natural") ||
    str.includes("turf wicket") ||
    str === "turf"
  ) {
    return "Turf Wicket";
  }

  return nameOrId;
}

export function sortTurfs(turfsList = []) {
  const ORDER = {
    "Astro Wicket": 1,
    "Turf Wicket": 2,
    "Open Turf Wicket Ground": 3,
  };

  return [...turfsList].sort((a, b) => {
    const nameA = getTurfDisplayName(a.name || a.id);
    const nameB = getTurfDisplayName(b.name || b.id);
    const orderA = ORDER[nameA] || 99;
    const orderB = ORDER[nameB] || 99;
    return orderA - orderB;
  });
}
