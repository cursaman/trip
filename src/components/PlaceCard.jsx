import { Link } from "react-router-dom";
import { typeName } from "../constants/tour";
import useTrip from "../hooks/useTrip";
import { SafeImage } from "./UI";

export function SaveButton({ place, label = false }) {
  const { isSaved, toggleSaved } = useTrip();
  const saved = isSaved(place);
  return (
    <button className={`save ${saved ? "saved" : ""} ${label ? "label" : ""}`} onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggleSaved(place); }} aria-pressed={saved}>
      {saved ? "♥" : "♡"}{label && <span>{saved ? "보관 중" : "보관하기"}</span>}
    </button>
  );
}

export function PlaceCard({ place }) {
  const path = `/place/${place.contentId}?type=${place.contentTypeId}`;
  return (
    <article className="place-card">
      <Link className="place-image" to={path}><SafeImage src={place.thumbnail || place.image} alt={place.title}/></Link>
      <div className="card-content">
        <span className="type">{typeName(place.contentTypeId)}</span>
        <Link to={path}><h3>{place.title}</h3></Link>
        <p>{place.address || "주소 정보가 없습니다."}</p>
        <div className="card-actions"><Link to={path}>자세히 보기 →</Link><SaveButton place={place}/></div>
      </div>
    </article>
  );
}

export function PlaceGrid({ places }) {
  return <div className="place-grid">{places.map((place) => <PlaceCard key={`${place.contentTypeId}-${place.contentId}`} place={place}/>)}</div>;
}
