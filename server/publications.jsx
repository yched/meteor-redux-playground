import {Players} from '../both/models/player';

Meteor.publish('players', function(sortField) {
  let sort = {};
  sort[sortField] = 1;
  var cursor = Players.find({}, {fields: {name: 1, score: 1, index: 1}, sort});
  // simulate latency to show optimistic UI
  Meteor._sleepForMs(1000);
  return cursor;
});
