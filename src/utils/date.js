export function localDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const apiDate = (value) =>
  (typeof value === "string" ? value : localDate(value)).replace(/-/g, "");

export function addDays(value, amount) {
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + amount);
  return localDate(date);
}

export function displayDate(value = "") {
  const raw = value.replace(/-/g, "");
  return raw.length === 8
    ? `${raw.slice(0, 4)}.${raw.slice(4, 6)}.${raw.slice(6, 8)}`
    : "날짜 미정";
}

export function festivalStatus(start, end) {
  const today = apiDate(new Date());
  if (!start || !end) return ["일정 미정", "unknown"];
  if (today < start) return ["진행 예정", "upcoming"];
  if (today > end) return ["종료", "ended"];
  return ["진행 중", "ongoing"];
}
