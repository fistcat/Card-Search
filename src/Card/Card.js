import React, { forwardRef } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, Box, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddBoxIcon from "@mui/icons-material/AddBox";

const ActionCard = (
  { code, name, img, effect, count, setDeck, setTotal },
  ref
) => {
  const handleCardAdded = () => {
    setDeck((preDeck) =>
      code in preDeck
        ? {
            ...preDeck,
            [code]: ++preDeck[code],
          }
        : {
            ...preDeck,
            [code]: 1,
          }
    );
    setTotal((preTotal) => ++preTotal);
  };

  const handleCardRemoved = () => {
    if (count > 1) {
      setDeck((preDeck) => ({
        ...preDeck,
        [code]: --preDeck[code],
      }));
      setTotal((preTotal) => --preTotal);
    }
    if (count === 1) {
      setDeck((preDeck) => {
        delete preDeck[code];
        return { ...preDeck };
      });
      setTotal((preTotal) => --preTotal);
    }
  };

  return (
    <Card
      sx={{
        width: {
          xs: "100%",
          sm: "50%",
          md: "50%",
          lg: "33.3%",
        },
        boxSizing: "border-box",
        flexGrow: 1,
      }}
      ref={ref}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "space-between",
        }}
      >
        <Box>
          <CardActionArea onClick={handleCardAdded}>
            <img
              style={{ height: "max(20vmax,150px)" }}
              loading="lazy"
              src={img}
              title={code}
              alt={name}
            />
          </CardActionArea>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            {count && (
              <>
                <IconButton
                  aria-label="add"
                  onClick={handleCardAdded}
                  size="large"
                  sx={{ p: 0 }}
                >
                  <AddBoxIcon color="primary" fontSize="inherit" />
                </IconButton>
                <Typography color="secondary" variant="h6">
                  {count}
                </Typography>
                <IconButton
                  aria-label="remove"
                  onClick={handleCardRemoved}
                  size="large"
                  sx={{ p: 0 }}
                >
                  <RemoveCircleOutlineIcon color="error" fontSize="inherit" />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
        <CardContent
          sx={{
            height: {
              md: "20vmax",
              sm: "25ch",
            },
          }}
        >
          <Typography gutterBottom variant="h6" component="div">
            {name}
          </Typography>
          {effect.split("|").map((text) => (
            <Typography variant="body3" color="text.secondary" component="div">
              {text}
            </Typography>
          ))}
        </CardContent>
      </Box>
    </Card>
  );
};
export default forwardRef(ActionCard);
