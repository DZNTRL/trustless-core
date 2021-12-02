const _ = require('lodash');
var result;

result = {
  admin: require('./admin'),
  content: function content_service(repository) { 
    var result = require('./content')(repository);
    result.save = result.save;
    return result;
  },
  tag: require('./tag'),
  tagSet: require('./tagSet')
};

module.exports = result;