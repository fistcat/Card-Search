import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Box, Fab, LinearProgress, Typography } from "@mui/material";
import Card from "./Card";
import { useList } from "../ListContext";
import useCardSearch from "../hooks/useCardSearch";
import LayersOutlined from "@mui/icons-material/LayersOutlined";
import DeckEditor from "../dialog/DeckEditDialog";

export const CardList = () => {
  const list = useList();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deck, setDeck] = useState({});
  const [open, setOpen] = useState(false);
  const { cards, hasMore, loading, error } = useCardSearch(list, page);

  const observer = useRef();

  const imageMap = useMemo(
    () =>
      cards.reduce(
        (acc, { code, img }) => ({
          ...acc,
          [code]: img,
        }),
        {}
      ),
    [cards]
  );

  useEffect(() => {
    setPage(1);
  }, [list]);
  console.log(imageMap);
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
          backgroundColor: "#f7f7f7",
        }}
      >
        {cards.map(({ code, ...card }, index) =>
          cards.length === index + 1 ? (
            <Card
              {...card}
              ref={lastCardElementRef}
              code={code}
              key={code}
              showEffect={true}
              count={deck[code]}
              img={imageMap[code]}
              setDeck={setDeck}
              setTotal={setTotal}
            />
          ) : (
            <Card
              {...card}
              key={code}
              showEffect={true}
              code={code}
              count={deck[code]}
              img={imageMap[code]}
              setDeck={setDeck}
              setTotal={setTotal}
            />
          )
        )}
      </Box>
      {loading && <LinearProgress />}

      {total > 0 && (
        <Fab
          color="secondary"
          aria-label="edit"
          sx={{ position: "fixed", top: "90vh", left: "80vw", mr: 1 }}
          variant="extended"
          onClick={() => setOpen(true)}
        >
          <LayersOutlined />
          {total > 0 && <Typography>{total}</Typography>}
        </Fab>
      )}

      <DeckEditor
        open={open}
        deck={deck}
        imageMap={imageMap}
        onClose={() => setOpen(false)}
        setDeck={setDeck}
        setTotal={setTotal}
      />
    </>
  );
};
