import { createReducer } from 'redux-immutablejs';
import * as Immutable from 'immutable';
import { Players } from '../../both/models/player';

console.log(Immutable);
export default {
  players: createReducer(Immutable.fromJS([]), {
    'INCREMENT_SCORE': (players, {payload: {playerId, increment}}) => {
      Meteor.call('incrementScore', playerId, increment);
      return players;
    },
    'UPDATE_PLAYERS': () => {
      return Immutable.fromJS(Players.find({}, {sort: {index: 1}}).fetch());
      //return Immutable.fromJS(Players.find({}, {sort: {score: -1}}).fetch());
    },
    'DRAG_PLAYER': (players, {payload: {playerId, newIndex}}) => {
      const [prevIndex, player] = players.findEntry(player => player.get('_id') === playerId);
      return players
        // Remove the player from its previous index.
        .delete(prevIndex)
        // Insert it at the new index.
        .splice(newIndex, 0, player)
        // Recompute indexes.
        .map((player, index) => player.set('index', index));
    },
    'DROP_PLAYER': (players) => {
      // Call 'updateIndexes' with the array of {_id, index} pairs.
      let data = [];
      players.forEach(player => {
        data.push({_id: player.get('_id'), index: player.get('index')});
      });
      Meteor.call('updateIndexes', data);
      return players;
    }
  }),
  userInterface: createReducer(Immutable.fromJS({selectedId: ''}), {
    'SELECT_PLAYER': (userInterface, {payload: playerId}) => userInterface.merge({
      selectedId: playerId
    })
  })
}
