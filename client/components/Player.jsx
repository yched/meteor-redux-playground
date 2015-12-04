import React from 'react';
import reactMixin from 'react-mixin';
import ReactRenderVisualizer from 'react-render-visualizer';
import { compose, pure, setPropTypes } from 'recompose';
import { map } from 'react-immutable-proptypes';

let PlayerItem = ({player, selected, selectPlayer}) => (
  <li className={ 'player' + (selected ? ' selected' : '') }
      onClick={ selectPlayer }>
    <span className="name">{ player.get('name') }</span>
    <span className="score">{ player.get('score') }</span>
  </li>
);

PlayerItem = compose(
  //pure,
  setPropTypes({
    player: map.isRequired,
    selected: React.PropTypes.bool,
    selectPlayer: React.PropTypes.func.isRequired
  })
)(PlayerItem);

//reactMixin(PlayerItem.prototype, ReactRenderVisualizer);

export default PlayerItem;
