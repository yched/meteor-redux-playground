import React from 'react';
import { visualizeRender } from '../react_helpers';
import { compose, pure, setPropTypes } from 'recompose';
import { playerPropType } from './immutable_models/player';

let PlayerItem = ({player, selected, selectPlayer}) => (
  <li className={ 'player' + (selected ? ' selected' : '') }
      onClick={ () => selectPlayer(player._id) }>
    <span className="name">{ player.name }</span>
    <span className="score">{ player.score }</span>
  </li>
);

PlayerItem = compose(
  visualizeRender,
  pure,
  setPropTypes({
    player: playerPropType.isRequired,
    selected: React.PropTypes.bool,
    selectPlayer: React.PropTypes.func.isRequired
  })
)(PlayerItem);

export default PlayerItem;
