import { normalizePlace, placeKey } from "./place";
import { addDays } from "./date";

export function createPlan({ title, startDate, dayCount }) {
  const count = Math.min(7, Math.max(1, Number(dayCount) || 1));
  return {
    id: `trip-${Date.now()}`,
    title: title.trim() || "나의 부산 여행",
    startDate,
    dayCount: count,
    days: Array.from({ length: count }, (_, index) => ({
      day: index + 1,
      date: addDays(startDate, index),
      places: [],
    })),
  };
}

export const inPlan = (plan, place) =>
  Boolean(plan?.days.some((day) => day.places.some((item) => placeKey(item) === placeKey(place))));

export function addToPlan(plan, place, dayNumber) {
  if (!plan || inPlan(plan, place)) return plan;
  return {
    ...plan,
    days: plan.days.map((day) => day.day === Number(dayNumber)
      ? { ...day, places: [...day.places, { ...normalizePlace(place), visitTime: "", memo: "" }] }
      : day),
  };
}

export function removeFromPlan(plan, dayNumber, place) {
  return {
    ...plan,
    days: plan.days.map((day) => day.day === Number(dayNumber)
      ? { ...day, places: day.places.filter((item) => placeKey(item) !== placeKey(place)) }
      : day),
  };
}

export function updatePlanPlace(plan, dayNumber, place, changes) {
  return {
    ...plan,
    days: plan.days.map((day) => day.day === Number(dayNumber)
      ? { ...day, places: day.places.map((item) => placeKey(item) === placeKey(place) ? { ...item, ...changes } : item) }
      : day),
  };
}

export function movePlanPlace(plan, dayNumber, index, direction) {
  return {
    ...plan,
    days: plan.days.map((day) => {
      if (day.day !== Number(dayNumber)) return day;
      const places = [...day.places];
      const next = direction === "up" ? index - 1 : index + 1;
      if (next < 0 || next >= places.length) return day;
      [places[index], places[next]] = [places[next], places[index]];
      return { ...day, places };
    }),
  };
}
