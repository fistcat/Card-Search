import React, { useMemo, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import Card from "../Card/Card";
import useSaveDeck from "../hooks/useSaveDeck";
import { Alert, Snackbar } from "@mui/material";

export default function DeckEditor(props) {
  const qs = new URLSearchParams(window.location.search);
  const kid = qs.get("kid") || 9;
  const { deck, open, onClose, setDeck, setTotal } = props;

  const [particeDeck, setParticeDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [saveDeck, { response, error, loading }] = useSaveDeck();

  const formattedDeck = useMemo(() => {
    const res = [];
    for (const card in deck) {
      for (let i = deck[card].count; i > 0; i--) res.push(deck[card]);
    }
    return res;
  }, [deck]);

  const shuffle = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
    return deck;
  };

  const draw = (num = 1, newDeck, newhand) => {
    const currentDeck = newDeck || particeDeck;
    const cardDraw = num > currentDeck.length ? currentDeck.length : num;
    const cards = currentDeck.slice(0, cardDraw);
    setHand((preHand) => [...(newhand || preHand), ...cards]);
    setParticeDeck((preParticeDevk) => [
      ...(newDeck || preParticeDevk).slice(cardDraw),
    ]);
  };

  const handleInitialDraw = () => {
    draw(7, shuffle([...formattedDeck]), []);
  };

  const handleDeleteDeck = () => {
    setDeck({});
    setTotal(0);
  };

  const handleSaveDeck = () => {
    saveDeck({
      deck: { ...deck },
      kid,
    });
  };

  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  useEffect(() => {
    if (!error) {
      setOpenAlert(true);
    }
  }, [loading, response, error]);

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            卡组编辑
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSaveDeck}>
            保存
          </Button>
        </Toolbar>
      </AppBar>
      <Divider sx={{ alignItems: "flex-start", pt: 2 }}>
        <Button
          variant="outlined"
          onClick={handleDeleteDeck}
          color="error"
          startIcon={<DeleteForeverIcon />}
        >
          删除卡组 {formattedDeck.length}
        </Button>
      </Divider>
      <DialogContent
        sx={{
          display: "flex",
          flexWrap: "wrap",
          mx: "auto",
          minWidth: "40%",
          minHeight: "35ch",
          flexGrow: 0,
        }}
      >
        {Object.entries(deck).map(([code, { count, img }]) => (
          <Card
            key={code}
            imgSize={"31ch"}
            showEffect={false}
            code={code}
            count={count}
            setDeck={setDeck}
            setTotal={setTotal}
            img={img}
          />
        ))}
      </DialogContent>
      <Divider sx={{ alignItems: "flex-start" }}>
        <Button variant="contained" onClick={handleInitialDraw} sx={{ mr: 1 }}>
          起始手牌
        </Button>
        <Button variant="outlined" onClick={() => draw()} sx={{ pr: 1 }}>
          抽牌！
        </Button>
      </Divider>
      <DialogContent
        sx={{
          display: "flex",
          flexWrap: "wrap",
          mx: "auto",
          minWidth: "40%",
          flexGrow: 0,
        }}
      >
        {hand.map(({ code, img }, index) => (
          <Card
            key={code + index}
            imgSize={"20ch"}
            showEffect={false}
            code={code}
            setDeck={setDeck}
            setTotal={setTotal}
            img={img}
          />
        ))}
      </DialogContent>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          卡组成功保存!
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
