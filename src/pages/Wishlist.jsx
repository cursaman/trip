import { useState } from "react";
import { Link } from "react-router-dom";
import { PlaceGrid } from "../components/PlaceCard";
import { EmptyState, SectionTitle } from "../components/UI";
import { contentTypes } from "../constants/tour";
import useTrip from "../hooks/useTrip";

export default function Wishlist() {
  const { wishlist, clearWishlist } = useTrip();
  const [type, setType] = useState("");
  const visible = type ? wishlist.filter((item) => item.contentTypeId === type) : wishlist;
  return <section className="page container"><SectionTitle eyebrow="MY BUSAN" title="내 보관함" description={`관심 장소 ${wishlist.length}개를 저장했습니다.`}/>{wishlist.length > 0 && <div className="wish-toolbar"><div className="tabs">{contentTypes.filter(([id]) => !id || wishlist.some((item) => item.contentTypeId === id)).map(([id,name]) => <button key={id || "all"} className={type === id ? "active" : ""} onClick={() => setType(id)}>{name}</button>)}</div><button className="danger" onClick={() => confirm("보관함을 모두 비울까요?") && clearWishlist()}>전체 삭제</button></div>}{visible.length ? <><div className="result-head"><span>{visible.length}개</span><Link className="button" to="/planner">여행 일정 만들기</Link></div><PlaceGrid places={visible}/></> : <EmptyState title={wishlist.length ? "이 유형에 저장된 장소가 없습니다." : "아직 보관한 장소가 없습니다."} description="관광지나 추천 결과에서 하트를 눌러보세요." action={<Link className="button" to="/places">관광지 둘러보기</Link>}/>}</section>;
}
