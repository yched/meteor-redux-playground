import React from 'react';
import { decorate as reactMixin} from 'react-mixin';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'client/store/actions';
import Immutable from 'immutable';
import App from 'client/components/App';
import Players from 'both/models/player';
import Lists from 'both/models/list';

// Connect to the redux store :
// Pick props that AppContainer receives from the store.
const mapStateToProps = (state, props) => ({
  playerView: state.userInterface.get('playerView'),
  selectedId: state.userInterface.get('selectedId'),
  // Add the URL param passed by the router
  listId: props.params.listId,
  // Remote data
  remoteData: state.remoteData,
});
// Also pass all actions pre-bound to the store's dispatch() in props.actions,
// and the naked dispatch() itself for conveniency.
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  dispatch
});

@connect(mapStateToProps, mapDispatchToProps)
@reactMixin(ReactMeteorData)
class AppContainer extends React.Component {

  // NOTE: Tourne à chaque changement des props...
  getMeteorData() {
    Meteor.subscribe('playersInList', this.props.listId);

    // Fetch the collections data.
    let players, selectedPlayer;
    const list = Lists.findOne(this.props.listId);
    if (list) {
      players = Players.find({_id: {$in: list.players}}).fetch();

      // Key players by id for easier tracking.
      const playersById = _.indexBy(players, '_id');
      selectedPlayer = playersById[this.props.selectedId] ? playersById[this.props.selectedId] : null

      switch (this.props.playerView) {
        case 'by_index':
          players = _.sortBy(players, player => _.indexOf(list.players, player._id));
          break;
        case 'by_score':
          players = _.sortBy(players, player => -player.score);
          break;
      }
    }
    else {
      players = [];
      selectedPlayer = null;
    }
    return {
      players,
      selectedPlayer,
    };
  }

  render() {
    return (
      <App {...this.props}
        playersList={this.data.players}
        selectedPlayer={this.data.selectedPlayer} />
    );
  }

}

export default AppContainer;
