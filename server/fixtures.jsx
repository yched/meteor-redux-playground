import Players from 'both/models/player';
import Lists from 'both/models/list';

// run fixtures if db is empty
Meteor.startup(function () {
  if (Players.find().count() === 0) {
    console.log("Running fixtures...");
    let lists = [
      ["Ada Lovelace", "Grace Hopper", "Marie Curie",
        "Carl Friedrich Gauss", "Nikola Tesla", "Claude Shannon"],
      ["A", 'B', "C", "D"]
    ];
    let idCount = 0;
    for (let [listId, list] of lists.entries()) {
      let listItems = [];
      for (let name of list) {
        let playerId = 'player' + (++idCount);
        Players.insert({
          _id: playerId,
          name,
          score: Math.floor(Math.random() * 10) * 5
        });
        listItems.push(playerId);
      }
      Lists.insert({
        _id: 'list' + (listId + 1),
        players: listItems
      });
    };
  }
});
