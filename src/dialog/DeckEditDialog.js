import React, { useMemo, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import CopyIcon from "@mui/icons-material/FileCopyOutlined";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";

import Card from "../Card/Card";
import useSaveDeck from "../hooks/useSaveDeck";
import { Alert, Snackbar, TextField } from "@mui/material";

export default function DeckEditor(props) {
  const qs = new URLSearchParams(window.location.search);
  const kid = qs.get("kid") || 9;

  const { deck, deckLoading, open, onClose, setDeck, setTotal, cardMap } =
    props;

  const [particeDeck, setParticeDeck] = useState([]);
  const [deckLoaded, setDeckLoaded] = useState(false);
  const [hand, setHand] = useState([]);
  const [deckName, setDeckName] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [saveDeck, { response, error, loading }] = useSaveDeck();
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

  const handleSaveDeck = () => {
    saveDeck({
      deck: { ...deck },
      deckName,
      kid,
    });
    setDeckLoaded(true);
  };

  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  const handleClose = () => {
    setDeckLoaded(false);
    onClose();
  };

  useEffect(() => {
    if (!error && response) {
      setOpenAlert(true);
    }
  }, [loading, response, error]);

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            卡组编辑
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSaveDeck}>
            <Typography variant="h6" component="div">
              保存
            </Typography>
            <SaveAltOutlinedIcon sx={{ pl: 1 }} />
          </Button>
        </Toolbar>
      </AppBar>
      {response?.data?.hash && deckLoaded && (
        <Alert severity="success" sx={{ justifyContent: "center" }}>
          卡组分享地址为{" "}
          {window.location.origin +
            window.location.pathname +
            "?id=" +
            response.data.hash +
            "&kid=" +
            response.data.kid}
          <IconButton
            color="success"
            aria-label="copy address"
            sx={{ p: 0 }}
            onClick={() => {
              navigator.clipboard.writeText(
                window.location.origin +
                  window.location.pathname +
                  "?id=" +
                  response.data.hash +
                  "&kid=" +
                  response.data.kid
              );
            }}
          >
            <CopyIcon />
          </IconButton>
        </Alert>
      )}
      <TextField
        label="输入卡组名称"
        id="deckName"
        variant="filled"
        size="small"
        onChange={(e) => setDeckName(e.target.value)}
      />

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
          alignItems: "center",
          flexGrow: 0,
        }}
      >
        {deckLoading ? (
          <CircularProgress sx={{ mx: "auto" }} />
        ) : (
          Object.entries(deck).map(([code, count]) => (
            <Card
              key={code}
              imgSize={"32ch"}
              showEffect={false}
              code={code}
              count={count}
              setDeck={setDeck}
              setTotal={setTotal}
              cardInfo={cardMap[code]}
            />
          ))
        )}
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
            disabled={true}
            showEffect={false}
            code={code}
            setDeck={setDeck}
            setTotal={setTotal}
            cardInfo={cardMap[code]}
          />
        ))}
      </DialogContent>
      {response && (
        <Snackbar open={openAlert} onClose={handleAlertClose}>
          {response.code === 1 ? (
            <Alert onClose={handleAlertClose} severity="success">
              卡组成功保存!
            </Alert>
          ) : (
            <Alert
              onClose={handleAlertClose}
              severity={response.data.hash ? "warning" : "error"}
            >
              {response.msg}
            </Alert>
          )}
        </Snackbar>
      )}
    </Dialog>
  );
}
