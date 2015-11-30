const {createAction} = ReduxActions;

export default {
  incrementScore: createAction('INCREMENT_SCORE', (...[playerId, increment]) => ({playerId, increment})),
  selectPlayer: createAction('SELECT_PLAYER', playerId => playerId),
}