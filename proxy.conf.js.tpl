const PROXY_CONFIG = {
  '/api_book_monkey_base_path/*': {
    target: 'https://api4.angular-buch.com',
    secure: false,
    pathRewrite: {
      '^/api_book_monkey_base_path': '',
    },
    changeOrigin: true,
    logLevel: 'debug',
  },
  '/api_suitecrm_base_path/*': {
    target: 'http://127.0.0.1:8000',
    secure: false,
    pathRewrite: {
      '^/api_suitecrm_base_path': '/suitecrm',
    },
    changeOrigin: true,
    logLevel: 'debug',
  },
  '/api_laravel_base_path/*': {
    target: 'http://127.0.0.1:8000',
    secure: false,
    pathRewrite: {
      '^/api_laravel_base_path': '',
    },
    changeOrigin: true,
    logLevel: 'debug',
  },
};

module.exports = PROXY_CONFIG;
