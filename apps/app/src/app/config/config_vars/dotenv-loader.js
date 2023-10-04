const dotenv = require('dotenv');
const btoa = require('btoa');

dotenv.config();

const appEnvVars = {};

const envKeys = Object.keys(process.env);

const prefix = 'APP_ENV__';

envKeys
  .filter((key) => key.startsWith(prefix))
  .map((key) => key.substring(prefix.length))
  .forEach((key) => {
    appEnvVars[key] = ('' + process.env[prefix + key]).trim();
  });

module.exports = () => {
  return {
    code:
      'module.exports = ' + JSON.stringify(btoa(JSON.stringify(appEnvVars))),
  };
};
