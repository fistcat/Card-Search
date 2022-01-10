import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  Alert,
  Backdrop,
  Box,
  Fab,
  LinearProgress,
  Typography,
} from "@mui/material";
import Card from "./Card";
import { useList } from "../ListContext";
import useCardSearch from "../hooks/useCardSearch";
import LayersOutlined from "@mui/icons-material/LayersOutlined";
import ListIcon from "@mui/icons-material/ListOutlined";
import DeckEditor from "../dialog/DeckEditDialog";
import { DeckStroage } from "../dialog/DeckStroage";
import useLoadDeck from "../hooks/useLoadDeck";

export const CardList = () => {
  const qs = new URLSearchParams(window.location.search);
  const id = qs.get("id");

  const list = useList();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deck, setDeck] = useState({});
  const [openDeckEditor, setOpenDeckEditor] = useState(false);
  const [openDeckStore, setOpenDeckStore] = useState(false);
  const cardRefs = useRef({});
  const { cards, hasMore, loading, error } = useCardSearch(list, page);
  const [loadDeck, loadedRef, deckLoading] = useLoadDeck(setDeck, setTotal);

  const observer = useRef();

  const cardMap = useMemo(() => {
    return [...loadedRef, ...cards].reduce(
      (acc, { code, img, effect, name, cid }) => ({
        ...acc,
        [code]: {
          code,
          cid,
          img,
          effect,
          name,
        },
      }),
      {}
    );
  }, [cards, loadedRef]);

  useEffect(() => {
    setPage(1);
  }, [list]);

  useEffect(() => {
    if (id) {
      loadDeck(id);
      setOpenDeckEditor(true);
    }
  }, [id]);

  useEffect(() => {
    cardRefs.current = {
      ...[...loadedRef, ...cards].reduce(
        (acc, { code, img, effect, name, cid }) =>
          acc[code]
            ? acc
            : {
                ...acc,
                [code]: {
                  code,
                  cid,
                  img,
                  effect,
                  name,
                },
              },
        cardRefs.current
      ),
    };
  }, [loadedRef, cards]);

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
      <Backdrop
        open={deckLoading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      />
      {cards.length > 0 ? (
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
                cardInfo={cardMap[code]}
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
                cardInfo={cardMap[code]}
                setDeck={setDeck}
                setTotal={setTotal}
              />
            )
          )}
        </Box>
      ) : (
        !loading && <Alert severity="warning">没有对应的搜索结果</Alert>
      )}
      {loading && <LinearProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {total > 0 && (
        <Fab
          color="secondary"
          aria-label="edit"
          sx={{ position: "fixed", top: "90vh", right: "0vw" }}
          variant="extended"
          onClick={() => setOpenDeckEditor(true)}
        >
          <LayersOutlined />
          {total > 0 && <Typography>{total}</Typography>}
        </Fab>
      )}
      <DeckEditor
        open={openDeckEditor}
        deck={deck}
        deckLoading={deckLoading}
        cardMap={cardRefs.current}
        onClose={() => setOpenDeckEditor(false)}
        setDeck={setDeck}
        setTotal={setTotal}
      />
      {localStorage.getItem("decks") && (
        <Fab
          color="primary"
          aria-label="edit"
          sx={{ position: "fixed", top: "0vh", right: "0vw" }}
          variant="extended"
          onClick={() => setOpenDeckStore(true)}
        >
          <ListIcon />
        </Fab>
      )}
      <DeckStroage
        open={openDeckStore}
        onClose={() => setOpenDeckStore(false)}
        loadDeck={loadDeck}
      />
    </>
  );
};
