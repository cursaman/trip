import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function SectionTitle({ eyebrow, title, description, link }) {
  return <div className="section-title"><div><span>{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>{link && <Link to={link}>전체 보기 →</Link>}</div>;
}

export function Loading({ message = "관광정보를 불러오는 중입니다." }) {
  return <div className="status"><i className="spinner"/><p>{message}</p></div>;
}

export function ErrorMessage({ message, onRetry }) {
  return <div className="status error" role="alert"><b>정보를 불러오지 못했습니다.</b><p>{message}</p>{onRetry && <button className="button" onClick={onRetry}>다시 시도</button>}</div>;
}

export function EmptyState({ title = "표시할 관광정보가 없습니다.", description, action }) {
  return <div className="status empty"><b>{title}</b>{description && <p>{description}</p>}{action}</div>;
}

export function SafeImage({ src, alt, className = "", fallback = "📍" }) {
  const [failed, setFailed] = useState(!src);
  useEffect(() => setFailed(!src), [src]);
  return failed
    ? <div className={`image-fallback ${className}`} role="img" aria-label={`${alt} 이미지 없음`}><span>{fallback}</span><small>이미지 없음</small></div>
    : <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
}
