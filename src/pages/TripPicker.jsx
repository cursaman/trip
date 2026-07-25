import { useState } from "react";
import { getPlaces, searchPlaces } from "../api/tourApi";
import { PlaceGrid } from "../components/PlaceCard";
import { EmptyState, ErrorMessage, Loading, SectionTitle } from "../components/UI";
import { mergePlaces, normalizePlaces } from "../utils/place";

const options = {
  companion: [["solo","🚶 혼자"],["couple","💑 연인"],["family","👨‍👩‍👧 가족"],["friends","👥 친구"]],
  theme: [["sea","🌊 바다"],["nature","🌿 자연"],["culture","🎨 문화"],["food","🍽️ 맛집"],["activity","🚲 체험"]],
  duration: [["2","3시간"],["3","반나절"],["5","하루"],["8","1박 2일"]],
  transport: [["walk","🚶 도보"],["public","🚇 대중교통"],["car","🚗 자동차"]],
};
const themes = {
  sea: ["12","해변",["해변","해수욕장","바다","해안"]],
  nature: ["12","공원",["공원","숲","산","생태"]],
  culture: ["14","문화",["문화","미술관","박물관","전시"]],
  food: ["39","부산",["음식","식당","시장","카페"]],
  activity: ["28","체험",["체험","레포츠","요트","서핑"]],
};

function Choices({ title, name, items, value, onChange }) {
  return <fieldset><legend>{title}</legend><div className="choices">{items.map(([id,label]) => <label key={id} className={value === id ? "selected" : ""}><input type="radio" name={name} checked={value === id} onChange={() => onChange(id)}/><span>{label}</span></label>)}</div></fieldset>;
}

export default function TripPicker() {
  const [form, setForm] = useState({ companion: "solo", theme: "sea", duration: "3", transport: "public" });
  const [results, setResults] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const recommend = async (event) => {
    event?.preventDefault(); setLoading(true); setError("");
    const [type, keyword, words] = themes[form.theme];
    try {
      const calls = await Promise.allSettled([getPlaces({ contentTypeId: type, numOfRows: 30 }), searchPlaces({ keyword, contentTypeId: type, numOfRows: 30 })]);
      let places = [];
      calls.forEach((call) => { if (call.status === "fulfilled") places = mergePlaces(places, normalizePlaces(call.value.items)); });
      const scored = places.map((place) => ({ ...place, score: (place.image ? 3 : 0) + (place.address ? 1 : 0) + (place.mapX ? 2 : 0) + words.reduce((score, word) => score + (`${place.title} ${place.address}`.includes(word) ? 3 : 0), 0) })).sort((a,b) => b.score - a.score);
      if (!scored.length) throw new Error("추천 후보를 찾지 못했습니다.");
      setCandidates(scored); setResults(scored.slice(0, Number(form.duration))); setOffset(Number(form.duration));
    } catch (error) { setError(error.message); }
    finally { setLoading(false); }
  };
  const again = () => {
    const count = Number(form.duration);
    const rotated = [...candidates.slice(offset), ...candidates.slice(0, offset)];
    setResults(rotated.slice(0, count)); setOffset((offset + count) % candidates.length);
  };
  return <section className="page container"><SectionTitle eyebrow="TRIP PICKER" title="오늘, 부산 어디가지?" description="현재 상황을 선택하면 부산 여행지 후보를 골라드립니다."/><form className="picker" onSubmit={recommend}><Choices title="1. 누구와 가나요?" name="companion" items={options.companion} value={form.companion} onChange={(v) => setForm({...form,companion:v})}/><Choices title="2. 어떤 여행인가요?" name="theme" items={options.theme} value={form.theme} onChange={(v) => setForm({...form,theme:v})}/><Choices title="3. 시간이 얼마나 있나요?" name="duration" items={options.duration} value={form.duration} onChange={(v) => setForm({...form,duration:v})}/><Choices title="4. 어떻게 이동하나요?" name="transport" items={options.transport} value={form.transport} onChange={(v) => setForm({...form,transport:v})}/><button className="button wide" disabled={loading}>나에게 맞는 여행지 추천</button><small>실제 이동시간은 상세 페이지의 위치정보에서 확인해 주세요.</small></form>{loading ? <Loading message="여행지를 고르는 중입니다."/> : error ? <ErrorMessage message={error} onRetry={recommend}/> : results.length ? <section className="recommend-results"><div className="result-head"><h2>추천 여행지 {results.length}곳</h2><button className="button outline" onClick={again}>다른 장소 추천</button></div><PlaceGrid places={results}/></section> : <EmptyState title="여행 조건을 선택하고 추천 버튼을 눌러보세요."/>}</section>;
}
