import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getDistricts, getPlaces } from "../api/tourApi";
import { PlaceGrid } from "../components/PlaceCard";
import { EmptyState, ErrorMessage, Loading, SectionTitle } from "../components/UI";
import { contentTypes } from "../constants/tour";
import { mergePlaces, normalizePlaces } from "../utils/place";

export default function Places() {
  const [params, setParams] = useSearchParams();
  const type = params.get("type") || "12";
  const district = params.get("district") || "";
  const sort = params.get("sort") || "Q";
  const [districts, setDistricts] = useState([]);
  const [places, setPlaces] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { getDistricts().then((r) => setDistricts(r.items)).catch(() => setDistricts([])); }, []);
  const load = useCallback(async (nextPage = 1, append = false) => {
    append ? setMore(true) : setLoading(true); setError("");
    try {
      const result = await getPlaces({ contentTypeId: type, sigunguCode: district, arrange: sort, pageNo: nextPage });
      const normalized = normalizePlaces(result.items);
      setPlaces((current) => append ? mergePlaces(current, normalized) : normalized);
      setPage(nextPage); setTotal(result.totalCount);
    } catch (error) { setError(error.message); }
    finally { setLoading(false); setMore(false); }
  }, [type, district, sort]);
  useEffect(() => { load(1); }, [load]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next);
  };

  return (
    <section className="page container">
      <SectionTitle eyebrow="EXPLORE BUSAN" title="부산 관광지 탐색" description="지역과 관광 유형을 선택해 원하는 장소를 찾아보세요."/>
      <div className="filters">
        <label>관광 유형<select value={type} onChange={(e) => update("type", e.target.value)}>{contentTypes.map(([id,name]) => <option key={id || "all"} value={id}>{name}</option>)}</select></label>
        <label>지역<select value={district} onChange={(e) => update("district", e.target.value)}><option value="">부산 전체</option>{districts.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></label>
        <label>정렬<select value={sort} onChange={(e) => update("sort", e.target.value)}><option value="Q">최근 정보순</option><option value="O">이름순</option><option value="R">등록일순</option></select></label>
        <button onClick={() => setParams({ type: "12", sort: "Q" })}>초기화</button>
      </div>
      {loading ? <Loading/> : error && !places.length ? <ErrorMessage message={error} onRetry={() => load(1)}/> : !places.length ? <EmptyState/> : <><p className="count">전체 {total.toLocaleString()}개 중 {places.length}개</p><PlaceGrid places={places}/>{places.length < total && <div className="more"><button className="button" disabled={more} onClick={() => load(page + 1, true)}>{more ? "불러오는 중…" : "더 보기"}</button></div>}</>}
    </section>
  );
}
