import React from 'react';
import { compose, pure, setPropTypes, defaultProps } from 'recompose';
import { visualizeRender } from '../react_helpers';

let SelectPlayer = props => {
  if (props.selectedName) {
    return (
      <div className="details">
        <div className="name">{props.selectedName}</div>
        <button className="inc" onClick={ () => props.incrementScore(props.selectedId, props.incrementLevel) }>
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
    selectedName: React.PropTypes.string,
    selectedId: React.PropTypes.string,
    incrementScore: React.PropTypes.func.isRequired,
    incrementLevel: React.PropTypes.number
  }),
  defaultProps({
    incrementLevel: 5
  })
)(SelectPlayer);

export default SelectPlayer
