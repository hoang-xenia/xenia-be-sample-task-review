const postgresql = require('./utils/postgresql');
const server = require('./utils/server');
const logger = require('./utils/logger');
const router = require('./src');

postgresql.connect()
    .then(() => {
        logger.info('Postgresql connect succeeded');
        router(server.createAPI(8081));
    })
    .catch((err) => {
        logger.info(`Postgresql connect failed with error ${err}`);
        process.exit(1);
    });