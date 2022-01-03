import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Alert, Box, Fab, LinearProgress, Typography } from "@mui/material";
import Card from "./Card";
import { useList } from "../ListContext";
import useCardSearch from "../hooks/useCardSearch";
import LayersOutlined from "@mui/icons-material/LayersOutlined";
import DeckEditor from "../dialog/DeckEditDialog";
import useLoadDeck from "../hooks/useLoadDeck";

export const CardList = () => {
  const qs = new URLSearchParams(window.location.search);
  const id = qs.get("id");

  const list = useList();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deck, setDeck] = useState({});
  const [open, setOpen] = useState(false);
  const { cards, hasMore, loading, error } = useCardSearch(list, page);
  const [loadDeck, imageRef, deckLoading] = useLoadDeck(setDeck, setTotal);

  const observer = useRef();

  const imageMap = useMemo(
    () =>
      [...cards, ...imageRef].reduce(
        (acc, { code, img }) => ({
          ...acc,
          [code]: img,
        }),
        {}
      ),
    [cards, imageRef]
  );

  useEffect(() => {
    setPage(1);
  }, [list]);

  useEffect(() => {
    if (id) {
      loadDeck(id);
      setOpen(true);
    }
  }, [id]);

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
      {error && <Alert severity="error">{error}</Alert>}
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
        deckLoading={deckLoading}
        imageMap={imageMap}
        onClose={() => setOpen(false)}
        setDeck={setDeck}
        setTotal={setTotal}
      />
    </>
  );
};
