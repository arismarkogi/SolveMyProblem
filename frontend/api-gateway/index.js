const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 8080;

app.use('/user', createProxyMiddleware({ target: 'http://user-management:3000', changeOrigin: true }));
app.use('/problem', createProxyMiddleware({ target: 'http://problem-management:3000', changeOrigin: true }));
app.use('/transaction', createProxyMiddleware({ target: 'http://transaction-service:3000', changeOrigin: true }));
app.use('/solver', createProxyMiddleware({ target: 'http://solver-service:3000', changeOrigin: true }));

app.listen(port, () => {
    console.log(`API Gateway is running on port ${port}`);
});
