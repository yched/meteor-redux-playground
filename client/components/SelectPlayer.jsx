import React from 'react';
import { compose, pure, setPropTypes, defaultProps } from 'recompose';

let SelectPlayer = props => {
  if (props.selectedName) {
    return (
      <div className="details">
        <div className="name">{props.selectedName}</div>
        <button className="inc" onClick={props.incrementScore.bind(null, props.incrementLevel)}>
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

export default compose(
  //pure,
  setPropTypes({
    selectedName: React.PropTypes.string,
    incrementScore: React.PropTypes.func.isRequired,
    incrementLevel: React.PropTypes.number
  }),
  defaultProps({
    incrementLevel: 5
  })
)(SelectPlayer);;
