import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getCommonDetail, getDetailImages, getIntroDetail } from "../api/tourApi";
import { typeName } from "../constants/tour";
import { SaveButton } from "../components/PlaceCard";
import { EmptyState, ErrorMessage, Loading, SafeImage, SectionTitle } from "../components/UI";
import { normalizePlace, stripHtml } from "../utils/place";

const infoFields = {
  "12": [["이용시간","usetime"],["휴무일","restdate"],["주차","parking"],["문의","infocenter"],["반려동물","chkpet"]],
  "14": [["이용시간","usetimeculture"],["휴무일","restdateculture"],["이용요금","usefee"],["주차","parkingculture"]],
  "15": [["행사 장소","eventplace"],["공연 시간","playtime"],["이용요금","usetimefestival"],["주최자","sponsor1"]],
  "28": [["이용시간","usetimeleports"],["휴무일","restdateleports"],["이용요금","usefeeleports"],["예약","reservation"]],
  "32": [["입실시간","checkintime"],["퇴실시간","checkouttime"],["문의","infocenterlodging"],["주차","parkinglodging"]],
  "39": [["영업시간","opentimefood"],["휴무일","restdatefood"],["대표메뉴","firstmenu"],["취급메뉴","treatmenu"],["주차","parkingfood"]],
};

export default function PlaceDetail() {
  const { contentId } = useParams();
  const [params] = useSearchParams();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const common = await getCommonDetail(contentId);
      if (!common) throw new Error("상세정보를 찾을 수 없습니다.");
      const place = normalizePlace(common);
      const type = params.get("type") || place.contentTypeId;
      const results = await Promise.allSettled([getIntroDetail(contentId, type), getDetailImages(contentId)]);
      setState({ place: { ...place, overview: stripHtml(common.overview || ""), homepage: common.homepage || "" }, type, intro: results[0].status === "fulfilled" ? results[0].value : {}, images: results[1].status === "fulfilled" ? results[1].value : [] });
    } catch (error) { setError(error.message); }
    finally { setLoading(false); }
  }, [contentId, params]);
  useEffect(() => { load(); }, [load]);
  if (loading) return <Loading message="상세정보를 불러오는 중입니다."/>;
  if (error) return <div className="page container"><ErrorMessage message={error} onRetry={load}/></div>;
  if (!state) return <EmptyState/>;
  const { place, type, intro, images } = state;
  const fields = (infoFields[type] || []).map(([label,key]) => [label, stripHtml(intro?.[key] || "")]).filter(([,value]) => value);
  const map = place.mapX && place.mapY ? `https://map.kakao.com/link/map/${encodeURIComponent(place.title)},${place.mapY},${place.mapX}` : "";
  return (
    <article>
      <section className="detail-hero" style={place.image ? { backgroundImage: `linear-gradient(90deg,rgba(3,34,52,.96),rgba(3,34,52,.45)),url("${place.image}")` } : undefined}><div className="container"><span className="eyebrow">{typeName(type)}</span><h1>{place.title}</h1><p>{place.address}</p><div className="button-row"><SaveButton place={{ ...place, contentTypeId: type }} label/>{map && <a className="button outline-light" href={map} target="_blank" rel="noreferrer">지도에서 보기</a>}</div></div></section>
      <div className="container detail-sections">
        <section className="detail-about"><div><SectionTitle eyebrow="ABOUT" title={`${place.title} 소개`}/><p className="overview">{place.overview || "등록된 설명이 없습니다."}</p></div><aside><h3>기본 정보</h3><p><b>주소</b>{place.address || "정보 없음"}</p>{place.telephone && <p><b>전화</b>{place.telephone}</p>}</aside></section>
        <section className="section"><SectionTitle eyebrow="INFORMATION" title="이용 안내"/>{fields.length ? <dl className="info-list">{fields.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> : <EmptyState title="등록된 이용정보가 없습니다."/>}</section>
        <section className="section"><SectionTitle eyebrow="GALLERY" title="추가 이미지"/>{images.length ? <div className="gallery">{images.map((image,index) => <SafeImage key={image.serialnum || index} src={image.originimgurl} alt={`${place.title} ${index + 1}`}/>)}</div> : <SafeImage src={place.image} alt={place.title}/>}</section>
        <Link className="text-link" to="/places">← 관광지 목록으로</Link>
      </div>
    </article>
  );
}
