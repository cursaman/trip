import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { normalizePlace, placeKey } from "../utils/place";
import { addToPlan, createPlan, movePlanPlace, removeFromPlan, updatePlanPlace } from "../utils/planner";

export const TripContext = createContext(null);
const WISH_KEY = "busan-trip:wishlist";
const PLAN_KEY = "busan-trip:active-plan";

function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

export function TripProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const value = read(WISH_KEY, []);
    return Array.isArray(value) ? value : [];
  });
  const [activePlan, setActivePlan] = useState(() => {
    const value = read(PLAN_KEY, null);
    return value && Array.isArray(value.days) ? value : null;
  });

  useEffect(() => localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => {
    if (activePlan) localStorage.setItem(PLAN_KEY, JSON.stringify(activePlan));
    else localStorage.removeItem(PLAN_KEY);
  }, [activePlan]);

  const isSaved = useCallback(
    (place) => wishlist.some((item) => placeKey(item) === placeKey(place)),
    [wishlist],
  );
  const toggleSaved = useCallback((raw) => {
    const place = normalizePlace(raw);
    setWishlist((current) => current.some((item) => placeKey(item) === placeKey(place))
      ? current.filter((item) => placeKey(item) !== placeKey(place))
      : [{ ...place, savedAt: new Date().toISOString() }, ...current]);
  }, []);

  const value = useMemo(() => ({
    wishlist,
    isSaved,
    toggleSaved,
    clearWishlist: () => setWishlist([]),
    activePlan,
    makePlan: (settings) => setActivePlan(createPlan(settings)),
    deletePlan: () => setActivePlan(null),
    addPlace: (place, day) => setActivePlan((plan) => addToPlan(plan, place, day)),
    removePlace: (day, place) => setActivePlan((plan) => removeFromPlan(plan, day, place)),
    updatePlace: (day, place, changes) => setActivePlan((plan) => updatePlanPlace(plan, day, place, changes)),
    movePlace: (day, index, direction) => setActivePlan((plan) => movePlanPlace(plan, day, index, direction)),
  }), [wishlist, isSaved, toggleSaved, activePlan]);

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}
