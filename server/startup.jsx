import {Players} from '../both/models/player';

console.log("Starting Leaderboard Server...");

// run fixtures if db is empty
Meteor.startup(function () {
  if (Players.find().count() === 0) {
    console.log("Running fixtures...");
    var names = ["Ada Lovelace", "Grace Hopper", "Marie Curie",
      "Carl Friedrich Gauss", "Nikola Tesla", "Claude Shannon"];
    for (let [index, name] of names.entries()) {
      Players.insert({
        name: name,
        score: Math.floor(Math.random() * 10) * 5,
        index
      });
    };
  }
});
