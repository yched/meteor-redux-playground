import * as Immutable from 'immutable';
import { PropTypes } from 'react';
import { recordOf } from 'react-immutable-proptypes'

export default {
  // Immutable Record class for players
  record: Immutable.Record({
    _id: '',
    name: '',
    score: 0
  }),
  // React proptype for our records
  propType: recordOf({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired
  })
}
