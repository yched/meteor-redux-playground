import Players from 'both/models/player';

// run fixtures if db is empty
Meteor.startup(function () {
  if (Players.find().count() === 0) {
    console.log("Running fixtures...");
    var names = [
      ["Ada Lovelace", "Grace Hopper", "Marie Curie",
        "Carl Friedrich Gauss", "Nikola Tesla", "Claude Shannon"],
      ["A", 'B', "C", "D"]
    ];
    for (let [listId, list] of names.entries()) {
      for (let [index, name] of list.entries()) {
        Players.insert({
          listId: listId + 1,
          name,
          index,
          score: Math.floor(Math.random() * 10) * 5
        });
      }
    };
  }
});
