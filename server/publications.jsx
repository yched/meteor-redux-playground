import {Players} from '../both/models/player';

Meteor.publish('players', function() {
  var cursor = Players.find({}, {fields: {name: 1, score: 1, index: 1}});
  // simulate latency to show optimistic UI
  Meteor._sleepForMs(1000);
  return cursor;
});
