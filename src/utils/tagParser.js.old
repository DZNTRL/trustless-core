const _ = require('lodash');

module.exports = {
  processToStore: function(model, tags) {
    
  },
  processFromStore: function(model) {
    if(_.isArray(model.tags)) model.tags = model.tags.join(',');
  }
};