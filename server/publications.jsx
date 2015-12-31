import Players from 'both/models/player';
import Lists from 'both/models/list';

Meteor.publishComposite('playersInList', listId => ({
  find: () => Lists.find(listId),
  children: [
    {
      find: (list) => {
        console.log(Players.find({_id: {$in: list.players}}).fetch().map(player => player.name));
        return Players.find({_id: {$in: list.players}})
      }
    }
  ]
}));
