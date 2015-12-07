import React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Immutable from 'immutable';
import visualizeRender from 'react-render-visualizer-decorator';
import actions from '../store/actions'
import {Players} from '../../both/models/player';
import App from './app';

//@visualizeRender
let AppContainer = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    Meteor.subscribe('players', this.props.sort.get('field'), this.props.sort.get('order'));
    let sort = {};
    sort[this.props.sort.get('field')] = this.props.sort.get('order');
    let players = Players.find({}, {sort}).fetch();

    let selectedPlayer = Players.findOne(this.props.selectedId);

    return {
      players: Immutable.fromJS(players),
      selectedName: selectedPlayer ? selectedPlayer.name : '',
    };
  },

  dragPlayer(playerId, newIndex) {
    const [prevIndex, player] = this.data.players.findEntry(player => player.get('_id') === playerId);
    this.data.players = this.data.players
      // Remove the player from its previous index.
      .delete(prevIndex)
      // Insert it at the new index.
      .splice(newIndex, 0, player)
      // Recompute indexes.
      .map((player, index) => player.set('index', index));
  },

  dropPlayer() {
    // Call 'updateIndexes' with the array of {_id, index} pairs.
    let data = [];
    this.data.players.forEach(player => {
      data.push({_id: player.get('_id'), index: player.get('index')});
    });
    Meteor.call('updateIndexes', data);
  },

  render() {
    return (
      <App {...this.props}
        players={this.data.players}
        selectedName={this.data.selectedName}
        dragPlayer={this.dragPlayer}
        dropPlayer={this.dropPlayer} />
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
