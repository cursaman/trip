import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Places from "./pages/Places";
import PlaceDetail from "./pages/PlaceDetail";
import Search from "./pages/Search";
import Festivals from "./pages/Festivals";
import TripPicker from "./pages/TripPicker";
import Wishlist from "./pages/Wishlist";
import Planner from "./pages/Planner";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="places" element={<Places />} />
        <Route path="place/:contentId" element={<PlaceDetail />} />
        <Route path="search" element={<Search />} />
        <Route path="festivals" element={<Festivals />} />
        <Route path="recommend" element={<TripPicker />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="planner" element={<Planner />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
