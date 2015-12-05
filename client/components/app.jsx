import React from 'react';
import { compose, pure, setPropTypes } from 'recompose';
import { listOf, map } from 'react-immutable-proptypes';
import PlayerList from './PlayerList';
import SelectPlayer from './SelectPlayer';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const App = props => (
  <div className="outer">
    <div className="logo"></div>
    <h1 className="title">Leaderboard</h1>
    <div className="subtitle">Select a scientist to give them points</div>


    <input type="radio" name="sorting" value="index" defaultChecked={props.sort === 'index'} onClick={() => props.actions.setSorting('index')} />
    Manual sort
    <input type="radio" name="sorting" value="score" defaultChecked={props.sort === 'score'} onClick={() => props.actions.setSorting('score')} />
    Sort by scores

    <div>
      <PlayerList players={props.players}
                  selectedId={props.selectedId}
                  selectPlayer={props.actions.selectPlayer}
                  dragPlayer={props.actions.dragPlayer}
                  dropPlayer={props.actions.dropPlayer} />
    </div>

    <SelectPlayer selectedName={props.selectedName}
                  selectedId = {props.selectedId}
                  incrementScore={props.actions.incrementScore} />

  </div>
);

export default DragDropContext(HTML5Backend)(compose(
  pure,
  setPropTypes({
    players: listOf(map).isRequired,
    selectedId: React.PropTypes.string.isRequired,
    selectedName: React.PropTypes.string.isRequired,

    actions: React.PropTypes.shape({
      selectPlayer: React.PropTypes.func.isRequired,
      incrementScore: React.PropTypes.func.isRequired,
    }).isRequired
  })
)(App));

