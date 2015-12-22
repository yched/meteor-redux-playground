import Players from 'both/models/player';

Meteor.publish('players', function(viewName, params) {
  //Meteor._sleepForMs(3000);
  // Wrapper for Players.find() - see both/models/player.jsx
  return Players.findByView(viewName, params);
});
