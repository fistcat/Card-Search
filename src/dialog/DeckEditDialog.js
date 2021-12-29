import React, { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Slide from "@mui/material/Slide";

import Card from "../Card/Card";

export default function DeckEditor(props) {
  const { deck, open, onClose, setDeck, setTotal } = props;

  const [particeDeck, setParticeDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const imageURLBase = "https://lycee-tcg.com/card/image/";
  const formattedDeck = useMemo(() => {
    const res = [];
    for (const card in deck) {
      for (let i = deck[card]; i > 0; i--) res.push(card);
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
          <Button autoFocus color="inherit" onClick={onClose}>
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
          flexGrow: 0,
        }}
      >
        {Object.entries(deck).map(([code, count]) => (
          <Card
            key={code}
            imgSize={"31ch"}
            showEffect={false}
            code={code}
            count={count}
            setDeck={setDeck}
            setTotal={setTotal}
            img={imageURLBase + code + ".png"}
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
        {hand.map((code, index) => (
          <Card
            key={code + index}
            imgSize={"20ch"}
            showEffect={false}
            code={code}
            setDeck={setDeck}
            setTotal={setTotal}
            img={imageURLBase + code + ".png"}
          />
        ))}
      </DialogContent>
    </Dialog>
  );
}
