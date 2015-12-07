import {Players} from '../both/models/player';

Meteor.publish('players', function(sortField, sortOrder) {
  let sort = {};
  sort[sortField] = sortOrder;
  var cursor = Players.find({}, {fields: {name: 1, score: 1, index: 1}, sort});
  return cursor;
});
