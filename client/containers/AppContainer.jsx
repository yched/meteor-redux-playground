import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from 'client/store/actions';
import * as selectors from '../selectors/index';
import App from 'client/components/App';

// Connect to the redux store :
// Pick props that AppContainer receives from the store.
const mapStateToProps = (state) => ({
  playerView: state.playersCollection.get('viewName'),
  players: state.playersCollection.get('players'),
  // Use reselect selectors for derived data :
  selectedPlayer: selectors.selectedPlayer(state)
});
// Also pass all actions pre-bound to the store's dispatch() in props.actions,
// and the naked dispatch() itself for conveniency.
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  dispatch
});

@connect(mapStateToProps, mapDispatchToProps)
class AppContainer extends React.Component {
  render() {
    const appProps = {...this.props, listId: parseInt(this.props.params.listId)};
    return (
      <div className="outer">
        <App {...appProps} />
      </div>
    );
  }
}

export default AppContainer;
