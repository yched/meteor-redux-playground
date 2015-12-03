import { map } from 'react-immutable-proptypes';
import { compose, pure, setPropTypes } from 'recompose';

const PlayerItem = ({player, selected, selectPlayer}) => (
  <li className={ 'player' + (selected ? ' selected' : '') }
      onClick={ selectPlayer }>
    <span className="name">{ player.get('name') }</span>
    <span className="score">{ player.get('score') }</span>
  </li>
);

export default compose(
  pure,
  setPropTypes({
    player: map.isRequired,
    selected: React.PropTypes.bool,
    selectPlayer: React.PropTypes.func.isRequired
  })
)(PlayerItem);
