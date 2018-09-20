'use strict';
import config from 'config';
import fs from 'fs';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import { ObjectId } from 'mongodb';

/***************Mongodb configuratrion********************/

import express from 'express';
import proxy from 'http-proxy-middleware';
import debugFactory from 'debug';
const debug = debugFactory('PACS_RIS:server');
import bodyParser from 'body-parser';
import session from 'express-session';
import http from 'http';
import https from 'https';
import chalk from 'chalk';
//import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { typeDefs, resolvers } from './graphql/schema';
import cookieParser from 'cookie-parser';
import expressValidator from 'express-validator';
import MongoStoreFactory from 'connect-mongo';
const MongoStore = MongoStoreFactory(session);
import responseTime from 'response-time';
let privateKey = fs.readFileSync('./keys/ca.key', 'utf8');
let certificate = fs.readFileSync('./keys/ca.pem', 'utf8');
let credentials = { key: privateKey, cert: certificate };
import routeDashboard2 from './routes/dashboard2';
import getGraphlContext from './utils/getGraphqlContext';
import { connectDb, getDb } from './mongodb';
import { cUser } from './models/user';
import routeIan from './routes/ian';

/***************Global Functions************************/
// Watcher
let app = express();

// import './controller/watcher/watcher';
import { Server } from 'tls';

// create local upload folder if not exist

async function initApp() {
  await connectDb();
  if (!fs.existsSync(config.get('localPath'))) {
    fs.mkdirSync(config.get('localPath'));
  }
  // view engine setup

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(cookieParser());
  app.use(expressValidator());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(
    session({
      secret: config.get('sessionSecret'),
      store: new MongoStore({
        db: getDb(),
        // url: config.mongodb.uri,
        // ttl: 14 * 24 * 60 * 60, // = 14 days. Default
      }),
      resave: false,
      saveUninitialized: true,
      cookie: {},
    }),
  );
  app.use((req, res, next) => {
    if (req.session.userId) {
      // this is simple solution to know which radiologists are around, likely it will be replaced with more accurate technique
      cUser().updateOne(
        { _id: new ObjectId(req.session.userId) },
        { $set: { lastSeenOnline: new Date() } },
      );
    }
    next();
  });

  /*
  app.use((req, res, next) => {
      if (req.session.userId) {
          User.findOne({_id: req.session.userId}).then(user => {
              if(user) {
                  req.user = req.session.user;
              }
          })
      }
      req.user = req.session.user;
      next();
  });
  */
  // app.use('/', rootRequire('routes/dashboard2'));
  // app.use('/datafeed', rootRequire('routes/datafeed'));
  // app.use('/admin', rootRequire('routes/admin'));
  // app.use('/dashboard', rootRequire('routes/dashboard'));
  // app.use('/login', rootRequire('routes/dashboard2'));
  // app.use('/administration/study-description', rootRequire('routes/dashboard2'));
  // app.use('/administration/facilities', rootRequire('routes/dashboard2'));
  // app.use('/administration/facility', rootRequire('routes/dashboard2'));
  // app.use('/administration', rootRequire('routes/dashboard2'));
  // app.use('/studies', rootRequire('routes/studies'));
  // app.use('/api', rootRequire('routes/utilities'));
  // app.use('/medpoint', rootRequire('routes/medpoint'));
  // app.use('/notification', rootRequire('routes/notification'));
  // app.use('/facilities', rootRequire('routes/facilities'));
  // app.use('/permissions', rootRequire('routes/permissions'));
  // app.use('/settings', rootRequire('routes/settings'));
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    context: async ({ req }) => ({
      ...(await getGraphlContext(new ObjectId(req.session.userId))),
      req,
    }),
    formatError(error) {
      console.log(error);
      if (error.extensions.exception) {
        console.log(error.extensions.exception.stacktrace);
      }
      return error;
    },
  });

  apolloServer.applyMiddleware({ app, gui: true });
  /*app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress(async req => {
      return { schema, context: { ...(await getGraphlContext(req.session.userId)), req: req } };
    }),
  );*/
  // app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

  if (process.env.NODE_ENV === 'development') {
    app.use('/static', proxy({ target: 'http://localhost:3001', changeOrigin: true }));
  } else {
    app.use('/static', express.static('public'));
  }

  // app.use('/static', express.static('public'));
  app.use('/', routeDashboard2);
  app.use('/api', routeIan);

  app.use(responseTime());

  /*app.all('*', (req, res) => {
      log('all');
      if (!req.session.user)
          res.redirect("/");
      else
          res.redirect('/dashboard');
  });*/

  app.set('port', config.get('port'));

  // http server for webapp

  let server = http.createServer(app).listen(config.get('port'));
  server.on('error', onError);
  server.on('listening', onListening);

  // https server for medpoint app
  let httpsServer = https.createServer(credentials, app).listen(5000);

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.log(chalk.red(config.get('port') + ' requires elevated privileges'));
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.log(chalk.red(config.get('port') + ' is already in use'));
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  /**
   * Event listener for HTTP server "listening" event.
   */
  function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log(
      chalk.green.bold(
        `http  server listening on port : ${config.get('port')}  running with ${config.get(
          'name',
        )}`,
      ),
    );
    debug('Listening on ' + bind);
  }
}

initApp();

export default app;
