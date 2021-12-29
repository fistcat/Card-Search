import React, { useState, useEffect, useRef } from "react";
import useSearchForm from "../hooks/useSearchForm";
import { useListUpdate } from "../ListContext";
import {
  Alert,
  Container,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useDebouncedEffect } from "../hooks/useDebouncedEffect";

const SearchForm = () => {
  const columnKeys = useSearchForm({
    method: "get",
    url: "/getKindColumn",
    params: {
      kid: 9,
    },
  });
  const updateCards = useListUpdate();
  const isFormLoaded = useRef(false);
  const [values, setValues] = useState({});
  const [formKeys, setFormKeys] = useState();

  useEffect(() => {
    if (columnKeys.response !== undefined) {
      setFormKeys(() => setFormKeys(columnKeys.response.data));
      setValues(() =>
        columnKeys.response.data.reduce(
          (acc, { key }) => ({
            ...acc,
            [key]: "",
          }),
          {}
        )
      );
    }
  }, [columnKeys.response]);

  const handleChange = (prop) => (event) => {
    setValues((values) => ({
      ...values,
      [prop]: event.target.value,
    }));
    isFormLoaded.current = true;
  };

  useDebouncedEffect(
    () => {
      console.log(isFormLoaded.current);
      if (isFormLoaded.current) {
        updateCards(values);
      }
    },
    [values],
    2000
  );

  return (
    <Container
      sx={{
        mt: "auto",
        display: "flex",
        position: "sticky",
        top: "0",
        alignItems: "center",
      }}
    >
      {columnKeys.loading ? (
        <p>loading...</p>
      ) : columnKeys.error ? (
        <Alert severity="error"> Error occurred on fetching form details</Alert>
      ) : (
        <form>
          {formKeys?.map(({ label, key, type, options }) =>
            options ? (
              <Box
                key={key}
                sx={{
                  display: "inline-block",
                  pr: 2,
                  minWidth: "8ch",
                  alignSelf: "center",
                }}
              >
                <InputLabel>{label}</InputLabel>
                <Select
                  key={key}
                  label={label}
                  defaultValue=""
                  variant="standard"
                  value={values[key]}
                  fullWidth
                  onChange={handleChange(key)}
                  size="small"
                  sx={{
                    textOverflow: "ellipsis",
                  }}
                >
                  <MenuItem key={key + " "} value="">
                    -
                  </MenuItem>
                  {options?.map(({ label, value }) => (
                    <MenuItem key={key + value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            ) : (
              <TextField
                sx={{
                  mb: 1,
                }}
                key={key}
                label={label}
                variant="standard"
                type={type}
                value={values[key]}
                onChange={handleChange(key)}
                fullWidth
                size="small"
              />
            )
          )}
        </form>
      )}
    </Container>
  );
};

export default SearchForm;
