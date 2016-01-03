import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import * as Immutable from 'immutable';

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, _.isEqual)

// We separate "get the ordered array of player IDs to display" in a preliminary
// selector, so that our main selector can avoid recomputations and repaints when
// that list hasn't changed (e.g some player was reordered, but the current view
// is in 'by score' sorting --> no repaint is needed at all)

// From :
// - the collection of players
// - the list,
// - the sorting selected in the UI
// return the ordered array of player IDs to display.
const getSortedPlayerIds = createSelector(
  (state) => state.collections.players,
  (state, listId) => state.collections.lists.get(listId),
  (state) => state.userInterface.get('playerView'),
  (players, list, playerView) => {
    if (!list) {
      return [];
    }
    // Only keep player IDs that are present in the players collection.
    let ids = _.intersection(list.players, players.keySeq().toJS());
    // If soring by manual sort, the order form list.players is already correct.
    // If soring by player score, apply the correct order.
    if (playerView === 'by_score') {
      ids = _.sortBy(ids, id => -players.get(id).score);
    }

    return ids;
  }
);

// getSortedPlayerIds returns a new array each time, so wrap it in a selector
// that uses a memoization based on deep-equality.
const getSortedPlayerIds2 = createDeepEqualSelector(
  getSortedPlayerIds,
  sortedIds => sortedIds
);

// From :
// - the collection of players,
// - the ordered array of player IDs to display
// return the List of players to display
export default createSelector(
  (state) => state.collections.players,
  getSortedPlayerIds2,
  (players, sortedIds) => {
    console.log('recomputing getPlayersList');
    // Put the players indicated by sortedIds in a List.
    return sortedIds.reduce((list, id) => list.push(players.get(id)), new Immutable.List());
  }
);
