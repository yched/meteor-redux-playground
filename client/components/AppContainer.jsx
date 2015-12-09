import React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Immutable from 'immutable';
import visualizeRender from 'react-render-visualizer-decorator';
import actions from '../store/actions'
import {Players} from '../../both/models/player';
import App from './app';

let AppContainer = React.createClass({
  mixins: [ReactMeteorData],

  // @todo Tourne à chaque changement des props ???
  getMeteorData() {
    Meteor.subscribe('players', this.props.sort.get('field'), this.props.sort.get('order'));

    // Fetch the new players from Mini-Mongo.
    // Apply the right sort.
    const sort = {[this.props.sort.get('field')]: this.props.sort.get('order')};
    // Do not grab the indexes, so that the immutables do not change needlessly.
    const fields = {index: 0}
    // Key players by id for easier tracking.
    const players = _.indexBy(Players.find({}, {sort, fields}).fetch(), '_id');

    return {
      players: this._immutablePlayers(players),
      selectedName: _.has(players, this.props.selectedId) ? players[this.props.selectedId].name : '',
    };
  },

  // Do our best to keep the existing players immutables unchanged.
  _immutablePlayers(players) {
    // On startup, create a fresh immutable.
    if (!this.data.players) {
      return Immutable.fromJS(players)
    }
    const ids = _.keys(players);
    // @todo use withMutations to reduce the instanciations ?
    return this.data.players
      // Remove players that are not in the new list
      .filter((player, id) => _.has(players, id))
      // Apply the same order than the new list
      .sortBy((player, id) => _.indexOf(ids, id))
      // Deep-merge the new data
      .mergeDeep(players)
  },

  incrementPlayerScore(playerId, increment) {
    Meteor.call('incrementScore', playerId, increment);
  },

  render() {
    return (
      <App {...this.props}
        players={this.data.players}
        selectedName={this.data.selectedName}
        incrementPlayerScore={this.incrementPlayerScore}
      />
    );
  }
});

let mapStateToProps = (state) => {
  return {
    selectedId: state.getIn(['userInterface', 'selectedId']),
    sort: state.getIn(['userInterface', 'sort'])
  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
