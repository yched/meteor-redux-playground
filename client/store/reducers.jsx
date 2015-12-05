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
    'DRAG_PLAYER': (players, {payload: {dragIndex, hoverIndex}}) => {
      return players
        .splice(dragIndex, 1)
        .splice(hoverIndex, 0, players.get(dragIndex))
        .map( (player, index) => player.set('index', index));
    }
  }),
  userInterface: createReducer(Immutable.fromJS({selectedId: ''}), {
    'SELECT_PLAYER': (userInterface, {payload: playerId}) => userInterface.merge({
      selectedId: playerId
    })
  })
}
