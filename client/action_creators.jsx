const {createAction} = ReduxActions;

Actions = {
  incrementScore: createAction('INCREMENT_SCORE', ([playerId, increment]) => ({playerId, increment})),
  selectPlayer: createAction('SELECT_PLAYER', playerId => playerId),
}
