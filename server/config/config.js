// prepare the env variable
const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  const config = require('./config.json');
  const envConfig = config[env];
  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
}

if (env === 'production') {
  process.env.MONGODB_URI = 'mongodb://admin:test123@ds225703.mlab.com:25703/todoappyehor';
}