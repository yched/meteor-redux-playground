import { Record } from 'immutable';
import { PropTypes } from 'react';
import { recordOf } from 'react-immutable-proptypes'

export const PlayerRecord = Record({
  _id: '',
  name: '',
  score: 0
});

export const playerPropType = recordOf({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired
});
