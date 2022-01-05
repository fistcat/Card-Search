import React, { useEffect } from "react";
import "./App.css";
import SearchForm from "./form/SearchForm";
import { CardList } from "./Card/CardList";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { ListProvider } from "./ListContext";

function App() {
  useEffect(() => {
    document.title = "萌卡社在线Lycee/WS中文组卡器";
  }, []);

  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://s23.cnzz.com/z_stat.php?id=1275943441&web_id=1275943441";

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <ListProvider>
      <Box>
        <Grid container>
          <Grid item xs={12} md={2}>
            <SearchForm />
          </Grid>
          <Grid item xs={12} md={10}>
            <CardList />
          </Grid>
        </Grid>
      </Box>
    </ListProvider>
  );
}

export default App;
