
module.exports = function (repository) {
  return {
    save: repository.save,
    getByNameOrId: function(crit) { return repository.getByNameOrId(crit); },
    getAll: repository.getAll,
    delete: repository.delete,
  }
};