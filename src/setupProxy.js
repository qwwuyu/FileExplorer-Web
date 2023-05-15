const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  if (process.env.REACT_APP_API_URL) {
    //上传文件接口支持跨域测试,本地测试使用
    app.use(
      '/i/upload',
      createProxyMiddleware({
        target: process.env.REACT_APP_API_URL,
        changeOrigin: true,
      })
    );
  }
};
