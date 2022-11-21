const Post = require('./post');

module.exports = (app, path) => {
    app.post(`/${path}`, (req, res) => new Post(req, res));
};