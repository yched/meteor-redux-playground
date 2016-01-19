import createLogger from 'redux-logger'

export default createLogger({
  duration: true,
  collapsed: true,
  logger: console,
  colors: Meteor.isClient,
});
