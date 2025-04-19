/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: 'node-cjs',
  server: './server.js',
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  publicPath: '/build/',
};
