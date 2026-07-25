import { useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState, SafeImage, SectionTitle } from "../components/UI";
import useTrip from "../hooks/useTrip";
import { localDate } from "../utils/date";
import { inPlan } from "../utils/planner";

function Setup({ onCreate }) {
  const [title, setTitle] = useState("나의 부산 여행");
  const [startDate, setStartDate] = useState(localDate());
  const [dayCount, setDayCount] = useState("2");
  return <form className="plan-setup" onSubmit={(e) => { e.preventDefault(); onCreate({ title, startDate, dayCount }); }}><h2>새로운 여행 일정</h2><label>여행 제목<input value={title} onChange={(e) => setTitle(e.target.value)}/></label><label>시작일<input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/></label><label>여행 일수<select value={dayCount} onChange={(e) => setDayCount(e.target.value)}>{[1,2,3,4,5,6,7].map((n) => <option key={n} value={n}>{n === 1 ? "당일" : `${n - 1}박 ${n}일`}</option>)}</select></label><button className="button">일정 만들기</button></form>;
}

export default function Planner() {
  const { wishlist, activePlan, makePlan, deletePlan, addPlace, removePlace, updatePlace, movePlace } = useTrip();
  const [targetDay, setTargetDay] = useState(1);
  if (!activePlan) return <section className="page container"><SectionTitle eyebrow="TRIP PLANNER" title="나의 부산 여행 일정" description="보관한 장소를 날짜별 여행 일정으로 구성해 보세요."/><Setup onCreate={makePlan}/></section>;
  return (
    <section className="page container">
      <div className="plan-head"><div><span className="eyebrow">MY TRIP</span><h1>{activePlan.title}</h1><p>{activePlan.startDate}부터 {activePlan.dayCount}일</p></div><button className="danger" onClick={() => confirm("현재 일정을 삭제할까요?") && deletePlan()}>일정 삭제</button></div>
      <div className="planner-layout">
        <aside className="saved-panel"><h2>보관한 장소</h2><select value={targetDay} onChange={(e) => setTargetDay(Number(e.target.value))}>{activePlan.days.map((day) => <option key={day.day} value={day.day}>{day.day}일차에 추가</option>)}</select>{wishlist.length ? wishlist.map((place) => { const added = inPlan(activePlan, place); return <div className={`saved-row ${added ? "disabled" : ""}`} key={`${place.contentTypeId}-${place.contentId}`}><SafeImage src={place.thumbnail || place.image} alt={place.title}/><span><b>{place.title}</b><small>{place.address}</small></span><button disabled={added} onClick={() => addPlace(place, targetDay)}>{added ? "추가됨" : "추가"}</button></div>; }) : <p>보관한 장소가 없습니다.</p>}</aside>
        <div className="plan-days">{activePlan.days.map((day) => <section className="plan-day" key={day.day}><header><span>DAY {day.day}</span><h2>{day.day}일차</h2><b>{day.date}</b></header>{day.places.length ? <ol>{day.places.map((place,index) => <li key={`${place.contentTypeId}-${place.contentId}`}><div className="order"><b>{index + 1}</b><button disabled={index === 0} onClick={() => movePlace(day.day,index,"up")}>↑</button><button disabled={index === day.places.length - 1} onClick={() => movePlace(day.day,index,"down")}>↓</button></div><SafeImage src={place.thumbnail || place.image} alt={place.title}/><div className="schedule"><div><Link to={`/place/${place.contentId}?type=${place.contentTypeId}`}><h3>{place.title}</h3></Link><button className="danger" onClick={() => removePlace(day.day,place)}>삭제</button></div><p>{place.address}</p><label>방문시간<input type="time" value={place.visitTime} onChange={(e) => updatePlace(day.day,place,{visitTime:e.target.value})}/></label><label>메모<input value={place.memo} onChange={(e) => updatePlace(day.day,place,{memo:e.target.value})} placeholder="예약, 식사 등"/></label></div></li>)}</ol> : <EmptyState title="이 날짜에 장소를 추가해 보세요."/>}</section>)}</div>
      </div>
    </section>
  );
}
