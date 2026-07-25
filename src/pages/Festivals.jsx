import { useCallback, useEffect, useState } from "react";
import { getFestivals } from "../api/tourApi";
import FestivalCard from "../components/FestivalCard";
import { EmptyState, ErrorMessage, Loading, SectionTitle } from "../components/UI";
import { addDays, apiDate, localDate } from "../utils/date";
import { mergePlaces, normalizePlaces } from "../utils/place";

export default function Festivals() {
  const today = localDate();
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(addDays(today, 30));
  const [applied, setApplied] = useState([start, end]);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async (nextPage = 1, append = false) => {
    setLoading(true); setError("");
    try {
      const result = await getFestivals({ startDate: apiDate(applied[0]), endDate: apiDate(applied[1]), pageNo: nextPage });
      const normalized = normalizePlaces(result.items);
      setItems((current) => append ? mergePlaces(current, normalized) : normalized);
      setTotal(result.totalCount); setPage(nextPage);
    } catch (error) { setError(error.message); }
    finally { setLoading(false); }
  }, [applied]);
  useEffect(() => { load(1); }, [load]);
  const period = (days) => { const nextEnd = addDays(today, days); setStart(today); setEnd(nextEnd); setApplied([today, nextEnd]); };
  return (
    <section className="page container">
      <SectionTitle eyebrow="BUSAN FESTIVALS" title="부산 축제·행사" description="여행 날짜에 맞는 부산의 축제를 찾아보세요."/>
      <div className="festival-filter">
        <div className="tabs"><button onClick={() => period(0)}>오늘</button><button onClick={() => period(7)}>이번 주</button><button onClick={() => period(30)}>앞으로 30일</button></div>
        <form onSubmit={(e) => { e.preventDefault(); if (start > end) return alert("종료일을 확인해 주세요."); setApplied([start, end]); }}><label>시작일<input type="date" value={start} onChange={(e) => setStart(e.target.value)}/></label><label>종료일<input type="date" min={start} value={end} onChange={(e) => setEnd(e.target.value)}/></label><button className="button">날짜 검색</button></form>
      </div>
      {loading && !items.length ? <Loading/> : error && !items.length ? <ErrorMessage message={error} onRetry={() => load(1)}/> : !items.length ? <EmptyState title="선택한 기간에 등록된 축제가 없습니다."/> : <><p className="count">축제 {total.toLocaleString()}개</p><div className="festival-grid">{items.map((item) => <FestivalCard key={item.contentId} festival={item}/>)}</div>{items.length < total && <div className="more"><button className="button" onClick={() => load(page + 1, true)}>축제 더 보기</button></div>}</>}
    </section>
  );
}
