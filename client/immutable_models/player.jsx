import * as Immutable from 'immutable';
import { PropTypes } from 'react';
import { recordOf } from 'react-immutable-proptypes'

// Immutable Record class for players
export const PlayerRecord = Immutable.Record({
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

// Build an immutable map of PlayerRecords, trying to keep existing ones from an
// existing map when they still match.
export function getPlayerRecordMap(players, prev) {
  return Immutable.fromJS(players, (key, data) => {
    // Merge the new player data into the previous immutable if there is one,
    // else create a new record.
    if (key) {
      return (prev && prev.has(key)) ? prev.get(key).merge(data) : new PlayerRecord(data);
    }
    // The function is called one last time for the whole list, with key = ''.
    return data.toMap();
  })
}
