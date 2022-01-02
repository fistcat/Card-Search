import { useEffect, useState } from "react";
import axios from "axios";

export default function useCardSearch(query, page) {
  const qs = new URLSearchParams(window.location.search);
  const kid = qs.get("kid") || 9;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cards, setCards] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const filteredParams = Object.fromEntries(
    Object.entries(query).filter(([_, v]) => v !== "")
  );

  useEffect(() => {
    setCards([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: "https://moetcg.club/Api/search",
      params: {
        ...filteredParams,
        page,
        kid,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setCards((prevCards) => {
          return [...prevCards, ...res.data.data];
        });
        setHasMore(+res.data.pageInfo.total > cards.length);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page]);

  return { loading, error, cards, hasMore };
}
