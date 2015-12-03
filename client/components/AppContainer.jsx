import React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../store/actions'
import {Players} from '../../both/models/player';
import App from './app';

// AppContainer is responsible for fetching data from the store and
// listening for changes. In a larger app you would have a container
// for each major component.

let AppContainer = React.createClass({
  componentWillMount() {
    this.sub = Meteor.subscribe('players');
    trackCollection(Players, (collection) => {
      this.props.dispatch({
        type: 'UPDATE_PLAYERS',
      });
    });
  },

  componentWillUnmount() {
    this.sub.stop();
  },

  render() {
    return (<App {...this.props} />);
  }
});

// Use createSelector's memoization for the 'selectedName' derived data.
let selectedNameSelector = createSelector(
  (state => state.get('players')),
  (state => state.get('userInterface').get('selectedId')),
  (players, selectedId) => {
    let selectedPlayer = players.find(player => player.get('_id') === selectedId);
    return selectedPlayer ? selectedPlayer.get('name') : '';
  }
);
let mapStateToProps = (state) => {
  return {
    players: state.get('players'),
    selectedId: state.getIn(['userInterface', 'selectedId']),
    selectedName: selectedNameSelector(state)
  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
