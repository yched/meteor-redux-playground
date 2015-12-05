import {Players} from './player';

Meteor.methods({
  incrementScore(playerId, increment) {
    Players.update(playerId, {$inc: {score: increment + (Meteor.isClient ? 0 : 0)}});
    // Show optimistic delay
    if (Meteor.isServer) Meteor._sleepForMs(1000);
  },
  updateIndexes(data) {
    data.forEach(({_id, index}) => {
      Players.update(_id, {$set: {index}});
    });
  }
});
