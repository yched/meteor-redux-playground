import {Players} from './player';

Meteor.methods({
  incrementScore(playerId, increment) {
    Players.update({_id: playerId}, {$inc: {score: increment + (Meteor.isClient ? 1 : 0)}});
    // Show
    if (Meteor.isServer) Meteor._sleepForMs(1000);
  }
});
