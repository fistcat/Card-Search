import React, { useRef, useState, useCallback, useEffect } from "react";
import { Box, Fab, Typography } from "@mui/material";
import Card from "./Card";
import { useList } from "../ListContext";
import useCardSearch from "../hooks/useCardSearch";
import LayersOutlined from "@mui/icons-material/LayersOutlined";

export const CardList = () => {
  const list = useList();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deck, setDeck] = useState({});
  const [open, setOpen] = useState(false);
  const { cards, hasMore, loading, error } = useCardSearch(list, page);

  const observer = useRef();

  useEffect(() => {
    setPage(1);
  }, [list]);

  useEffect(() => {
    console.log(deck, total);
  }, [deck, total]);

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
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          mx: "auto",
        }}
      >
        {cards.map(({ code, ...card }, index) =>
          cards.length === index + 1 ? (
            <Card
              {...card}
              ref={lastCardElementRef}
              code={code}
              key={code}
              count={deck[code]}
              setDeck={setDeck}
              setTotal={setTotal}
            />
          ) : (
            <Card
              key={code}
              code={code}
              count={deck[code]}
              {...card}
              setDeck={setDeck}
              setTotal={setTotal}
            />
          )
        )}
      </Box>
      <Fab
        color="secondary"
        aria-label="edit"
        sx={{ position: "fixed", top: "90vh", left: "90vw", mr: 1 }}
        variant="extended"
      >
        <LayersOutlined />
        <Typography>（{total}）</Typography>
      </Fab>
    </>
  );
};
