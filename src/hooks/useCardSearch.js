import { useEffect, useState } from "react";
import axios from "axios";

export default function useCardSearch(query, page) {
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
        kid: 9,
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
  }, [query, page]);

  return { loading, error, cards, hasMore };
}
