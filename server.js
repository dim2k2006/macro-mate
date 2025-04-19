const path = require('path');
const express = require('express');
const { createRequestHandler } = require('@remix-run/express');

const app = express();
const port = process.env.PORT || 3000;

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Remix fingerprints its assets so we can cache forever.
app.use('/build', express.static('public/build', { immutable: true, maxAge: '1y' }));

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', { maxAge: '1h' }));

app.all(
  '*',
  createRequestHandler({
    build: require(path.join(process.cwd(), 'build')),
    mode: process.env.NODE_ENV,
  }),
);

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
