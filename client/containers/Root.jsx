if (process.env.NODE_ENV === 'production') {
  module.exports = require('./Root_prod');
} else {
  module.exports = require('./Root_dev');
}
