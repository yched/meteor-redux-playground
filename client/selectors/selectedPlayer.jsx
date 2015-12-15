import { createSelector } from 'reselect';

// From
// - the players
// - the selected player ID,
// return the selected player.
export default createSelector(
  (state) => state.playersCollection.get('players'),
  (state) => state.userInterface.get('selectedId'),
  (players, selectedId) => (selectedId && players.has(selectedId)) ? players.get(selectedId) : null
);
