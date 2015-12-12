import Players from './player';

Meteor.methods({
  incrementPlayerScore(playerId, increment) {
    //if (Meteor.isServer) Meteor._sleepForMs(3000);
    Players.update(playerId, {$inc: {score: increment}});
  },
  updatePlayerIndexes(indexesById) {
    //if (Meteor.isServer) Meteor._sleepForMs(3000);
    indexesById.forEach( ({_id, index}) => {
      Players.update(_id, {$set: {index}});
    });
  }
});
