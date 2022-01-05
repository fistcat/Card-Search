import React, { forwardRef, memo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grow from "@mui/material/Grow";
import { CardActionArea, Box, IconButton, Tooltip } from "@mui/material";
import RemoveOutline from "@mui/icons-material/RemoveOutlined";
import AddOutlined from "@mui/icons-material/AddOutlined";
import Delete from "@mui/icons-material/Delete";

const ActionCard = (props, ref) => {
  const {
    code,
    disabled,
    cardInfo,
    imgSize,
    count,
    setDeck,
    setTotal,
    showEffect,
  } = props;

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
    }
    if (count === 1) {
      setDeck((preDeck) => {
        delete preDeck[code];
        return { ...preDeck };
      });
    }
    setTotal((preTotal) => --preTotal);
  };

  const handleCardDeleted = () => {
    setDeck((preDeck) => {
      delete preDeck[code];
      return { ...preDeck };
    });
    setTotal((preTotal) => (preTotal -= count));
  };

  return (
    <Grow in appear>
      <Card
        sx={{
          maxWidth: {
            xs: "100%",
            sm: "50%",
            md: "50%",
            lg: "33.3%",
          },
          boxSizing: "border-box",
          borderRadius: "5%",
          backgroundColor: "#fefefe",
        }}
        ref={ref}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "space-between",
            justifyContent: "center",
          }}
        >
          <Box>
            <Tooltip title={!showEffect ? cardInfo?.effect : ""} arrow>
              <CardActionArea
                onClick={disabled ? () => ({}) : handleCardAdded}
                sx={{
                  transition: "all .2s ease-in-out",
                  ":hover": { transform: "scale(1.05)" },
                }}
              >
                <img
                  style={{
                    height: imgSize || "max(20vmax,150px)",
                  }}
                  loading="lazy"
                  src={cardInfo.img}
                  title={code}
                  alt={code}
                />
              </CardActionArea>
            </Tooltip>

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
                    <AddOutlined fontSize="inherit" />
                  </IconButton>
                  <Typography color="secondary" variant="h6" pl="10px">
                    {count}
                  </Typography>
                  <Box>
                    <IconButton
                      aria-label="remove"
                      onClick={handleCardRemoved}
                      size="large"
                      sx={{ p: 0 }}
                    >
                      <RemoveOutline fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={handleCardDeleted}
                      size="large"
                      sx={{ p: 0 }}
                    >
                      <Delete fontSize="inherit" />
                    </IconButton>
                  </Box>
                </>
              )}
            </Box>
          </Box>
          {showEffect && (
            <CardContent
              sx={{
                height: {
                  md: "20vmax",
                  sm: "25ch",
                },
              }}
            >
              <Typography gutterBottom variant="h6" component="div">
                {cardInfo.name}
              </Typography>
              {cardInfo?.effect ? (
                cardInfo.effect.split("|").map((text, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    color="text.secondary"
                    component="div"
                  >
                    {text}
                  </Typography>
                ))
              ) : (
                <Typography
                  key={cardInfo.name + "unfouned"}
                  variant="body5"
                  color="primary"
                  component="div"
                >
                  由于未知的原因，无法获取翻译效果。请找后端大佬解决！
                </Typography>
              )}
            </CardContent>
          )}
        </Box>
      </Card>
    </Grow>
  );
};
export default memo(forwardRef(ActionCard));
