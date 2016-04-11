import path from 'path';
import http from 'http';
import express from 'express';
import { listen } from 'rethinkdb-websocket-server';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../webpack.config.js';

import applyAuth from './auth/auth';
import { queryWhitelist, sessionCreator } from './auth/queries';
import { isDev, port, rethinkHost, rethinkPort } from './utils/envDefaults';

import './bot/bot.js';

const app = express();
const server = http.createServer(app);

applyAuth(app);

listen({
  httpServer: server,
  httpPath: '/db',
  dbHost: rethinkHost,
  dbPort: rethinkPort,
  unsafelyAllowAnyQuery: isDev,
  queryWhitelist,
  sessionCreator
});

// Add routes to app here:
// ex: app.use('/api', apiRoutes);

// referenced https://github.com/christianalfoni/webpack-express-boilerplate
if (isDev) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) { // eslint-disable-line prefer-arrow-callback
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '../dist/index.html')));
    res.end();
  });
} else {
  app.use('/assets', express.static('dist'));

  // This redirects any GET requests that aren't for '/' or our above-mentioned
  // routes to the home-page, letting the router on our SPA front-end handle it.
  // This way, trying to refresh a specific page of the app won't
  // end in a "cannot GET '/part/of/app'" error
  app.get('*', function response(req, res) { // eslint-disable-line prefer-arrow-callback
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

server.listen(port, () => console.log(`App Listening on port ${port}`));
