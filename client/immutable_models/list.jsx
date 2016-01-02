import * as Immutable from 'immutable';
import { PropTypes } from 'react';
import { recordOf } from 'react-immutable-proptypes'

export default {
  // Immutable Record class for players
  record: Immutable.Record({
    _id: '',
    players: [],
  }),
  // React proptype for our records
  propType: recordOf({
    _id: PropTypes.string.isRequired,
    players: PropTypes.array.isRequired
  })
}
