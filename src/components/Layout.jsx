import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { hasTourApiKey } from "../api/tourApi";
import useTrip from "../hooks/useTrip";

const links = [
  ["/", "홈"], ["/places", "관광지"], ["/festivals", "축제"],
  ["/recommend", "여행 추천"], ["/planner", "여행 일정"], ["/wishlist", "보관함"], ["/search", "검색"],
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { wishlist } = useTrip();
  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="app">
      <a className="skip" href="#main-content">본문 바로가기</a>
      <header className="header">
        <div className="container header-inner">
          <NavLink className="logo" to="/"><b>B</b> 부산 어디가지?</NavLink>
          <button className={`menu ${open ? "open" : ""}`} onClick={() => setOpen(!open)} aria-expanded={open} aria-label="메뉴 열기"><span/><span/><span/></button>
          <nav className={`nav ${open ? "open" : ""}`}>
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => isActive ? "active" : ""}>
                {label}{to === "/wishlist" && wishlist.length > 0 && <em>{wishlist.length}</em>}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      {!hasTourApiKey && <div className="api-notice">프로젝트 최상위 <code>.env</code>에 <b>VITE_TOUR_API_KEY</b>를 설정한 후 서버를 다시 실행해 주세요.</div>}
      <main id="main-content"><Outlet /></main>
      <footer className="footer"><div className="container"><strong>부산 어디가지?</strong><p>관광지를 발견하고, 보관하고, 나만의 여행 일정을 만드세요.</p><small>본 서비스는 한국관광공사 TourAPI 데이터를 활용합니다.</small></div></footer>
    </div>
  );
}
