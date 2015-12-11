import Players from 'both/models/player';

Meteor.publish('players', function(viewName, ...params) {
  const view = Players.views[viewName](...params);
  return Players.find(view.find, {fields: {name: 1, score: 1, index: 1}, ...view.options});
});
