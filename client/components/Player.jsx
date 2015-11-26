PlayerItem = React.createClass({
  propTypes: {
    player: React.PropTypes.object.isRequired,
    selected: React.PropTypes.bool,
    selectPlayer: React.PropTypes.func.isRequired
  },

  render() {
    return (
      <li className={ 'player' + (this.props.selected ? ' selected' : '') }
          onClick={ this.props.selectPlayer }>
        <span className="name">{ this.props.player.name }</span>
        <span className="score">{ this.props.player.score }</span>
      </li>
    );
  }
});
