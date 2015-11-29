PlayerItem = ({player, selected, selectPlayer}) => (
  <li className={ 'player' + (selected ? ' selected' : '') }
      onClick={ selectPlayer }>
    <span className="name">{ player.get('name') }</span>
    <span className="score">{ player.get('score') }</span>
  </li>
);
PlayerItem.propTypes = {
  player: ImmutablePropTypes.map.isRequired,
  selected: React.PropTypes.bool,
  selectPlayer: React.PropTypes.func.isRequired
};
