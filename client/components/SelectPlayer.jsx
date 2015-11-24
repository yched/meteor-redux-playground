SelectPlayer = React.createClass({
  propTypes: {
    selectedName: React.PropTypes.string,
    doIncrementScore: React.PropTypes.func.isRequired
  },

  render() {
    if (this.props.selectedName) {
      return (
        <div className="details">
          <div className="name">{ this.props.selectedName }</div>
          <button className="inc" onClick={this.props.doIncrementScore.bind(null, 5)}>
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
