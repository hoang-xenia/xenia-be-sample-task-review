const usersRouter = require('./users');
const carsRouter = require('./cars');
const rentRouter = require('./rent');

module.exports = (app) => {
    usersRouter(app, 'users');
    carsRouter(app, 'cars');
    rentRouter(app, 'rent');
};
