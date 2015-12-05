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
    'DRAG_PLAYER': (players, {payload: {playerId, index}}) => {
      let playerIndex = players.find(player => player.get('_id') === playerId).get('index');
      console.log(playerIndex);
      let newPlayers = players.map(player => {
        if (player.get('_id') === playerId) {
          return player.set('index', index);
        }
        if (player.get('index') >= index && player.get('index') < playerIndex) {
          console.log('bumped ' + player.get('name'));
          return player.update('index', index => index + 1);
        }
        return player;
      }).sortBy(player => player.get('index'));

      //let newPlayers = players.slice(0, pos);
      //newPlayers = newPlayers.push(player.set('index', index));
      //newPlayers = newPlayers.concat(players.slice(pos + 1).map(player => player.update('index', index => index + 1)));
      newPlayers.forEach(player => console.log(player.get('index') + ' ' + player.get('name')));
      return newPlayers;
    }
  }),
  userInterface: createReducer(Immutable.fromJS({selectedId: ''}), {
    'SELECT_PLAYER': (userInterface, {payload: playerId}) => userInterface.merge({
      selectedId: playerId
    })
  })
}
