import React from "react";
import "./App.css";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { ListProvider } from "./ListContext";

function App() {
  return (
    <ListProvider>
      <Box>
        <Grid container>test</Grid>
      </Box>
    </ListProvider>
  );
}

export default App;
