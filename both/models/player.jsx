const Players = new Mongo.Collection("players");

// Expose predefined "views" on the collection
// @see https://www.discovermeteor.com/blog/query-constructors/
Players.views = {
  by_index: ({listId, limit = 10}) => ({
    find: {listId: parseInt(listId)},
    options: {sort: {index: 1}, limit}
  }),
  by_score: ({listId, limit = 10}) => ({
    find: {listId: parseInt(listId)},
    options: {sort: {score: -1}, limit}
  })
};
// Wrapper for Players.find() to build the query for a view name.
Players.findByView = function (viewName, params) {
  const view = this.views[viewName](params);
  return this.find(view.find, view.options);
};

export default Players;


