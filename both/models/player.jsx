const Players = new Mongo.Collection("players");

// Expose predefined "views" on the collection
// @see https://www.discovermeteor.com/blog/query-constructors/
Players.views = {
  by_index: (limit = 10) => ({
    find: {},
    options: {sort: {index: 1}, limit}
  }),
  by_score: (limit = 10) => ({
    find: {},
    options: {sort: {score: -1}, limit}
  })
};
// Wrapper for Players.find() to build the query for a view name.
Players.getCursor = function (viewName) {
  const view = this.views[viewName]();
  return this.find(view.find, view.options);
};

export default Players;


