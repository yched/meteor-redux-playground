import React from 'react';
import { compose, pure, setPropTypes, defaultProps } from 'recompose';
import { visualizeRender } from 'client/helpers/react_helpers';
import ImmutableModels from 'client/immutable_models';

let SelectPlayer = props => {
  if (props.selectedPlayer) {
    return (
      <div className="details">
        <div className="name">{props.selectedPlayer.name}</div>
        <button className="inc" onClick={ () => props.incrementPlayerScore(props.selectedPlayer._id, props.incrementLevel) }>
          Add {props.incrementLevel} points
        </button>
      </div>
    );
  }
  else {
    return (
      <div className="message">Click a player to select</div>
    );
  }
};

SelectPlayer = compose(
  //visualizeRender,
  pure,
  setPropTypes({
    selectedPlayer: ImmutableModels.player.propType,
    incrementPlayerScore: React.PropTypes.func.isRequired,
    incrementLevel: React.PropTypes.number
  }),
  defaultProps({
    incrementLevel: 5
  })
)(SelectPlayer);

export default SelectPlayer
