SelectPlayer = React.createClass({
  propTypes: {
    selectedName: React.PropTypes.string,
    incrementScore: React.PropTypes.func.isRequired,
    incrementLevel: React.PropTypes.number
  },
  getDefaultProps: () => ({
    incrementLevel: 5
  }),

  render() {
    if (this.props.selectedName) {
      return (
        <div className="details">
          <div className="name">{ this.props.selectedName }</div>
          <button className="inc" onClick={this.props.incrementScore.bind(null, this.props.incrementLevel)}>
            Add {this.props.incrementLevel} points
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
