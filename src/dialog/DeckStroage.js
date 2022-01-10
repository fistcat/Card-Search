import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { DeleteOutline, FileUpload } from "@mui/icons-material";
import { deleteFromLocalStorage } from "../helper";
import { Box } from "@mui/system";

export const DeckStroage = ({ open, onClose, loadDeck }) => {
  const [decks, setDecks] = useState({});

  const handleDeckDelete = (deckName) => {
    deleteFromLocalStorage(deckName);
    setDecks((preDecks) => {
      const newDecks = { ...preDecks };
      delete newDecks[deckName];
      return newDecks;
    });
  };

  const handleExportTts = (hash) => {
    window.open(`https://moetcg.club/Api/outTts?id=${hash}`);
  };

  useEffect(() => {
    const localDecks = JSON.parse(localStorage.getItem("decks") ?? "{}");
    setDecks(localDecks);
  }, [open]);
  return (
    <div>
      <Drawer anchor={"left"} open={open} onClose={onClose}>
        <Container>
          <List>
            {Object.values(decks).map(({ hash, deckName }) => (
              <ListItem
                button
                key={hash + deckName}
                secondaryAction={
                  <Box sx={{ display: "flex" }}>
                    <IconButton
                      edge="end"
                      title="导出TTS"
                      aria-label="deleteDeck"
                      size="small"
                      onClick={() => handleExportTts(hash)}
                    >
                      <FileUpload color="primary" />
                    </IconButton>
                    <IconButton
                      edge="end"
                      title="删除卡组"
                      aria-label="deleteDeck"
                      size="small"
                      onClick={() => handleDeckDelete(deckName)}
                    >
                      <DeleteOutline color="error" />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  sx={{ pr: 5 }}
                  primary={deckName}
                  onClick={() => loadDeck(hash)}
                />
              </ListItem>
            ))}
          </List>
        </Container>
      </Drawer>
    </div>
  );
};
