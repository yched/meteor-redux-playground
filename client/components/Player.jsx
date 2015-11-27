PlayerItem = props => (
  <li className={ 'player' + (props.selected ? ' selected' : '') }
      onClick={ props.selectPlayer }>
    <span className="name">{ props.player.name }</span>
    <span className="score">{ props.player.score }</span>
  </li>
);
PlayerItem.propTypes = {
  player: React.PropTypes.object.isRequired,
  selected: React.PropTypes.bool,
  selectPlayer: React.PropTypes.func.isRequired
};
