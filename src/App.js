import "./App.css";
import SearchForm from "./form/SearchForm";
import { CardList } from "./Card/CardList";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { ListProvider } from "./ListContext";

function App() {
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
