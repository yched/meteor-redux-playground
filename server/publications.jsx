import Players from 'both/models/player';
import Lists from 'both/models/list';

Meteor.publishComposite('playersInList', listId => ({
  find: () => Lists.find(listId),
  children: [
    {
      find: (list) => Players.find({_id: {$in: list.players}})
    }
  ]
}));
