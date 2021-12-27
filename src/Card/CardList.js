import React, { useRef, useState, useCallback, useEffect } from "react";
import { Box } from "@mui/material";
import Card from "./Card";
import { useList } from "../ListContext";
import useCardSearch from "../hooks/useCardSearch";
export const CardList = () => {
  const list = useList();
  const [page, setPage] = useState(1);

  const { cards, hasMore, loading, error } = useCardSearch(list, page);

  const observer = useRef();

  useEffect(() => {
    setPage(1);
  }, [list]);

  const lastCardElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        mx: "auto",
      }}
    >
      {cards.map(({ cid, code, name, img }, index) =>
        cards.length === index + 1 ? (
          <Card
            ref={lastCardElementRef}
            key={cid}
            code={code}
            name={name}
            img={img}
          />
        ) : (
          <Card key={cid} code={code} name={name} img={img} />
        )
      )}
    </Box>
  );
};
