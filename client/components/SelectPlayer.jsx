SelectPlayer = React.createClass({
  propTypes: {
    selectedName: React.PropTypes.string,
    selectedId: React.PropTypes.string,
  },

  render() {
    if (this.props.selectedPlayerName) {
      return (
        <div className="details">
          <div className="name">{ this.props.selectedPlayerName }</div>
          <button className="inc" onClick={() => this.props.incrementScore(this.props.selectedId)}>
            Add 5 points
          </button>
        </div>
      );
    }
    else {
      return (
        <div className="message">Click a player to select</div>
      );
    }
  }
});
