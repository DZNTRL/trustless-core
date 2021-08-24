const 
  _ = require('lodash'),
  mysql = require('promise-mysql'),
  model = require('../models/content'),
  Promise = require('bluebird'),
  sqlStatments = {},
  tagParser = require('../utils').tagParser
;

var _pool, _repository,
_delete, _getAll, _getByNameOrId, _getByTags, _linkTags, _unlinkTags, _update, _insert;

_delete = function _content_delete(id) {
  var sql;
  sql = `
    UPDATE ubc.Content
    SET
      deleted = true
    WHERE
      id = ?
  `;
  return new Promise((resolve, reject) => {
    _unlinkTags(id)
      .then(() => {
          _pool.query(sql, id)
            .then((results) => {
              if(results.affectRows === 0) return reject("No records were changed");
              return resolve(id);
            })
            .catch(e => reject(e));
      })
      .catch(e => reject(e))
  });  


};

_update = function _content_update(model) {
  var sql;

  sql = `
    UPDATE ubc.Content
    SET
      title = ?,
      slug = ?,
      content = ?,
      published = ?,
      modified = NOW(),
      deleted = false,
      tags = ?
    WHERE
      id = ?
  `;
  return new Promise((resolve, reject) => {
      _pool.query(sql, [model.title, model.slug, model.content, model.published, model.tags, model.id])
        .then((results) => {
            if(results.affectRows === 0) return reject("No records were changed");
              _linkTags(model.id, model.tags.split(','))
                .then(() => resolve(model))
                .catch(e => reject(e));     
        })
        .catch(e => reject(e));
  });  
};

_insert = function _content_insert(model) {
    var sql;
    sql = `INSERT INTO ubc.Content 
            (title, slug, published, content, markupType, tags) 
            values(?, ?, ?, ?, ?, ?)`;
            
    return new Promise((resolve, reject) => {
      _pool.query(sql, [model.title, model.slug, model.published, model.content, model.markupType, model.tags]).then((results) => {
          if(results.affectRows === 0) return reject("No records were changed");
          if(!model.id) model.id = results.insertId;
          _linkTags(model.id, model.tags.split(',')).then(() => resolve(model));
      }).catch(e => reject(e));
    });
};

_linkTags = function _content_linkTags(contentId, tagNames) {
    var params, sql;
    sql = [`
      INSERT INTO ubc.TagContent
      (contentId, tagId)
      VALUES 
    `];

    _.each(tagNames, (tagid) => sql.push(`(?,(SELECT id from Tag where name = ?)), `));
    sql[sql.length-1] = sql[sql.length - 1].replace(', ', '');
    params = [];
    _.each(tagNames, (tag) => params.push(contentId, tag) );
    return new Promise((resolve, reject) => {
      _unlinkTags(contentId)
        .then(() => {
          _pool.query(sql.join(''), params)
            .then((results) => {
              if(results.affectRows === 0) return reject("No records were changed");
              if(!model.id) model.id = results.insertId;
              return resolve(model);
            })
            .catch(e => reject(e));
        })
        .catch((e) => reject(e));
    });
};

_unlinkTags = function _content_unlinkTags(contentId, tagIds = []) {
    var params, sql;
    params = [];
    if(tagIds.length !== 0) {
      sql = [`
        DELETE ubc.TagContent
        WHERE
          contentId = ?
        AND
          tagId in (
      `];
      _.each(tagIds, (tagid) => sql.push(`?, `));
      sql[sql.length-1] = sql[sql.length - 1].replace(', ', '');
      sql.push(');');
      params.push(contentId);
      params = _.map(tagIds, (tagId) => sql.push(tagId));
    } else {
      sql = [`
        DELETE from ubc.TagContent
        WHERE
          contentId = ?
      `];
      params = [contentId];      
    }

    return new Promise((resolve, reject) => {
      _pool.query(sql.join(''), params)
        .then(results => {
            if(results.affectRows === 0) return reject("No records were changed");
            return resolve(model);
        })
        .catch(e => reject(e));
    });

};


_getByNameOrId = function _repository_getByNameOrId(crit = null) {
  var sql;
  sql = {
    id: `SELECT * FROM ubc.Content WHERE id = ?`,
    slug: `SELECT * FROM ubc.Content WHERE slug = ?`
  };

  return new Promise((resolve, reject) => {
    _pool.query(sql[_.isNumber(crit) ? 'id' : 'slug'], [crit])
      .then(result => {
        var result = model(_.first(result));
        tagParser.processFromStore(result);
        resolve(result);
      })
      .catch(e => {
        reject(e);
      });
  });
};

_getByTags = function _repository_getByTags(tags = []) {
  var params, sql, tagParamPlaceholders;

  tagParamPlaceholders = [];
  params = [];
  _.each(tags, (tag) => {
    params.push(tag);
    tagParamPlaceholders.push('?');
  });
  sql = `
    SELECT
      c.id,
      c.title,
      c.slug,
      c.published,
      c.markupType,
      c.created,
      c.modified,
      IFNULL(c.tldr, SUBSTR(c.content, 0, 100)) as tldr,
      c.tags,
      c.primaryImage
    FROM
      Content c
    INNER JOIN TagContent tc
      on tc.contentId = c.id
    INNER JOIN Tag t
      on tc.tagId = t.id
    WHERE
      t.name in (${tagParamPlaceholders.join(',')})
  `;
  return new Promise((resolve, reject) => {
    if(tags.length === 0) return reject('Please provide a list of tags');
    _pool.query(sql, params)
      .then(data => {
        tagParser.processFromStore(data);
        var result = _.chain(data).uniqBy('id').map(m => model(m)).value();
        resolve(_.isArray(result) ? result : [result]);
      })
      .catch(e => {
        reject(e);
      });
  });
};


_getAll = function _repository_getAll() {
  var sql;
  sql = `SELECT * FROM ubc.Content where deleted = false`;

  return new Promise((resolve, reject) => {
    _pool.query(sql).then(function _repository_getAll_query(results) {
      return resolve(results);
    }).catch(e => reject(e));
  });
  
};

_repository = {
  save: function _repository_Save(model) {
    return new Promise((resolve, reject) => {
      if(!model.id) {
        resolve(_insert(model));
      } else {
        _getByNameOrId(model.id)
        .then((data)=> {          
          if(data.id) return resolve(_update(model));
          resolve(_insert(model));
        })
        .catch((e) => reject(e));
      }

    });
  },
  getByNameOrId: _getByNameOrId,
  getByTags: _getByTags,
  getAll: _getAll,
  delete: _delete,
  getPool: function() { return _pool; },
  linkTags: _linkTags,
  unlinkTags: _unlinkTags
};

module.exports = function _exports(pool, config) {
  _pool = pool;
  return _repository;
};