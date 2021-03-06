import React from 'react';
import { visualizeRender } from 'client/helpers/react_helpers';
import { compose, pure, setPropTypes } from 'recompose';
import ImmutableModels from 'client/immutable_models';

let PlayerItem = ({player, isSelected, selectPlayer}) => (
  <li className={ 'player' + (isSelected ? ' selected' : '') }
      onClick={ () => selectPlayer(player._id) }>
    <span className="name">{ player.name }</span>
    <span className="score">{ player.score }</span>
  </li>
);

PlayerItem = compose(
  //visualizeRender,
  pure,
  setPropTypes({
    player: ImmutableModels.player.propType.isRequired,
    isSelected: React.PropTypes.bool,
    selectPlayer: React.PropTypes.func.isRequired
  })
)(PlayerItem);

export default PlayerItem;
