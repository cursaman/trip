import { useCallback, useEffect, useState } from "react";

export default function useLoad(fetcher, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const run = useCallback(async () => {
    setLoading(true); setError("");
    try { setData(await fetcher()); }
    catch (error) { setError(error.message || "요청에 실패했습니다."); }
    finally { setLoading(false); }
  }, [fetcher, ...dependencies]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { run(); }, [run]);
  return { data, loading, error, retry: run };
}
