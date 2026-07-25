import { Link } from "react-router-dom";
import { displayDate, festivalStatus } from "../utils/date";
import { SafeImage } from "./UI";
import { SaveButton } from "./PlaceCard";

export default function FestivalCard({ festival }) {
  const [label, className] = festivalStatus(festival.eventStartDate, festival.eventEndDate);
  const path = `/place/${festival.contentId}?type=15`;
  return (
    <article className="festival-card">
      <Link className="festival-image" to={path}><SafeImage src={festival.thumbnail || festival.image} alt={festival.title} fallback="🎉"/><b className={className}>{label}</b></Link>
      <div className="card-content">
        <span className="date">{displayDate(festival.eventStartDate)} ~ {displayDate(festival.eventEndDate)}</span>
        <Link to={path}><h3>{festival.title}</h3></Link>
        <p>{festival.address || "행사 장소 정보가 없습니다."}</p>
        <div className="card-actions"><Link to={path}>축제 상세 →</Link><SaveButton place={festival}/></div>
      </div>
    </article>
  );
}
