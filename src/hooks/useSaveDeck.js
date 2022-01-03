import { useState } from "react";
import axios from "axios";

export const useSaveDeck = () => {
  const [response, setResponse] = useState(undefined);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async (body) => {
    const bodyFromData = new FormData();

    body.deck = JSON.stringify(body.deck);
    for (let key in body) {
      bodyFromData.append(key, body[key]);
    }

    try {
      const result = await axios.post(
        "https://moetcg.club/Api/buildDeck",
        bodyFromData,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      setResponse(result.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return [fetchData, { response, error, loading }];
};

export default useSaveDeck;
