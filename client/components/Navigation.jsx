import React from 'react';
import { compose, pure, setPropTypes } from 'recompose';
import { Link } from 'react-router'

let Navigation = props => (
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
);

export default compose(
  pure,
  setPropTypes({
    listId: React.PropTypes.number
  })
)(Navigation);

