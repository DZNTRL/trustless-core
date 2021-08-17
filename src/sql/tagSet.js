const 
_ = require('lodash'),
async = require('async'),
mysql = require('promise-mysql'),
model = require('../models/tagSet'),
Promise = require('bluebird'),
tableName = 'TagSet';
;

var _pool, _repository,
_delete, _getAll, _getByNameOrId, _update, _insert;

_delete = function _tag_delete(id) {
var sql;

sql = `
  UPDATE ubc.${tableName}
  SET
    deleted = true
  WHERE
    id = ?
`;
return new Promise((resolve, reject) => {
    _pool.query(sql, id).then((results) => {
        if(results.affectRows === 0) return reject("No records were changed");
        return resolve(id);
    }).catch(e => reject(e));
});
};

_update = function _tag_update(model) {
  var sql;
  sql = `
    UPDATE ${tableName}
    SET
      name = ?,
      tags = ?,
      deleted = 0
    WHERE
      id = ?
  `;
  return new Promise((resolve, reject) => {
      _pool.query(sql, [model.name, model.tags, model.id]).then((results) => {
          if(results.affectRows === 0) return reject("No records were changed");
          return resolve(model);
      }).catch(e => reject(e));
  });  
};

_insert = function _tag_insert(model) {
  var sql;
  sql = `INSERT INTO ubc.${tableName}
        (name, tags)
        values
        (?, ?)`;
  return new Promise((resolve, reject) => {
    _pool.query(sql, [model.name, model.tags]).then((results) => {
        if(results.affectRows === 0) return reject("No records were changed");
        if(!model.id) model.id = results.insertId;
        return resolve(model);
    }).catch(e => reject(e));
  });
};

_getByNameOrId = function _repository_getByNameOrId(crit = null) {
var sql;
sql = {
  id: `SELECT * FROM ubc.${tableName} WHERE id = ?`,
  name: `SELECT * FROM ubc.${tableName} WHERE name = ?`
};

return new Promise((resolve, reject) => {
  _pool.query(sql[_.isNumber(crit) ? 'id' : 'name'], [crit]).then(function _repository_getByNameOrId_query(results) {
    return resolve(model(_.first(results)));
  }).catch(e => reject(e));
});
};

_getAll = function _repository_getAll() {
var sql;
sql = `SELECT * FROM ubc.${tableName}`;

return new Promise((resolve, reject) => {
  _pool.query(sql).then(function _repository_getAll_query(results) {
    return resolve(results);
  }).catch(e => reject(e));
});

};

_repository = {
save: function _repository_Save(model) {
  return new Promise((resolve, reject) => {
      _getByNameOrId(model.id > 0 ? model.id : model.name)
        .then((data)=> {
          if(data.id !== 0) {
            model.id = data.id;            
            resolve(_update(model));
          } else {
            resolve(_insert(model));            
          }          
        })
        .catch((e) => reject(e));
  });
},
getByNameOrId: _getByNameOrId,
getAll: _getAll,
delete: _delete,
getPool: function() { return _pool; }
};

module.exports = function _exports(pool) {
_pool = pool;
return _repository;
};