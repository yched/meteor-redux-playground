import Players from './player';
import Lists from './list';

Meteor.methods({
  incrementPlayerScore(playerId, increment) {
    //if (Meteor.isServer) Meteor._sleepForMs(3000);
    Players.update(playerId, {$inc: {score: increment}});
  },
  movePlayer(listId, playerId, newPosition) {
    //if (Meteor.isServer) Meteor._sleepForMs(3000);
    Lists.update(listId, {$pull: {players: playerId}});
    Lists.update(listId, {$push: {players: {$each: [playerId], $position: newPosition}}});
  }
});
