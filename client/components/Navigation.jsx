import React from 'react';
import { pure, setPropTypes } from 'recompose';
import { Link } from 'react-router'

@pure
@setPropTypes({
  listId: React.PropTypes.number,
})
class Navigation extends React.Component {
  render() {
    const props = this.props;
    return (
      <ul>
        {[1, 2].map(listId => (
          <li key={listId}>
            {props.listId && listId === props.listId ?
              <div>List {listId}</div> :
              <Link to={`/list/${listId}`}>List {listId}</Link>
            }
          </li>
        ))}
      </ul>
    )
  }
}

export default Navigation;

