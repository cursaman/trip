export function normalizePlace(item = {}) {
  return {
    contentId: String(item.contentId || item.contentid || ""),
    contentTypeId: String(item.contentTypeId || item.contenttypeid || ""),
    title: item.title || "이름 없는 관광정보",
    address: item.address || [item.addr1, item.addr2].filter(Boolean).join(" "),
    image: item.image || item.firstimage || "",
    thumbnail: item.thumbnail || item.firstimage2 || item.firstimage || "",
    mapX: item.mapX || item.mapx || "",
    mapY: item.mapY || item.mapy || "",
    telephone: item.telephone || item.tel || "",
    eventStartDate: String(item.eventStartDate || item.eventstartdate || ""),
    eventEndDate: String(item.eventEndDate || item.eventenddate || ""),
    savedAt: item.savedAt || "",
  };
}

export const normalizePlaces = (items = []) => items.map(normalizePlace);
export const placeKey = (place) => `${place.contentTypeId}-${place.contentId}`;

export function mergePlaces(first, second) {
  const map = new Map();
  [...first, ...second].forEach((place) => map.set(placeKey(place), place));
  return [...map.values()];
}

export function stripHtml(value = "") {
  const node = document.createElement("div");
  node.innerHTML = value;
  return (node.textContent || "").trim();
}
