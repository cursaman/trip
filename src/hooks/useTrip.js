import { useContext } from "react";
import { TripContext } from "../contexts/TripContext";

export default function useTrip() {
  const value = useContext(TripContext);
  if (!value) throw new Error("useTrip은 TripProvider 안에서 사용해야 합니다.");
  return value;
}
