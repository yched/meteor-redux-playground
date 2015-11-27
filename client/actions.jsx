const {createAction} = ReduxActions;

Actions = {
  incrementScore: createAction('INCREMENT_SCORE', (...args) => ({playerId: args[0], increment: args[1]})),
  selectPlayer: createAction('SELECT_PLAYER', playerId => playerId),
}
