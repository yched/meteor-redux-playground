import {Players} from './player';

Meteor.methods({
  incrementScore(playerId, increment) {
    Players.update(playerId, {$inc: {score: increment}});
  },
  updateIndexes(data) {
    data.forEach( ({_id, index}) => {
      Players.update(_id, {$set: {index}});
    });
  }
});
