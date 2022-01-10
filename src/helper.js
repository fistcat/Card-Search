export function removeEmpty(obj) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v])
  );
}

export const saveToLocalStorage = ({ kid, hash, deckName }) => {
  let decks = localStorage.getItem("decks")
    ? JSON.parse(localStorage.getItem("decks"))
    : {};

  decks = {
    ...decks,
    [deckName]: {
      kid,
      hash,
      deckName,
    },
  };
  localStorage.setItem("decks", JSON.stringify(decks));
};

export const deleteFromLocalStorage = (deckName) => {
  let decks = localStorage.getItem("decks")
    ? JSON.parse(localStorage.getItem("decks"))
    : {};

  delete decks[deckName];
  localStorage.setItem("decks", JSON.stringify(decks));
};
