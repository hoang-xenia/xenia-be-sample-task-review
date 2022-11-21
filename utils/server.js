const restana = require('restana');
const bodyParser = require('body-parser');
const queryParser = require('connect-query');
const helmet = require('helmet');
const compression = require('compression');
const noSniff = require('dont-sniff-mimetype');

const parser = require('ua-parser-js');

const logger = require('./logger');

const enableCompression = true;

const packageLimit = '100mb';
const packageLimitFile = '500mb';
const rawBodySaver = (req, res, buf, encoding) => {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
};

const createAPI = (port) => {
    try {
        // set up the restana application
        const app = restana({
            ignoreTrailingSlash: true,
            maxParamLength: 2083,
            defaultRoute(req, res) {
                if (req.method === 'OPTIONS') {
                    return res.send(204);
                }
                return res.send(404);
            },
            errorHandler(err, req, res) {
                logger.error(`Something was wrong: ${err.message || err}`);
                res.send(err, 400);
            }
        });

        if (enableCompression) {
            // GZIP all assets
            app.use(compression());
        }
        app.use(
            bodyParser.json({
                limit: packageLimit,
                extended: false
            })
        );
        app.use(
            bodyParser.urlencoded({
                limit: packageLimit,
                extended: true
            })
        );
        app.use(
            bodyParser.raw({
                limit: packageLimitFile,
                verify: rawBodySaver,
                type() {
                    return true;
                }
            })
        );
        app.use(queryParser());

        // get device info
        app.use((req, res, next) => {
            const ua = parser(req.headers['user-agent']);
            req.device_info = ua;
            next();
        });

        app.use((req, res, next) => {
            next();
        });

        // for security
        app.use(helmet());
        app.use(helmet.noSniff());
        app.use(noSniff());
        app.get('/', (req, res) => {
            res.send(200);
        });

        // cors
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            // Set to true if you need the website to include cookies in the requests sent
            res.setHeader('Access-Control-Allow-Credentials', true);
            // Pass to next layer of middleware
            next();
        });

        if (process.env.NODE_ENV !== 'test') {
            logger.info(`The application run on port: ${port}`);
            app.start(port);
        }
        return app;
    } catch (error) {
        logger.error(`Error server : ${error}`);
        return null;
    }
};

module.exports.createAPI = createAPI;
