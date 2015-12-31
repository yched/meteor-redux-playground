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
      return Immutable.List();
    }
    console.log('selector - list :', list.players);
    console.log('selector - players :', players.map(player => player.name).toJS());
    let playersList = players.filter(player => list.players.indexOf(player._id) !== -1).toList();
    switch (playerView) {
      case 'by_index':
        playersList = playersList.sortBy(player => list.players.indexOf(player._id));
        break;
      case 'by_score':
        playersList = playersList.sortBy(player => player.score)
        break;
    }
    console.log('selector - playersList :', playersList.map(player => player.name).toJS());
    return playersList;
  }
);
