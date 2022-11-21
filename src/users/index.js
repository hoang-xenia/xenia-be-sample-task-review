const Get = require('./get');
const GetById = require('./getById');
const Post = require('./post');
const Put = require('./put');
const Delete = require('./delete');

module.exports = (app, path) => {
    app.get(`/${path}`, (req, res) => new Get(req, res));
    app.get(`/${path}/:id`, (req, res) => new GetById(req, res));
    app.post(`/${path}`, (req, res) => new Post(req, res));
    app.put(`/${path}`, (req, res) => new Put(req, res));
    app.delete(`/${path}/:id`, (req, res) => new Delete(req, res));
};