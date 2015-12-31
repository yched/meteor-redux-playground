import { createSelector } from 'reselect';
import * as Immutable from 'immutable';

// From
// - the players
// - the selected player ID,
// return the selected player.

export default createSelector(
  (state) => state.collections.players,
  (state, listId) => state.collections.lists.get(listId),
  (state) => state.userInterface.get('playerView'),
  (players, list, playerView) => {
    if (!list) {
      return Immutable.Map();
    }
    let map = players.filter(player => list.get('players').indexOf(player.get('_id') !== -1));
    switch (playerView) {
      case 'by_index':
        return map.sortBy(player => list.get('players').indexOf(player.get('_id')));
        //list.get('players').forEach(playerId => {
        //  if (players.has(playerId)) {
        //    map = map.set(playerId, players.get(playerId))
        //  }
        //});
        //return map;
      case 'by_score':
        return map.sortBy(player => player.score)
    }
  }
);
