import { createSelector } from 'reselect';
import * as Immutable from 'immutable';

// From :
// - the players
// - the list,
// - the selected sorting
// return the ordered list of players to display

export default createSelector(
  (state) => state.collections.players,
  (state, listId) => state.collections.lists.get(listId),
  (state) => state.userInterface.get('playerView'),
  (players, list, playerView) => {
    if (!list) {
      return Immutable.List();
    }
    //console.log('selector - list :', list.players);

    // Only keep players that are on the list.
    let playersList = players.filter((player, playerId) => list.players.includes(playerId)).toList();
    // Sort them by the intended order.
    switch (playerView) {
      case 'by_index':
        playersList = playersList.sortBy(player => list.players.indexOf(player._id));
        break;
      case 'by_score':
        playersList = playersList.sortBy(player => - player.score);
        break;
    }
    //console.log('selector - playersList :', playersList.map(player => player.name).toJS());
    return playersList;
  }
);
