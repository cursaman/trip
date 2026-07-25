import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPlaces } from "../api/tourApi";
import { PlaceGrid } from "../components/PlaceCard";
import { EmptyState, ErrorMessage, Loading, SectionTitle } from "../components/UI";
import { contentTypes } from "../constants/tour";
import { normalizePlaces } from "../utils/place";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const type = params.get("type") || "";
  const [input, setInput] = useState(query);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setInput(query);
    if (!query) { setPlaces([]); return; }
    const controller = new AbortController();
    setLoading(true); setError("");
    searchPlaces({ keyword: query, contentTypeId: type, numOfRows: 30, signal: controller.signal })
      .then((r) => setPlaces(normalizePlaces(r.items)))
      .catch((error) => { if (error.code !== "ERR_CANCELED") setError(error.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [query, type]);

  const submit = (event) => { event.preventDefault(); if (input.trim()) setParams({ q: input.trim(), ...(type ? { type } : {}) }); };
  return (
    <section className="page container">
      <SectionTitle eyebrow="SEARCH BUSAN" title="부산 관광정보 검색" description="관광지, 축제, 음식점과 숙박을 한 번에 찾습니다."/>
      <form className="search-form" onSubmit={submit}><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="예: 해운대, 광안리, 감천문화마을"/><button className="button">검색</button></form>
      {query && <div className="tabs">{contentTypes.map(([id,name]) => <button key={id || "all"} className={type === id ? "active" : ""} onClick={() => setParams({ q: query, ...(id ? { type: id } : {}) })}>{name}</button>)}</div>}
      {loading ? <Loading/> : error ? <ErrorMessage message={error}/> : places.length ? <><p className="count">‘{query}’ 검색 결과 {places.length}개</p><PlaceGrid places={places}/></> : <EmptyState title={query ? "검색 결과가 없습니다." : "찾고 싶은 장소를 검색해 보세요."} description="짧은 장소명이나 지역명으로 검색하면 더 잘 찾을 수 있습니다."/>}
    </section>
  );
}
