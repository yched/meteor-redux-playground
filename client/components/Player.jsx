PlayerItem = React.createClass({
  handleClick() {
    this.props.selectPlayer(this.props.player._id);
  },

  getClassName() {
    return this.props.selected ? 'player selected' : 'player';
  },

  render() {
    var player = this.props.player;
    return (
      <li className={ this.getClassName() } onClick={ () => this.props.selectPlayer(this.props.player._id) }>
        <span className="name">{ player.name }</span>
        <span className="score">{ player.score }</span>
      </li>
    );
  }
});
