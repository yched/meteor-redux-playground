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
    let sort = {};
    sort[this.props.sort.get('field')] = this.props.sort.get('order');
    let players = Players.find({}, {sort, fields: {index: 0}}).fetch();

    // Pour optimiser les immutables, on fait un mergeDeep sur l'état précédent,
    // ce qui garantit que les "players" non modifiés restent identiques.
    // @todo En recevant une update de Meteor suite à drag-drop d'un autre utilisateur, on repeint quand même
    // toute la tranche entre "ancienne position" et "nouvelle position" du bloc, c'est pas optimal.
    let immutablePlayers = this.data.players ?
      this.data.players.mergeDeep(players).slice(0, players.length) :
      Immutable.fromJS(players);

    let selectedPlayer = Players.findOne(this.props.selectedId);

    return {
      players: immutablePlayers,
      selectedName: selectedPlayer ? selectedPlayer.name : '',
    };
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
