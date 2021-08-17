const _ = require('lodash');
var tagService;

module.exports = function (repository) {  
  var result, tags;
  result = {
    save: function(model) {
      var strTags, toSave;
      return new Promise((resolve, reject) => {
        strTags = model.tags;
        tagService.saveMany(model.tags.split(','))
        .then(dbTags => {
          repository.save(model)
            .then(() => {
              model.tags = strTags;
              resolve(model);
            }) 
            .catch(e => reject(e))
          });
        });
    },
    getByNameOrId: function(crit) { 
      return new Promise((resolve, reject) => {
        repository.getByNameOrId(crit)
          .then(model => { 
            resolve(model);
          })
          .catch(e => reject(e)); 
      });
    },
    getAll: repository.getAll,
    getByTags: repository.getByTags,
    delete: repository.delete
  };
  // init service
  (() => {  
    if(!repository.getPool()) return;
    tagService = require('./tag')(require('../sql/tag')(repository.getPool()));
    tagService.getAll().then(_tags => {
      tags = _tags;
    });
  })();


  return result;
};