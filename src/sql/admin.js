const _ = require('lodash'),
mysql = require('promise-mysql'),
Promise = require('bluebird')
;

var _login, _repository;

_login = function _admin_login(user, pass) {
  console.log('user', user);
  console.log('pass', pass);
  var sql;
  sql = `SELECT * FROM Accounts where username=? and password=sha1(?)`;

  return new Promise((resolve, reject) => {
    _pool.query(sql, [user, pass]).then(function _repository_getAll_query(results) {
      return resolve(results);
    }).catch(e => reject(e));
  });

}; 
_repository = {
  login: _login
};

module.exports = function _exports(pool, config) {
  _pool = pool;
  return _repository;
};
