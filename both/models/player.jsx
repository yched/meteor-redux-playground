var exports = module.exports = {};

exports.Players = new Mongo.Collection("players");

exports.Player = {
  create() {
    // Players.insert(...)
  },
  update() {
    // Players.update(...)
  },
  destroy() {
    // Players.remove(...)
  },
  findLeaders() {
    return Players.find({}, { sort: { score: -1, name: 1 } }).fetch();
  }
};
