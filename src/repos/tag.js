const 
  _ = require('lodash'),
  async = require('async'),
  mysql = require('promise-mysql'),
  model = require('../models/tag'),
  Promise = require('bluebird')
;

var _pool, _repository,
_delete, _getAll, _getByNameOrId, _update, _insert;

_delete = function _tag_delete(id) {
  var sql;

  sql = `
    UPDATE ubc.Tag
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
    UPDATE Tag
    SET
      name = ?,
      deleted = 0
    WHERE
      id = ?
  `;
  return new Promise((resolve, reject) => {
      _pool.query(sql, [model.name, model.id]).then((results) => {
          if(results.affectRows === 0) return reject("No records were changed");
          return resolve(model);
      }).catch(e => reject(e));
  });  
};

_insert = function _tag_insert(model) {
    var sql;
    sql = `INSERT INTO ubc.Tag
          (name, type)
          values
          (?, ?)`;
    return new Promise((resolve, reject) => {
      _pool.query(sql, [model.name, model.type]).then((results) => {
          if(results.affectRows === 0) return reject("No records were changed");
          if(!model.id) model.id = results.insertId;
          return resolve(model);
      }).catch(e => reject(e));
    });
};

_getByNameOrId = function _repository_getByNameOrId(crit = null) {
  var sql;
  sql = {
    id: `SELECT * FROM ubc.Tag WHERE id = ?`,
    name: `SELECT * FROM ubc.Tag WHERE name = ?`
  };
  return new Promise((resolve, reject) => {
    _pool.query(sql[_.isNumber(crit) ? 'id' : 'name'], [crit])
      .then(results => {
        console.log('one row', results);
        return resolve(model(_.first(results)));
      })
      .catch(e => reject(e));
  });
};

_getAll = function _repository_getAll() {
  var sql;
  sql = `SELECT * FROM ubc.Tag`;

  return new Promise((resolve, reject) => {
    _pool.query(sql)
      .then(function _repository_getAll_query(results) {
        return resolve(results);
      })
      .catch(e => reject(e));
  });
  
};

_repository = {
  save: function _repository_Save(model) {
    var isarg = arguments[1];
    return new Promise((resolve, reject) => {
        var crit = model.id > 0 ? model.id : model.name;
        _repository.getByNameOrId(crit)
          .then((data) => {
            console.log('tagd', data);
            if(data && data['id'] && data.id !== 0) {
              model.id = data.id;                      
              if(model.name === data.name) {
                  console.log('resolve data');
                  resolve(data);
                } else {
                  if(isarg)console.log('not equal');  
                  resolve(_update(model));                
                }
            } else {
              console.log('will insert');  
              resolve(_insert(model));            
            }
          })
          .catch((e) => { console.log(e); reject(e); });
    });
  },
  saveMany: function _repository_saveMany(names = []) {
    return new Promise(function (resolve, reject) {
      var result = [];
      async.each(names, (name, callback) => {
        _repository.save({name}, true)
          .then(d => {
            result.push(model(d));
            callback();
          })
          .catch(e => callback(e));
        },
        (err, re) => {
          if(err) return reject(err);
          resolve(result);
        }
      );
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