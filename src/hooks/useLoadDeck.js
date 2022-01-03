import { useState } from "react";
import axios from "axios";

export const useLoadDeck = (setDeck, setTotal) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageRef, setImageRef] = useState([]);

  const fetchData = async (id) => {
    try {
      setLoading(true);
      const result = await axios.get("https://moetcg.club/Api/showDeck", {
        params: {
          id,
        },
      });
      if (result?.data?.data) {
        setDeck(() => {
          return result.data.data.reduce((acc, { code, num }) => {
            return {
              ...acc,
              [code]: num,
            };
          }, {});
        });
        setImageRef(() => {
          return result.data.data.map(({ code, img }) => ({
            code,
            img,
          }));
        });
        setTotal(() => result.data.data.reduce((acc, { num }) => acc + num, 0));
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return [fetchData, imageRef, loading];
};

export default useLoadDeck;
