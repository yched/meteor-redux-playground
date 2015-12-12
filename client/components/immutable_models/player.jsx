import { Record } from 'immutable';
import { PropTypes } from 'react';
import { recordOf } from 'react-immutable-proptypes'

// Immutable Record class for players
export const PlayerRecord = Record({
  _id: '',
  name: '',
  score: 0
});

// React proptype for our PlayerRecords
export const playerPropType = recordOf({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired
});
