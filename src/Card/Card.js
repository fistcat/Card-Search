import React, { forwardRef } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions, Box } from "@mui/material";

const ActionCard = ({ cid, code, name, img }, ref) => {
  return (
    <Card
      sx={{
        maxWidth: {
          xs: "100%",
          sm: "50%",
          md: "50%",
          lg: "33.3%",
        },
        boxSizing: "border-box",
      }}
      ref={ref}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <CardActionArea>
            <img
              style={{ height: "max(20vmax,150px)" }}
              src={img}
              title="LO-3380_ネリア"
              alt=""
            />
          </CardActionArea>
          <CardActions>
            <Button size="small">Share</Button>
          </CardActions>
        </Box>

        <CardContent
          sx={{
            height: {
              md: "20vmax",
              sm: "25ch",
            },
          }}
        >
          <Typography gutterBottom variant="h5" component="div">
            {code}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica Lizards are
            a widespread group of squamate reptiles, with over 6,000 species,
            widespread group of squamate reptiles, with over 6,000 species,
            ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};
export default forwardRef(ActionCard);
