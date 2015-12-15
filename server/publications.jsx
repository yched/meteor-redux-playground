import Players from 'both/models/player';

Meteor.publish('players', function(viewName, params) {
  // Wrapper for Players.find() - see both/models/player.jsx
  return Players.getCursor(viewName, params);
});
