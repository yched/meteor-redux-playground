import Players from './player';
import Lists from './list';

Meteor.methods({
  incrementPlayerScore(playerId, increment) {
    //if (Meteor.isServer) Meteor._sleepForMs(3000);
    Players.update(playerId, {$inc: {score: increment}});
  },
  movePlayer(listId, playerId, newPosition) {
    //if (Meteor.isServer) Meteor._sleepForMs(3000);
    const list = Lists.findOne(listId);
    // @todo Si quelqu'un d'autre fait une action de add / remove / move à ce
    // moment, elle sera perdue.
    if (list) {
      list.players.splice(newPosition, 0, playerId);
      Lists.update(listId, {players: list.players});
    }
  }
});
