const Players = new Mongo.Collection("players");

// Expose predefined "views" on the collection - see https://www.discovermeteor.com/blog/query-constructors/
Players.views = {
  by_index: (limit = 10) => ({
    find: {},
    options: {sort: {index: 1}, limit}
  }),
  by_score: (limit = 10) => ({
    find: {},
    options: {sort: {score: -1}, limit}
  }),
};

export default Players;


