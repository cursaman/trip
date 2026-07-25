import { useCallback } from "react";
import { Link } from "react-router-dom";
import { getFestivals, getPlaces } from "../api/tourApi";
import FestivalCard from "../components/FestivalCard";
import { PlaceGrid } from "../components/PlaceCard";
import { ErrorMessage, Loading, SectionTitle } from "../components/UI";
import { apiDate } from "../utils/date";
import { normalizePlaces } from "../utils/place";
import useLoad from "../hooks/useLoad";

export default function Home() {
  const fetcher = useCallback(async () => {
    const results = await Promise.allSettled([
      getPlaces({ contentTypeId: "12", numOfRows: 8 }),
      getFestivals({ startDate: apiDate(new Date()), numOfRows: 6 }),
    ]);
    const places = results[0].status === "fulfilled" ? normalizePlaces(results[0].value.items) : [];
    const festivals = results[1].status === "fulfilled" ? normalizePlaces(results[1].value.items) : [];
    if (!places.length && !festivals.length) throw new Error("메인 관광정보를 불러오지 못했습니다.");
    return { places, festivals };
  }, []);
  const { data, loading, error, retry } = useLoad(fetcher);

  if (loading) return <Loading message="부산 여행정보를 준비하고 있습니다."/>;
  if (error) return <div className="page container"><ErrorMessage message={error} onRetry={retry}/></div>;
  const hero = data.places.find((place) => place.image) || data.places[0];

  return (
    <>
      <section className="hero" style={hero?.image ? { backgroundImage: `linear-gradient(90deg,rgba(3,34,52,.94),rgba(3,34,52,.35)),url("${hero.image}")` } : undefined}>
        <div className="container hero-inner"><div><span className="eyebrow">DISCOVER BUSAN</span><h1>오늘,<br/>부산 어디로 떠날까요?</h1><p>부산 관광지를 탐색하고 나에게 맞는 여행 코스를 만들어 보세요.</p><div className="button-row"><Link className="button light" to="/places">관광지 둘러보기</Link><Link className="button outline-light" to="/recommend">여행 추천받기</Link></div></div>{hero && <Link className="hero-pick" to={`/place/${hero.contentId}?type=${hero.contentTypeId}`}><small>오늘의 추천 여행지</small><strong>{hero.title}</strong><span>{hero.address}</span></Link>}</div>
      </section>
      <div className="home-sections">
        <section className="section container"><SectionTitle eyebrow="PLACES" title="부산 관광지" description="최근 이미지가 등록된 부산 여행지를 만나보세요." link="/places"/><PlaceGrid places={data.places}/></section>
        <section className="section festival-bg"><div className="container"><SectionTitle eyebrow="FESTIVALS" title="부산에서 열리는 축제" link="/festivals"/>{data.festivals.length ? <div className="festival-grid">{data.festivals.map((item) => <FestivalCard key={item.contentId} festival={item}/>)}</div> : <p>현재 예정된 축제가 없습니다.</p>}</div></section>
        <section className="themes section container"><SectionTitle eyebrow="THEMES" title="테마별 부산 여행"/><div className="theme-grid">{[["🌊","바다 여행","12"],["🎨","문화와 전시","14"],["🍽️","부산 맛집","39"],["🚲","체험과 레포츠","28"]].map(([icon,title,type]) => <Link key={title} to={`/places?type=${type}`}><i>{icon}</i><h3>{title}</h3><span>둘러보기 →</span></Link>)}</div></section>
        <section className="cta"><div className="container"><div><span className="eyebrow">TRIP PICKER</span><h2>어디로 갈지 결정하지 못했나요?</h2><p>동행자와 테마, 시간을 선택하면 여행지를 골라드립니다.</p></div><Link className="button light" to="/recommend">추천 시작하기</Link></div></section>
      </div>
    </>
  );
}
