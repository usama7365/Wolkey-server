module.exports = {
  apps: [{
    name: 'welocky-api',
    script: 'node',
    args: 'app.js',
    watch: false,
    autorestart: true,
    instances: 1,
  }]
};
