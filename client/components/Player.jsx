PlayerItem = React.createClass({
  propTypes: {
    player: React.PropTypes.object.isRequired,
    selected: React.PropTypes.bool,
    doSelectPlayer: React.PropTypes.func.isRequired
  },

  render() {
    return (
      <li className={ 'player' + (this.props.selected ? ' selected' : '') }
          onClick={ this.props.doSelectPlayer }>
        <span className="name">{ this.props.player.name }</span>
        <span className="score">{ this.props.player.score }</span>
      </li>
    );
  }
});
