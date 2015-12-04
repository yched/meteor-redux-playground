import React from 'react';
import { visualizeRender } from '../react_helpers';
import { compose, pure, setPropTypes } from 'recompose';
import { map } from 'react-immutable-proptypes';

let PlayerItem = ({player, selected, selectPlayer}) => (
  <li className={ 'player' + (selected ? ' selected' : '') }
      onClick={ () => selectPlayer(player.get('_id')) }>
    <span className="name">{ player.get('name') }</span>
    <span className="score">{ player.get('score') }</span>
  </li>
);

PlayerItem = compose(
  visualizeRender,
  pure,
  setPropTypes({
    player: map.isRequired,
    selected: React.PropTypes.bool,
    selectPlayer: React.PropTypes.func.isRequired
  })
)(PlayerItem);

export default PlayerItem;
